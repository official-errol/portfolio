import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

function buildOptimalContext(messages, currentMessage) {
  // 1. Core system prompt with strict response rules
  const conversation = [{
    role: 'system',
    content: `You are Errol's personal AI assistant. Follow these rules STRICTLY:
1. Maximum 10 words unless EXPLICITLY asked for more
2. Never mention word limits
3. Remember EVERYTHING from our full history
4. Current date: ${new Date().toLocaleDateString()}
5. Be naturally concise like a human assistant`
  }];

  // 2. Include first 3 exchanges (establishes baseline)
  conversation.push(...messages.slice(0, 6));

  // 3. Include last 5 exchanges (recent context)
  conversation.push(...messages.slice(-10));

  // 4. Add current message
  conversation.push({
    role: 'user',
    content: currentMessage
  });

  // 5. Deduplicate while preserving order
  return conversation.filter((msg, index, self) =>
    index === self.findIndex(m => 
      m.role === msg.role && 
      m.content === msg.content
    )
  );
}

export async function POST(req) {
  try {
    // Validate request
    if (req.headers.get('content-type') !== 'application/json') {
      return NextResponse.json({ error: 'Invalid content-type' }, { status: 400 });
    }

    const body = await req.json();
    if (!body.deviceId || !body.message || !body.authKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (body.authKey !== process.env.ESP32_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Save user message
    const { error: userMsgError } = await supabase
      .from('conversations')
      .insert([{ 
        device_id: body.deviceId, 
        role: 'user', 
        content: body.message 
      }]);
    if (userMsgError) throw userMsgError;

    // Get conversation history
    const { data: messages } = await supabase
      .from('conversations')
      .select('role, content')
      .eq('device_id', body.deviceId)
      .order('created_at', { ascending: true });

    // Build optimized context
    const conversation = buildOptimalContext(messages, body.message);

    // Call Groq with strict parameters
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b',
        messages: conversation,
        temperature: 0.3, // Lower for more focused responses
        max_tokens: 50,   // Strict token limit
        response_format: { type: "text" }
      })
    });

    if (!groqResponse.ok) {
      const error = await groqResponse.text();
      throw new Error(`Groq API error: ${error}`);
    }

    const groqData = await groqResponse.json();
    let reply = groqData.choices[0].message.content;

    // Enforce concise responses programmatically
    if (!body.message.toLowerCase().includes('explain') && 
        !body.message.toLowerCase().includes('detail')) {
      const words = reply.split(' ');
      if (words.length > 15) {
        reply = words.slice(0, 15).join(' ') + '...';
      }
    }

    // Generate TTS audio
    const deepgramResponse = await fetch('https://api.deepgram.com/v1/speak?model=aura-2-amalthea-en', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        text: reply,
        voice: 'short-story-narrator' // More concise speaking style
      })
    });

    if (!deepgramResponse.ok) {
      throw new Error('Deepgram TTS failed');
    }

    // Upload audio to storage
    const audioBuffer = await deepgramResponse.arrayBuffer();
    const fileName = `${uuidv4()}.mp3`;
    await supabase.storage
      .from('tts-audio')
      .upload(fileName, audioBuffer, {
        contentType: 'audio/mpeg'
      });

    // Save assistant response
    await supabase
      .from('conversations')
      .insert([{ 
        device_id: body.deviceId, 
        role: 'assistant', 
        content: reply 
      }]);

    return NextResponse.json({
      reply,
      audioStreamUrl: supabase.storage
        .from('tts-audio')
        .getPublicUrl(fileName).data.publicUrl
    });

  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
