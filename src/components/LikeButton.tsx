import React, { useState, useEffect } from 'react'
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import { supabase } from '../services/supabaseClient'

export const LikeButton: React.FC<{ postId: string }> = ({ postId }) => {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const fetchLikes = async () => {
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)

      setCount(count || 0)

      const { data: userSession } = await supabase.auth.getSession()
      const user = userSession?.session?.user

      if (user) {
        const { data: likes } = await supabase
          .from('likes')
          .select('*')
          .eq('post_id', postId)
          .eq('user_id', user.id)

        setLiked(!!likes?.length)
      }
    }

    fetchLikes()
  }, [postId])

  const toggleLike = async () => {
    const { data: userSession } = await supabase.auth.getSession()
    const user = userSession?.session?.user

    if (!user) {
      await supabase.auth.signInWithOAuth({ provider: 'google' })
      return
    }

    if (!liked) {
      await supabase.from('likes').insert({ post_id: postId, user_id: user.id })
      setLiked(true)
      setCount((c) => c + 1)
    } else {
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id)
      setLiked(false)
      setCount((c) => c - 1)
    }
  }

  return (
    <button onClick={toggleLike} className="flex items-center gap-1 text-main-dark">
      {liked ? (
        <HeartSolid className="w-5 h-5 text-main" />
      ) : (
        <HeartOutline className="w-5 h-5" />
      )}
      <span>{count}</span>
    </button>
  )
}
