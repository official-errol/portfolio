import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { LikeButton } from '../components/LikeButton'
import { CommentSection } from '../components/CommentSection'
import { SocialShare } from '../components/SocialShare'
import LoadingSpinner from '../components/LoadingSpinner'

interface Post {
  id: string
  title: string
  content: string
  author: string
  category: string
  tags: string[]
  created_at: string
}

const BlogPost: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])
  const { slug } = useParams()

  useEffect(() => {
    supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single()
      .then((res) => setPost(res.data || null))
  }, [slug])

  useEffect(() => {
    if (post) {
      supabase
        .from('posts')
        .select('*')
        .neq('id', post.id)
        .eq('category', post.category)
        .limit(5)
        .then((res) => setRelatedPosts(res.data || []))
    }
  }, [post])

  useEffect(() => {
    try {
      // Load Google AdSense ad
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {}
  }, [])

  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto p-4 bg-white">
      {/* Main Content */}
      <div className="md:w-2/3 pr-6">
        <h1 className="text-4xl font-bold text-main-dark mb-2">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-2">
          By {post.author} • {new Date(post.created_at).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-500 mb-4">{post.category}</p>

        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="prose max-w-none mt-4"
        />

        <div className="flex flex-wrap gap-2 mt-6">
          {post.tags.map(t => (
            <span key={t} className="text-xs bg-gray-200 px-2 py-1 rounded">{t}</span>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-6">
          <LikeButton postId={post.id} />
          <SocialShare title={post.title} url={window.location.href} />
        </div>

        <CommentSection postId={post.id} />
      </div>

      {/* Sidebar */}
      <aside className="md:w-1/3 mt-8 md:mt-0 border-l border-gray-200 pl-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-main-dark mb-4">Related Posts</h3>
          <ul className="space-y-3">
            {relatedPosts.map(rp => (
              <li key={rp.id}>
                <a
                  href={`/blog/${rp.slug}`}
                  className="block text-sm font-medium text-main hover:underline"
                >
                  {rp.title}
                </a>
                <p className="text-xs text-gray-500">{new Date(rp.created_at).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Google Ad */}
        <div>
          <h3 className="text-lg font-bold text-main-dark mb-2">Sponsored</h3>
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-4551987474608561"
              data-ad-slot="3193255453"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
        </div>
      </aside>
    </div>
  )
}

export default BlogPost
