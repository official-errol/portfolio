import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

interface Post {
  id: string
  title: string
  slug: string
  content: string
  created_at: string
  media_url?: string
  media_type?: 'image' | 'video' | 'youtube'
}

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    supabase
      .from('posts')
      .select('id, title, slug, content, created_at, media_url, media_type')
      .order('created_at', { ascending: false })
      .then(res => setPosts(res.data || []))
  }, [])

  return (
    <>
      <Helmet>
        <link rel="canonical" href="https://www.errolsolomon.me/blog" />
      </Helmet>

      <div className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Blog List */}
        <div className="lg:col-span-3 space-y-6">
          <h1 className="text-4xl font-bold text-main-dark mb-4">Blog</h1>
          <ul className="space-y-4">
            {posts.map(post => (
              <li key={post.id}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="flex gap-4 items-start border border-gray-200 rounded-lg overflow-hidden hover:bg-gray-50 transition"
                >
                  {/* Thumbnail */}
                  {post.media_type === 'image' && post.media_url ? (
                    <img
                      src={post.media_url}
                      alt={post.title}
                      className="w-32 h-24 object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-32 h-24 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                      No Image
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 py-2 pr-2">
                    <h2 className="text-xl font-semibold text-main-dark">{post.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Ads Sidebar */}
        <aside className="hidden lg:block space-y-4">
          <div className="p-4 border border-gray-200 rounded bg-white shadow-sm">
            <h3 className="font-semibold text-lg text-main-dark mb-2">Advertisement</h3>
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
              Ad Space
            </div>
          </div>
          <div className="p-4 border border-gray-200 rounded bg-white shadow-sm">
            <h3 className="font-semibold text-lg text-main-dark mb-2">Sponsored</h3>
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
              Sponsored Ad
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}

export default Blog
