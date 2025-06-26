import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { useLocation } from 'react-router-dom'
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline'

interface Comment {
  id: string
  user_name: string
  user_avatar: string
  content: string
  created_at: string
  likes: string[]
  dislikes: string[]
  parent_id?: string
}

export const CommentSection: React.FC<{ postId: string }> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const location = useLocation()

  useEffect(() => {
    fetchComments()
    supabase.auth.getUser().then(res => setUser(res.data.user))
    supabase.auth.onAuthStateChange((_, session) => setUser(session?.user))
  }, [])

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at')
    setComments(data || [])
  }

  const handleVote = async (id: string, type: 'like' | 'dislike') => {
    if (!user) return
    const comment = comments.find(c => c.id === id)
    if (!comment) return

    const liked = comment.likes.includes(user.id)
    const disliked = comment.dislikes.includes(user.id)

    const updatedLikes = type === 'like'
      ? liked ? comment.likes.filter(uid => uid !== user.id) : [...comment.likes, user.id]
      : comment.likes.filter(uid => uid !== user.id)

    const updatedDislikes = type === 'dislike'
      ? disliked ? comment.dislikes.filter(uid => uid !== user.id) : [...comment.dislikes, user.id]
      : comment.dislikes.filter(uid => uid !== user.id)

    await supabase
      .from('comments')
      .update({ likes: updatedLikes, dislikes: updatedDislikes })
      .eq('id', id)

    fetchComments()
  }

  const addComment = async () => {
    if (!user || newComment.trim() === '') return

    await supabase.from('comments').insert({
      post_id: postId,
      user_id: user.id,
      user_name: user.user_metadata.full_name,
      user_avatar: user.user_metadata.avatar_url,
      content: newComment,
      parent_id: replyTo,
      likes: [],
      dislikes: []
    })

    setNewComment('')
    setReplyTo(null)
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

  const renderReplies = (parentId: string) => {
    return comments
      .filter(c => c.parent_id === parentId)
      .map(reply => (
        <div key={reply.id} className="ml-10 mt-2 border-l border-gray-200 pl-4">
          <div className="flex gap-3">
            <img src={reply.user_avatar} alt={reply.user_name} className="w-6 h-6 rounded-full" />
            <div>
              <p className="text-sm font-semibold">{reply.user_name}</p>
              <p className="text-sm">{reply.content}</p>
              {user && (
                <div className="flex gap-2 mt-1 text-xs text-gray-500">
                  <button onClick={() => handleVote(reply.id, 'like')} className="flex items-center gap-1 hover:text-green-600">
                    <HandThumbUpIcon className="w-4 h-4" /> {reply.likes.length}
                  </button>
                  <button onClick={() => handleVote(reply.id, 'dislike')} className="flex items-center gap-1 hover:text-red-600">
                    <HandThumbDownIcon className="w-4 h-4" /> {reply.dislikes.length}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>

      <div className="space-y-4 mb-6">
        {comments.filter(c => !c.parent_id).map(c => (
          <div key={c.id} className="border-b border-gray-200 pb-2">
            <div className="flex gap-3">
              <img src={c.user_avatar} alt={c.user_name} className="w-8 h-8 rounded-full" />
              <div>
                <p className="text-sm font-semibold">{c.user_name}</p>
                <p className="text-sm">{c.content}</p>

                {user && (
                  <div className="flex gap-4 text-xs mt-1 text-gray-500">
                    <button onClick={() => handleVote(c.id, 'like')} className="flex items-center gap-1 hover:text-green-600">
                      <HandThumbUpIcon className="w-4 h-4" /> {c.likes.length}
                    </button>
                    <button onClick={() => handleVote(c.id, 'dislike')} className="flex items-center gap-1 hover:text-red-600">
                      <HandThumbDownIcon className="w-4 h-4" /> {c.dislikes.length}
                    </button>
                    <button onClick={() => setReplyTo(c.id)} className="hover:text-main-dark">Reply</button>
                  </div>
                )}
              </div>
            </div>

            {/* Replies */}
            {renderReplies(c.id)}

            {/* Reply Form */}
            {user && replyTo === c.id && (
              <div className="flex gap-3 mt-3 ml-10">
                <img src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} className="w-6 h-6 rounded-full" />
                <div className="flex flex-col flex-grow">
                  <textarea
                    className="border border-gray-300 p-2 rounded w-full mb-2 resize-none text-sm"
                    rows={2}
                    placeholder="Write a reply..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => { setReplyTo(null); setNewComment('') }} className="text-xs text-gray-500">Cancel</button>
                    <button onClick={addComment} className="bg-main text-white px-3 py-1 rounded text-sm">Reply</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {user ? (
        <div className="flex items-start gap-3">
          <img src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} className="w-10 h-10 rounded-full" />
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
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Please sign in to comment:</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => redirectToLogin('google')}
              className="flex items-center gap-3 px-4 py-2 bg-white border rounded hover:shadow"
            >
              <img src="https://cdn.freebiesupply.com/logos/large/2x/google-icon-logo-png-transparent.png" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>
            <button
              onClick={() => redirectToLogin('github')}
              className="flex items-center gap-3 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" className="w-5 h-5 bg-white rounded-full p-0.5" />
              Sign in with GitHub
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
