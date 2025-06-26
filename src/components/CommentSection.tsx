import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { useLocation } from 'react-router-dom'

interface Comment {
  id: string
  user_name: string
  user_avatar: string
  content: string
  created_at: string
}

export const CommentSection: React.FC<{ postId: string }> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [user, setUser] = useState<any>(null)
  const location = useLocation()

  useEffect(() => {
    fetchComments()
    supabase.auth.onAuthStateChange((_, session) => setUser(session?.user))
    supabase.auth.getUser().then(resp => setUser(resp.data.user))
  }, [])

  const fetchComments = async () => {
    let { data } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at')
    setComments(data || [])
  }

  const addComment = async () => {
    if (!user || newComment.trim() === '') return

    await supabase.from('comments').insert({
      post_id: postId,
      user_id: user.id,
      user_name: user.user_metadata.full_name,
      user_avatar: user.user_metadata.avatar_url,
      content: newComment
    })

    setNewComment('')
    fetchComments()
  }

  const redirectToLogin = (provider: 'google' | 'github') => {
    supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}${location.pathname}`
      }
    })
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>

      {/* Comment List */}
      <div className="space-y-4 mb-6">
        {comments.map(c => (
          <div key={c.id} className="border-b border-gray-200 pb-2 flex items-start gap-3">
            <img src={c.user_avatar} alt={c.user_name} className="w-8 h-8 rounded-full" />
            <div>
              <p className="text-sm font-semibold">{c.user_name}</p>
              <p className="text-sm">{c.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Authenticated: Show comment form */}
      {user ? (
        <div className="flex items-start gap-3">
          <img
            src={user.user_metadata.avatar_url}
            alt={user.user_metadata.full_name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col flex-grow">
            <textarea
              className="border border-gray-300 p-2 rounded w-full mb-2 resize-none"
              rows={2}
              placeholder="Write a comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
            />
            <button
              onClick={addComment}
              className="self-end bg-main text-white px-4 py-1 rounded hover:bg-main-dark"
            >
              Post
            </button>
          </div>
        </div>
      ) : (
        // Not Authenticated: Show login buttons
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Please sign in to comment:</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => redirectToLogin('google')}
              className="flex items-center gap-3 px-4 py-2 bg-white border rounded hover:shadow"
            >
              <img
                src="https://cdn.freebiesupply.com/logos/large/2x/google-icon-logo-png-transparent.png"
                alt="Google"
                className="w-5 h-5"
              />
              Sign in with Google
            </button>
            <button
              onClick={() => redirectToLogin('github')}
              className="flex items-center gap-3 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                alt="GitHub"
                className="w-5 h-5 bg-white rounded-full p-0.5"
              />
              Sign in with GitHub
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
