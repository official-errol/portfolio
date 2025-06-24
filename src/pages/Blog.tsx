import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { Link } from 'react-router-dom'

interface Post { id: string; title: string; slug: string; content: string; created_at: string }

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    supabase
      .from('posts')
      .select('id, title, slug, content, created_at')
      .order('created_at', { ascending: false })
      .then(res => setPosts(res.data || []))
  }, [])

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6 text-main-dark">Blog</h1>
      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post.id}>
            <Link
              to={`/blog/${post.slug}`}
              className="block p-4 border border-gray-300 rounded hover:bg-gray-50"
            >
              <h2 className="text-2xl font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Blog
