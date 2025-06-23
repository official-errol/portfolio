import React, { useState, useEffect } from 'react'
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import { supabase } from '../services/supabaseClient'

export const LikeButton: React.FC<{ postId: string }> = ({ postId }) => {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    supabase.from('likes').select('count', { count: 'exact' }).eq('post_id', postId)
      .then(res => setCount(res.count || 0))

    const session = supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase.from('likes').select().eq('post_id', postId).eq('user_id', data.user.id)
          .then(res => setLiked(res.data?.length > 0))
      }
    })
  }, [postId])

  const toggleLike = async () => {
    const { data: session } = await supabase.auth.getSession()
    if (!session) {
      await supabase.auth.signInWithOAuth({ provider: 'google' })
      return
    }
    if (!liked) {
      await supabase.from('likes').insert({ post_id: postId, user_id: session.user.id })
      setLiked(true)
      setCount(c => c + 1)
    } else {
      await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', session.user.id)
      setLiked(false)
      setCount(c => c - 1)
    }
  }

  return (
    <button onClick={toggleLike} className="flex items-center gap-1 text-main-dark">
      {liked ? <HeartSolid className="w-5 h-5 text-main" /> : <HeartOutline className="w-5 h-5" />}
      <span>{count}</span>
    </button>
  )
}
