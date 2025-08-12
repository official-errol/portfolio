// app/api/chat/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // service role key for server-side
const GROQ_API_KEY = process.env.GROQ_API_KEY;                  // Groq API key
const ESP32_SECRET = process.env.ESP32_SECRET;                  // secret shared with ESP32
const SITE_DOMAIN = process.env.SITE_DOMAIN || 'errolsolomon.me';

// basic token estimation: ~4 chars per token (approx). tune as needed
function estimateTokens(text){
  if(!text) return 0;
  return Math.max(1, Math.ceil(text.length / 4));
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

// Constants
const MODEL = process.env.GROQ_MODEL || 'mixtral-8x7b'; // set preferred groq model
const TOKEN_LIMIT = Number(process.env.CHAT_TOKEN_LIMIT || 6000); // safe upper limit
const SUMMARIZE_THRESHOLD = Number(process.env.SUMMARIZE_THRESHOLD || 4000); // when to compress

export async function POST(req) {
  try {
    if (req.headers.get('content-type')?.indexOf('application/json') === -1) {
      return NextResponse.json({ error: 'Invalid content-type' }, { status: 400 });
    }
    const body = await req.json();
    const { deviceId, message, authKey } = body;
    if (!deviceId || !message || !authKey) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    // auth check
    if (authKey !== ESP32_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Save user message
    const userTokens = estimateTokens(message);
    await supabase
      .from('conversations')
      .insert([{ device_id: deviceId, role: 'user', content: message, tokens_est: userTokens }]);

    // Load recent messages and summaries to build context
    // Fetch the latest summaries first (most recent), then messages
    const { data: summaries } = await supabase
      .from('conversation_summaries')
      .select('summary,created_at')
      .eq('device_id', deviceId)
      .order('created_at', { ascending: false })
      .limit(3);

    // Fetch recent messages (descending)
    const { data: msgs } = await supabase
      .from('conversations')
      .select('role,content,tokens_est,created_at')
      .eq('device_id', deviceId)
      .order('created_at', { ascending: false })
      .limit(60);

    // Build message array (oldest -> newest)
    const messageList = [];

    // include a persistent system prompt at top
    messageList.push({
      role: 'system',
      content: `You are a helpful assistant for ${SITE_DOMAIN}. Keep replies concise, use friendly tone. If there's a "MEMORY:" summary available, use it for context.`
    });

    // add most recent summaries (oldest first)
    if (summaries && summaries.length) {
      // reverse to keep chronological order
      summaries.reverse().forEach(s => {
        messageList.push({ role: 'system', content: `MEMORY: ${s.summary}` });
      });
    }

    // add messages in chronological order
    const revMsgs = (msgs || []).slice().reverse();
    revMsgs.forEach(m => {
      messageList.push({ role: m.role, content: m.content });
    });

    // finally add the latest user message (just inserted) - but it may already be in msgs; ensure not duplicated
    // (we'll append again to be safe)
    messageList.push({ role: 'user', content: message });

    // Estimate tokens and trim if necessary
    let totalTokens = messageList.reduce((s, m) => s + estimateTokens(m.content || ''), 0);

    // If tokens exceed threshold, prune oldest user/assistant messages (but keep system and summaries),
    // and if still large, trigger summarization job to compress oldest portion.
    if (totalTokens > TOKEN_LIMIT) {
      // remove oldest non-system messages while > TOKEN_LIMIT
      let i = 0;
      while (totalTokens > TOKEN_LIMIT && i < messageList.length) {
        if (messageList[i].role === 'system') { i++; continue; }
        totalTokens -= estimateTokens(messageList[i].content || '');
        messageList.splice(i, 1);
      }
    }

    // If tokens still exceed summarize threshold, create a summary of the oldest half of messages
    if (totalTokens > SUMMARIZE_THRESHOLD) {
      // build text to summarize: take first N messages excluding system
      const toSummarize = messageList
        .filter(m => m.role !== 'system')
        .slice(0, Math.ceil((messageList.length) / 2))
        .map(m => `${m.role.toUpperCase()}: ${m.content}`)
        .join('\n\n');

      const summaryPrompt = [
        { role: 'system', content: 'You are a summarization assistant. Compress the following conversation into a short set of persistent facts and relevant user preferences. Answer in 2-3 short bullet sentences.' },
        { role: 'user', content: `Summarize this conversational history into compact memory notes:\n\n${toSummarize}` }
      ];

      // call Groq for summarization
      const summaryResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: MODEL,
          messages: summaryPrompt,
          max_tokens: 200
        })
      });

      const summaryJson = await summaryResp.json();
      const summaryText = summaryJson?.choices?.[0]?.message?.content?.trim() || null;

      if (summaryText) {
        // store summary in DB
        await supabase.from('conversation_summaries').insert([{ device_id: deviceId, summary: summaryText }]);

        // remove the summarized part from conversations to free tokens: delete oldest N rows
        // we'll delete the oldest half of non-system messages
        const oldestIdsRes = await supabase
          .from('conversations')
          .select('id,created_at')
          .eq('device_id', deviceId)
          .order('created_at', { ascending: true })
          .limit(Math.ceil((revMsgs.length) / 2));

        if (oldestIdsRes.data && oldestIdsRes.data.length) {
          const idsToDelete = oldestIdsRes.data.map(r => r.id);
          await supabase.from('conversations').delete().in('id', idsToDelete);
        }

        // rebuild context: include the new summary as system note
        messageList.unshift({ role: 'system', content: `MEMORY: ${summaryText}` });
      }
    }

    // Call Groq Chat Completions
    const groqBody = {
      model: MODEL,
      messages: messageList
    };

    const groqResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(groqBody)
    });

    const groqJson = await groqResp.json();
    const assistantReply = groqJson?.choices?.[0]?.message?.content || 'Sorry, no reply.';

    // Save assistant reply
    const assistantTokens = estimateTokens(assistantReply);
    await supabase.from('conversations')
      .insert([{ device_id: deviceId, role: 'assistant', content: assistantReply, tokens_est: assistantTokens }]);

    // Return reply
    return NextResponse.json({ reply: assistantReply });
  } catch (err) {
    console.error('chat error', err);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
