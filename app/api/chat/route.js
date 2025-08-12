import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with better error handling
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
  db: { schema: 'public' }
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

    // Create basic conversation context
    const messages = [
      {
        role: 'system',
        content: `You are a helpful assistant for ${process.env.SITE_DOMAIN || 'errolsolomon.me'}. 
                 Be friendly and concise in your responses.`
      },
      {
        role: 'user',
        content: body.message
      }
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
        messages,
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
    const reply = groqData.choices?.[0]?.message?.content || 'Sorry, I couldn\'t process that.';

    // Log the conversation (simplified for now)
    await supabase
      .from('conversations')
      .insert([
        { device_id: body.deviceId, role: 'user', content: body.message },
        { device_id: body.deviceId, role: 'assistant', content: reply }
      ]);

    return NextResponse.json({ reply });
    
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
