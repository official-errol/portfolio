import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { useLocation } from 'react-router-dom'
import { HandThumbUpIcon, HandThumbDownIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline'

interface Comment {
  id: string
  user_name: string
  user_avatar: string
  content: string
  created_at: string
  parent_id: string | null
}

interface Vote {
  comment_id: string
  vote_type: 'like' | 'dislike'
}

export const CommentSection: React.FC<{ postId: string }> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [user, setUser] = useState<any>(null)
  const [votes, setVotes] = useState<Vote[]>([])
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replies, setReplies] = useState<{ [key: string]: string }>({})
  const location = useLocation()

  useEffect(() => {
    fetchComments()
    fetchVotes()
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null)
    })
    supabase.auth.getUser().then(resp => setUser(resp.data.user))
    return () => listener?.subscription.unsubscribe()
  }, [])

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    if (!error) setComments(data || [])
  }

  const fetchVotes = async () => {
    if (!user) return
    const { data } = await supabase
      .from('comment_votes')
      .select('comment_id, vote_type')
      .eq('user_id', user.id)
    setVotes(data || [])
  }

  const handleVote = async (commentId: string, type: 'like' | 'dislike') => {
    if (!user) return
    await supabase
      .from('comment_votes')
      .upsert({ comment_id: commentId, user_id: user.id, vote_type: type })
    fetchVotes()
  }

  const handleReplySubmit = async (parentId: string) => {
    if (!user || !replies[parentId]?.trim()) return
    await supabase.from('comments').insert({
      post_id: postId,
      user_id: user.id,
      user_name: user.user_metadata?.full_name || 'Anonymous',
      user_avatar: user.user_metadata?.avatar_url || '',
      content: replies[parentId],
      parent_id: parentId
    })
    setReplies(prev => ({ ...prev, [parentId]: '' }))
    setReplyingTo(null)
    fetchComments()
  }

  const addComment = async () => {
    if (!user || newComment.trim() === '') return
    await supabase.from('comments').insert({
      post_id: postId,
      user_id: user.id,
      user_name: user.user_metadata?.full_name || 'Anonymous',
      user_avatar: user.user_metadata?.avatar_url || '',
      content: newComment.trim(),
      parent_id: null
    })
    setNewComment('')
    fetchComments()
  }

  const redirectToLogin = (provider: 'google' | 'github') => {
    supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}${location.pathname}` }
    })
  }

  const getVote = (commentId: string) => votes.find(v => v.comment_id === commentId)?.vote_type

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>

      <div className="space-y-4 mb-6">
        {comments.filter(c => !c.parent_id).map(c => (
          <div key={c.id} className="border-b border-gray-200 pb-2">
            <div className="flex items-start gap-3">
              <img src={c.user_avatar} alt={c.user_name} className="w-8 h-8 rounded-full" />
              <div className="w-full">
                <p className="text-sm font-semibold">{c.user_name}</p>
                <p className="text-sm">{c.content}</p>
                <div className="flex gap-4 text-sm mt-2">
                  <button
                    className={`flex items-center gap-1 hover:text-main ${
                      getVote(c.id) === 'like' ? 'text-main font-semibold' : ''
                    }`}
                    onClick={() => handleVote(c.id, 'like')}
                  >
                    <HandThumbUpIcon className="h-4 w-4" />
                    Like
                  </button>
                  <button
                    className={`flex items-center gap-1 hover:text-red-500 ${
                      getVote(c.id) === 'dislike' ? 'text-red-500 font-semibold' : ''
                    }`}
                    onClick={() => handleVote(c.id, 'dislike')}
                  >
                    <HandThumbDownIcon className="h-4 w-4" />
                    Dislike
                  </button>
                  {user && (
                    <button
                      className="flex items-center gap-1 hover:text-gray-600"
                      onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                    >
                      <ArrowUturnLeftIcon className="h-4 w-4" />
                      Reply
                    </button>
                  )}
                </div>

                {replyingTo === c.id && (
                  <div className="mt-2">
                    <textarea
                      rows={2}
                      value={replies[c.id] || ''}
                      onChange={e => setReplies({ ...replies, [c.id]: e.target.value })}
                      placeholder="Write a reply..."
                      className="border border-gray-300 rounded w-full p-2 text-sm"
                    />
                    <button
                      className="mt-1 px-3 py-1 bg-main text-white rounded text-sm hover:bg-main-dark"
                      onClick={() => handleReplySubmit(c.id)}
                    >
                      Post Reply
                    </button>
                  </div>
                )}

                {/* Render Replies */}
                {comments
                  .filter(reply => reply.parent_id === c.id)
                  .map(reply => (
                    <div key={reply.id} className="ml-6 mt-3 flex gap-3">
                      <img src={reply.user_avatar} className="w-7 h-7 rounded-full" />
                      <div>
                        <p className="text-sm font-semibold">{reply.user_name}</p>
                        <p className="text-sm">{reply.content}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Comment */}
      {user ? (
        <div className="flex items-start gap-3">
          <img
            src={user.user_metadata?.avatar_url}
            alt={user.user_metadata?.full_name}
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
