import React, { useState, useEffect } from 'react'
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline'
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from '@heroicons/react/24/solid'
import { supabase } from '../services/supabaseClient'

export const LikeButton: React.FC<{ postId: string }> = ({ postId }) => {
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)

  useEffect(() => {
    const fetchReactions = async () => {
      const { count: likeCount } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)
        .eq('reaction', 'like')

      const { count: dislikeCount } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)
        .eq('reaction', 'dislike')

      setLikes(likeCount || 0)
      setDislikes(dislikeCount || 0)

      const { data: session } = await supabase.auth.getSession()
      const user = session?.session?.user

      if (user) {
        const { data } = await supabase
          .from('likes')
          .select('reaction')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .single()

        if (data?.reaction === 'like') setLiked(true)
        if (data?.reaction === 'dislike') setDisliked(true)
      }
    }

    fetchReactions()
  }, [postId])

  const handleReaction = async (type: 'like' | 'dislike') => {
    const { data: session } = await supabase.auth.getSession()
    const user = session?.session?.user

    if (!user) {
      await supabase.auth.signInWithOAuth({ provider: 'google' })
      return
    }

    const { data: existing } = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single()

    if (existing) {
      if (existing.reaction === type) {
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id)

        if (type === 'like') {
          setLiked(false)
          setLikes(likes - 1)
        } else {
          setDisliked(false)
          setDislikes(dislikes - 1)
        }
      } else {
        await supabase
          .from('likes')
          .update({ reaction: type })
          .eq('post_id', postId)
          .eq('user_id', user.id)

        if (type === 'like') {
          setLiked(true)
          setDisliked(false)
          setLikes(likes + 1)
          setDislikes(dislikes > 0 ? dislikes - 1 : 0)
        } else {
          setDisliked(true)
          setLiked(false)
          setDislikes(dislikes + 1)
          setLikes(likes > 0 ? likes - 1 : 0)
        }
      }
    } else {
      await supabase.from('likes').insert({ post_id: postId, user_id: user.id, reaction: type })

      if (type === 'like') {
        setLiked(true)
        setLikes(likes + 1)
      } else {
        setDisliked(true)
        setDislikes(dislikes + 1)
      }
    }
  }

  return (
    <div className="flex items-center gap-4 text-main-dark">
      <button onClick={() => handleReaction('like')} className="flex items-center gap-1">
        {liked ? (
          <HandThumbUpSolid className="w-5 h-5 text-blue-600" />
        ) : (
          <HandThumbUpIcon className="w-5 h-5" />
        )}
        <span>{likes}</span>
      </button>

      <button onClick={() => handleReaction('dislike')} className="flex items-center gap-1">
        {disliked ? (
          <HandThumbDownSolid className="w-5 h-5 text-red-600" />
        ) : (
          <HandThumbDownIcon className="w-5 h-5" />
        )}
        <span>{dislikes}</span>
      </button>
    </div>
  )
}
