import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { useLocation } from 'react-router-dom'
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline'
import {
  HandThumbUpIcon as HandThumbUpSolid,
  HandThumbDownIcon as HandThumbDownSolid,
} from '@heroicons/react/24/solid'

interface Comment {
  id: string
  user_name: string
  user_avatar: string
  content: string
  created_at: string
  parent_id: string | null
}

interface Reaction {
  comment_id: string
  user_id: string
  reaction_type: 'like' | 'dislike'
}

export const CommentSection: React.FC<{ postId: string }> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const location = useLocation()

  useEffect(() => {
    fetchComments()
    fetchReactions()

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null)
    })

    supabase.auth.getUser().then(resp => setUser(resp.data.user))
    return () => listener?.subscription.unsubscribe()
  }, [])

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    setComments(data || [])
  }

  const fetchReactions = async () => {
    const { data } = await supabase.from('comment_reactions').select('*')
    setReactions(data || [])
  }

  const userReaction = (commentId: string) =>
    reactions.find(r => r.comment_id === commentId && r.user_id === user?.id)?.reaction_type

  const getCount = (commentId: string, type: 'like' | 'dislike') =>
    reactions.filter(r => r.comment_id === commentId && r.reaction_type === type).length

  const handleReaction = async (commentId: string, type: 'like' | 'dislike') => {
    if (!user) return

    const existing = reactions.find(r => r.comment_id === commentId && r.user_id === user.id)

    if (existing) {
      if (existing.reaction_type === type) {
        await supabase
          .from('comment_reactions')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id)

        setReactions(reactions.filter(r => !(r.comment_id === commentId && r.user_id === user.id)))
      } else {
        await supabase
          .from('comment_reactions')
          .update({ reaction_type: type })
          .eq('comment_id', commentId)
          .eq('user_id', user.id)

        setReactions(reactions.map(r =>
          r.comment_id === commentId && r.user_id === user.id
            ? { ...r, reaction_type: type }
            : r
        ))
      }
    } else {
      await supabase.from('comment_reactions').insert({
        comment_id: commentId,
        user_id: user.id,
        reaction_type: type
      })

      setReactions([...reactions, { comment_id: commentId, user_id: user.id, reaction_type: type }])
    }
  }

  const addComment = async (parent_id: string | null = null) => {
    if (!user || newComment.trim() === '') return

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      user_id: user.id,
      user_name: user.user_metadata?.full_name || 'Anonymous',
      user_avatar: user.user_metadata?.avatar_url || '',
      content: newComment.trim(),
      parent_id
    })

    if (!error) {
      setNewComment('')
      setReplyTo(null)
      fetchComments()
    }
  }

  const redirectToLogin = (provider: 'google' | 'github') => {
    supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}${location.pathname}`
      }
    })
  }

  const renderComment = (comment: Comment) => {
    const userReacted = userReaction(comment.id)

    return (
      <div
        key={comment.id}
        className={`${
          comment.parent_id ? 'border-t pt-3' : 'border-b'
        } border-gray-200 pb-3`}
      >
        <div className="flex items-start gap-3">
          <img src={comment.user_avatar} alt={comment.user_name} className="w-8 h-8 rounded-full" />
          <div className="flex-1">
            <p className="text-sm font-semibold">{comment.user_name}</p>
            <p className="text-sm">{comment.content}</p>

            {user && (
              <div className="flex gap-6 mt-2 text-sm items-center text-gray-500">
                <button onClick={() => handleReaction(comment.id, 'like')} className="flex items-center gap-1">
                  {userReacted === 'like' ? (
                    <HandThumbUpSolid className="w-4 h-4 text-blue-600" />
                  ) : (
                    <HandThumbUpIcon className="w-4 h-4" />
                  )}
                  <span>{getCount(comment.id, 'like')}</span>
                </button>

                <button onClick={() => handleReaction(comment.id, 'dislike')} className="flex items-center gap-1">
                  {userReacted === 'dislike' ? (
                    <HandThumbDownSolid className="w-4 h-4 text-red-600" />
                  ) : (
                    <HandThumbDownIcon className="w-4 h-4" />
                  )}
                  <span>{getCount(comment.id, 'dislike')}</span>
                </button>

                <button
                  onClick={() => setReplyTo(comment.id)}
                  className="flex items-center gap-1 hover:underline"
                >
                  <ArrowUturnLeftIcon className="w-4 h-4" />
                  Reply
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Replies */}
        <div className="ml-10 mt-2 space-y-3">
          {comments
            .filter(r => r.parent_id === comment.id)
            .map(reply => renderComment(reply))}
        </div>

        {/* Reply input box */}
        {replyTo === comment.id && (
          <div className="ml-10 mt-3 flex items-start gap-3">
            <img
              src={user.user_metadata?.avatar_url}
              alt={user.user_metadata?.full_name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <textarea
                className="w-full border p-2 rounded resize-none mb-2"
                rows={2}
                placeholder="Write a reply..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => addComment(comment.id)}
                  className="bg-main text-white px-4 py-1 rounded hover:bg-main-dark"
                >
                  Reply
                </button>
                <button onClick={() => setReplyTo(null)} className="text-sm text-gray-500 hover:underline">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>

      {/* Comment List */}
      <div className="space-y-4">
        {comments.filter(c => c.parent_id === null).map(renderComment)}
      </div>

      {/* Authenticated: Show comment form */}
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
              onClick={() => addComment(null)}
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
