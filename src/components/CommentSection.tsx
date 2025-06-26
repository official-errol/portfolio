import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'

interface Comment { id: string; user_name: string; user_avatar: string; content: string; created_at: string }

export const CommentSection: React.FC<{ postId: string }> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchComments()
    supabase.auth.onAuthStateChange((_, session) => setUser(session?.user))
    supabase.auth.getUser().then(resp => setUser(resp.data.user))
  }, [])

  const fetchComments = async () => {
    let { data } = await supabase.from('comments').select('*').eq('post_id', postId).order('created_at')
    setComments(data || [])
  }

  const addComment = async () => {
    if (!user) {
      await supabase.auth.signInWithOAuth({ provider: 'google' })
      return
    }
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

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-2">Comments</h3>
      <div className="space-y-4 mb-4">
        {comments.map(c => (
          <div key={c.id} className="border-b border-gray-200 pb-2 flex items-start gap-3">
            <img src={c.user_avatar} alt="" className="w-8 h-8 rounded-full" />
            <div>
              <p className="text-sm font-semibold">{c.user_name}</p>
              <p className="text-sm">{c.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <textarea
          className="flex-grow border border-gray-200 p-2 rounded"
          rows={2}
          placeholder="Write a comment..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
        />
        <button onClick={addComment} className="bg-main text-white px-4 rounded">
          Post
        </button>
      </div>
    </div>
  )
}
