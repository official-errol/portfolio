import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

export async function POST(req) {
  try {
    // Validate request
    if (req.headers.get('content-type') !== 'application/json') {
      return NextResponse.json({ error: 'Invalid content-type' }, { status: 400 });
    }

    const body = await req.json();
    console.log('Received request:', body);

    // Validate required fields
    if (!body.deviceId || !body.message || !body.authKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify authentication
    if (body.authKey !== process.env.ESP32_SECRET) {
      console.error('Authentication failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Save user message to Supabase
    const { error: userMsgError } = await supabase
      .from('conversations')
      .insert([{ 
        device_id: body.deviceId, 
        role: 'user', 
        content: body.message 
      }]);

    if (userMsgError) throw userMsgError;

    // Get conversation history
    const { data: messages, error: messagesError } = await supabase
      .from('conversations')
      .select('role, content, created_at')
      .eq('device_id', body.deviceId)
      .order('created_at', { ascending: true });

    if (messagesError) throw messagesError;

    // Build conversation context
    const conversation = [
      {
        role: 'system',
        content: `You are Errol's personal AI assistant. Be concise and natural in responses. 
                 Only give detailed answers when explicitly asked for explanations or essays.
                 Keep most responses under 10 words unless more is needed.
                 Remember all previous conversations.`
      },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Call Groq API
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
    let reply = groqData.choices?.[0]?.message?.content || 'Sorry, I couldn\'t process that.';

    // Post-process to ensure concise responses
    reply = reply.replace(/about errolsolomon\.me/gi, '');
    reply = reply.replace(/as your assistant on .*/gi, '');
    reply = reply.replace(/welcome to your .* assistant/gi, '');
    reply = reply.trim();

    // Save assistant response
    const { error: assistantMsgError } = await supabase
      .from('conversations')
      .insert([{ 
        device_id: body.deviceId, 
        role: 'assistant', 
        content: reply 
      }]);

    if (assistantMsgError) throw assistantMsgError;

    return NextResponse.json({ reply });
    
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
