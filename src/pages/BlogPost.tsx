import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { LikeButton } from '../components/LikeButton'
import { CommentSection } from '../components/CommentSection'
import { SocialShare } from '../components/SocialShare'

interface Post { id: string; title: string; content: string; author: string; category: string; tags: string[]; created_at: string }

const BlogPost: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null)
  const { slug } = useParams()

  useEffect(() => {
    supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single()
      .then((res) => setPost(res.data || null))
  }, [slug])


  if (!post) return <div className="p-10">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto p-10 bg-white">
      <h1 className="text-4xl font-bold text-main-dark mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-2">By {post.author} • {new Date(post.created_at).toLocaleDateString()}</p>
      <p className="text-sm text-gray-500">{post.category}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} className="prose max-w-none mt-6" />
      <div className="flex flex-wrap gap-2 mt-6">
        {post.tags.map(t => <span key={t} className="text-xs bg-gray-200 px-2 py-1 rounded">{t}</span>)}
      </div>
      <div className="mt-6 flex items-center gap-6">
        <LikeButton postId={post.id} />
        <SocialShare title={post.title} url={window.location.href} />
      </div>
      <CommentSection postId={post.id} />
    </div>
  )
}

export default BlogPost
