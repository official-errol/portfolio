import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://acyznbhlahvuzrjjrlyj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjeXpuYmhsYWh2dXpyampybHlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1OTgzNDgsImV4cCI6MjA2NTE3NDM0OH0.eaKsGvbn2f8CQOF6agLASqnGLfoG7dZEg7xnmuhKc84'
)

export default async function handler(_req, res) {
  const staticPages = [
    '',
    'about',
    'projects',
    'services',
    'chat',
    'contact',
    'blog',
  ]

  const { data: posts, error } = await supabase
    .from('posts')
    .select('slug, created_at')

  if (error || !posts) {
    console.error('Failed to fetch posts:', error)
    return res.status(500).send('Error fetching blog posts')
  }

  const today = new Date().toISOString().split('T')[0]

  const staticUrls = staticPages.map(path => `
    <url>
      <loc>https://www.errolsolomon.me/${path}</loc>
      <lastmod>${today}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${path === '' ? '1.0' : '0.7'}</priority>
    </url>`).join('\n')

  const blogUrls = posts.map(post => `
    <url>
      <loc>https://www.errolsolomon.me/blog/${post.slug}</loc>
      <lastmod>${new Date(post.created_at).toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>`).join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticUrls}
    ${blogUrls}
  </urlset>`

  res.setHeader('Content-Type', 'application/xml')
  res.status(200).send(sitemap)
}
