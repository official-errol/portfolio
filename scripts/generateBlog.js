import fetch from 'node-fetch'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

const generatePost = async () => {
  const useImage = Math.random() > 0.5

  const prompt = `
Write a 200–300 word blog post on a general topic that fits into lifestyle, productivity, personal growth, creativity, AI tools, modern tech, wellness, motivation, or life hacks.

You may choose the specific topic.

Structure your response like this:
Title: [catchy title]
Category: [one word like Productivity, Tech, Motivation, Lifestyle]
Tags: [3 to 5 comma-separated tags]
Media Suggestion: [short image description or YouTube keyword]
Content:
[the blog content goes here — friendly, helpful, and natural. Do not say it's written by AI.]
`.trim()

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await res.json()
    const message = data.choices?.[0]?.message?.content || ''

    const title = message.match(/Title:\s*(.*)/)?.[1]?.trim() || 'Untitled'
    const category = message.match(/Category:\s*(.*)/)?.[1]?.trim() || 'General'
    const tagsStr = message.match(/Tags:\s*(.*)/)?.[1] || ''
    const mediaSuggestion = message.match(/Media Suggestion:\s*(.*)/)?.[1]?.trim() || ''
    const content = message.split(/Content:/)[1]?.trim() || ''
    const tags = tagsStr.split(',').map(tag => tag.trim()).filter(Boolean)

    let media_url = ''
    let media_type = null

    if (useImage) {
      try {
        const imgRes = await fetch(`https://source.unsplash.com/featured/?${encodeURIComponent(mediaSuggestion || category)}`)
        media_url = imgRes.url
        media_type = 'image'
      } catch {
        media_url = 'https://source.unsplash.com/featured/?inspiration'
        media_type = 'image'
      }
    } else {
      try {
        const ytRes = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(mediaSuggestion || category)}`)
        const html = await ytRes.text()
        const videoIdMatch = html.match(/"videoId":"(.*?)"/)
        if (videoIdMatch?.[1]) {
          media_url = `https://www.youtube.com/watch?v=${videoIdMatch[1]}`
          media_type = 'youtube'
        } else {
          throw new Error('No video found')
        }
      } catch {
        media_url = 'https://source.unsplash.com/featured/?motivation'
        media_type = 'image'
      }
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const { error } = await supabase.from('posts').insert([{
      title,
      slug,
      content,
      author: 'Errol Solomon',
      category,
      tags,
      media_url,
      media_type
    }])

    if (error) {
      console.error('❌ Supabase insert failed:', error)
    } else {
      console.log(`✅ Blog post saved: "${title}"`)
    }
  } catch (err) {
    console.error('🚫 Error generating blog:', err)
  }
}

generatePost()
