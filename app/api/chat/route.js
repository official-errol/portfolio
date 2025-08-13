import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

// Smart context windowing function
function buildOptimalContext(messages, currentMessage) {
  // 1. Always include system prompt with memory instructions
  const conversation = [{
    role: 'system',
    content: `You are Errol's personal AI assistant with perfect memory. You remember EVERY detail unless told to forget. Current date: ${new Date().toLocaleDateString()}.`
  }];

  // 2. Include first 3 exchanges (establishes context)
  const initialContext = messages.slice(0, 6); // 3 exchanges (user + assistant pairs)
  conversation.push(...initialContext);

  // 3. Include last 10 exchanges (recent context)
  const recentContext = messages.slice(-20); // Last 10 exchanges
  conversation.push(...recentContext);

  // 4. Include all statements that look like facts (short, no questions)
  const likelyFacts = messages.filter(msg => 
    msg.role === 'user' && 
    msg.content.length < 150 && 
    !msg.content.endsWith('?')
  );
  conversation.push(...likelyFacts);

  // 5. Add current message
  conversation.push({
    role: 'user',
    content: currentMessage
  });

  // 6. Deduplicate while preserving order
  const uniqueConversation = [];
  const seenContent = new Set();
  
  for (const msg of conversation) {
    const contentKey = `${msg.role}:${msg.content}`;
    if (!seenContent.has(contentKey)) {
      seenContent.add(contentKey);
      uniqueConversation.push(msg);
    }
  }

  return uniqueConversation;
}

export async function POST(req) {
  try {
    if (req.headers.get('content-type') !== 'application/json') {
      return NextResponse.json({ error: 'Invalid content-type' }, { status: 400 });
    }

    const body = await req.json();
    console.log('Received request:', body);

    if (!body.deviceId || !body.message || !body.authKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.authKey !== process.env.ESP32_SECRET) {
      console.error('Authentication failed');
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

    // Get COMPLETE conversation history
    const { data: messages, error: messagesError } = await supabase
      .from('conversations')
      .select('role, content, created_at')
      .eq('device_id', body.deviceId)
      .order('created_at', { ascending: true });
    if (messagesError) throw messagesError;

    // Build optimized conversation context
    const conversation = buildOptimalContext(messages, body.message);

    // Call Groq
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'mixtral-8x7b',
        messages: conversation,
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!groqResponse.ok) {
      const error = await groqResponse.text();
      console.error('Groq API error:', error);
      return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
    }

    const groqData = await groqResponse.json();
    let reply = groqData.choices?.[0]?.message?.content || 'One moment please';

    // Get Deepgram audio
    const deepgramResponse = await fetch('https://api.deepgram.com/v1/speak?model=aura-2-amalthea-en', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: reply })
    });

    if (!deepgramResponse.ok) {
      throw new Error('Deepgram TTS failed');
    }

    const audioBuffer = await deepgramResponse.arrayBuffer();
    const fileName = `${uuidv4()}.mp3`;

    // Save MP3 to Supabase storage
    const { error: uploadError } = await supabase
      .storage
      .from('tts-audio')
      .upload(fileName, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: false
      });
    if (uploadError) throw uploadError;

    // Get public URL
    const { data: publicUrlData } = supabase
      .storage
      .from('tts-audio')
      .getPublicUrl(fileName);

    // Save assistant message
    const { error: assistantMsgError } = await supabase
      .from('conversations')
      .insert([{ 
        device_id: body.deviceId, 
        role: 'assistant', 
        content: reply 
      }]);
    if (assistantMsgError) throw assistantMsgError;

    return NextResponse.json({
      reply,
      audioStreamUrl: publicUrlData.publicUrl
    });

  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
