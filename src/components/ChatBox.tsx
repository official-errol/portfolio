import React, { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { PaperAirplaneIcon, MapPinIcon } from '@heroicons/react/24/outline'
import LoadingSpinner from './LoadingSpinner'
import { Filter } from 'bad-words'
import { motion } from 'framer-motion'

interface Profile {
  username: string
  avatar_url: string
}

interface Message {
  id: string
  content: string
  created_at: string
  user_id: string
  profile: Profile | null
  is_pinned: boolean
}

const ADMIN_USER_ID = '4f702a81-2788-4b32-bf0b-5a6a4233f5c4'

function getRelativeTime(dateString: string): string {
  const now = new Date()
  const then = new Date(dateString)

  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInSeconds < 60) return 'just now'
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  const thenDate = then.toDateString()
  const yesterdayDate = yesterday.toDateString()

  if (thenDate === yesterdayDate) return 'yesterday'

  if (diffInDays < 7) return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`
  }
  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30)
    return `${months} month${months === 1 ? '' : 's'} ago`
  }

  const years = Math.floor(diffInDays / 365)
  return `${years} year${years === 1 ? '' : 's'} ago`
}

const filter = new Filter()

filter.addWords(
  'gago', 'tanga', 'ulol', 'putangina', 'pakshet', 'lintik', 'buwisit', 'leche', 'tarantado',
  'bobo', 'loko', 'engaño', 'hayok', 'ibak', 'jerk', 'peste', 'yawa', 'siraulo', 'tanginamo',
  'pakyu', 'tangina', 'unggoy', 'puto', 'bastos', 'ulol', 'siraulo', 'balimbing', 'anak ng puta',
  'tarantado', 'putang ina', 'tang ina', 'gago ka', 'hayup', 'kalapating barado'
)

const ChatBox: React.FC = () => {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    fetchMessages()

    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const { data, error } = await supabase
              .from('messages')
              .select(`
                id,
                content,
                created_at,
                user_id,
                is_pinned,
                profiles(username, avatar_url)
              `)
              .eq('id', payload.new.id)
              .single()

            if (!error && data) {
              const profileData = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles

              const newMsg: Message = {
                id: data.id,
                content: data.content,
                created_at: data.created_at,
                user_id: data.user_id,
                profile: profileData ? {
                  username: profileData.username || 'Unknown',
                  avatar_url: profileData.avatar_url || ''
                } : null,
                is_pinned: data.is_pinned || false
              }

              setMessages(prev => {
                if (prev.some(msg => msg.id === newMsg.id)) return prev
                return [...prev, newMsg]
              })
            }
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev =>
              prev.map(msg =>
                msg.id === payload.new.id
                  ? { ...msg, is_pinned: payload.new.is_pinned }
                  : msg
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const fetchMessages = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          user_id,
          is_pinned,
          profiles(username, avatar_url)
        `)
        .order('created_at', { ascending: true })

      if (error) throw error

      const transformedData = (data ?? []).map(msg => {
        const profileData = Array.isArray(msg.profiles) ? msg.profiles[0] : msg.profiles

        return {
          id: msg.id,
          content: msg.content,
          created_at: msg.created_at,
          user_id: msg.user_id,
          profile: profileData ? {
            username: profileData.username || 'Unknown',
            avatar_url: profileData.avatar_url || ''
          } : null,
          is_pinned: msg.is_pinned || false
        }
      }) as Message[]

      setMessages(transformedData)
    } catch (err) {
      setError('Failed to load messages')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePin = async (messageId: string) => {
    try {
      const message = messages.find(m => m.id === messageId)
      if (!message) return

      const { error } = await supabase
        .from('messages')
        .update({ is_pinned: !message.is_pinned })
        .eq('id', messageId)

      if (error) throw error

    } catch (err) {
      setError('Failed to update pin status')
      console.error(err)
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    try {
      setMessages(prev => prev.filter(msg => msg.id !== messageId))

      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)

      if (error) {
        setError('Failed to delete message')
        fetchMessages()
      }
    } catch (err) {
      setError('Failed to delete message')
      fetchMessages()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !user) return

    if (filter.isProfane(newMessage)) {
      setError('Please avoid using inappropriate language.')
      return
    }

    const cleanMessage = filter.clean(newMessage)

    const tempMessage: Message = {
      id: 'temp-' + Date.now(),
      content: cleanMessage,
      created_at: new Date().toISOString(),
      user_id: user.id,
      profile: {
        username: user.user_metadata?.username || 'You',
        avatar_url: user.user_metadata?.avatar_url || ''
      },
      is_pinned: false
    }
    setMessages(prev => [...prev, tempMessage])
    setNewMessage('')

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{ content: tempMessage.content, user_id: user.id }])
        .select()
        .single()

      if (error) {
        setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id))
        throw error
      }

      setMessages(prev => {
        return prev.map(msg => msg.id === tempMessage.id ? { ...msg, id: data.id, created_at: data.created_at } : msg)
      })

    } catch (err) {
      setError('Failed to send message')
      console.error(err)
    }
  }

  if (loading) return <LoadingSpinner />

  if (error) return (
    <div className="p-4 m-4 bg-red-100 text-red-700 rounded-md">
      {error}
    </div>
  )

  // Sort messages with pinned messages first
  const sortedMessages = [...messages].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1
    if (!a.is_pinned && b.is_pinned) return 1
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {sortedMessages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`w-full max-w-md px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200
                ${message.is_pinned ? 'border-l-4 border-yellow-500' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {message.profile?.avatar_url ? (
                    <img
                      src={message.profile.avatar_url}
                      alt={message.profile.username}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="bg-gray-300 dark:bg-gray-600 w-6 h-6 rounded-full" />
                  )}
                  <span className="font-medium flex items-center gap-1">
                    {message.profile?.username}
                    {message.user_id === ADMIN_USER_ID && (
                      <svg
                        fill="#000000"
                        viewBox="0 0 24 24"
                        id="verified"
                        data-name="Flat Color"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 icon flat-color"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                          <path
                            id="primary"
                            d="M21.6,9.84A4.57,4.57,0,0,1,21.18,9,4,4,0,0,1,21,8.07a4.21,4.21,0,0,0-.64-2.16,4.25,4.25,0,0,0-1.87-1.28,4.77,4.77,0,0,1-.85-.43A5.11,5.11,0,0,1,17,3.54a4.2,4.2,0,0,0-1.8-1.4A4.22,4.22,0,0,0,13,2.21a4.24,4.24,0,0,1-1.94,0,4.22,4.22,0,0,0-2.24-.07A4.2,4.2,0,0,0,7,3.54a5.11,5.11,0,0,1-.66.66,4.77,4.77,0,0,1-.85.43A4.25,4.25,0,0,0,3.61,5.91,4.21,4.21,0,0,0,3,8.07,4,4,0,0,1,2.82,9a4.57,4.57,0,0,1-.42.82A4.3,4.3,0,0,0,1.63,12a4.3,4.3,0,0,0,.77,2.16,4,4,0,0,1,.42.82,4.11,4.11,0,0,1,.15.95,4.19,4.19,0,0,0,.64,2.16,4.25,4.25,0,0,0,1.87,1.28,4.77,4.77,0,0,1,.85.43,5.11,5.11,0,0,1,.66.66,4.12,4.12,0,0,0,1.8,1.4,3,3,0,0,0,.87.13A6.66,6.66,0,0,0,11,21.81a4,4,0,0,1,1.94,0,4.33,4.33,0,0,0,2.24.06,4.12,4.12,0,0,0,1.8-1.4,5.11,5.11,0,0,1,.66-.66,4.77,4.77,0,0,1,.85-.43,4.25,4.25,0,0,0,1.87-1.28A4.19,4.19,0,0,0,21,15.94a4.11,4.11,0,0,1,.15-.95,4.57,4.57,0,0,1,.42-.82A4.3,4.3,0,0,0,22.37,12,4.3,4.3,0,0,0,21.6,9.84Z"
                            style={{ fill: "#87E64B" }}
                          />
                          <path
                            id="secondary"
                            d="M11,16a1,1,0,0,1-.71-.29l-3-3a1,1,0,1,1,1.42-1.42L11,13.59l4.29-4.3a1,1,0,0,1,1.42,1.42l-5,5A1,1,0,0,1,11,16Z"
                            style={{ fill: "#2e7400" }}
                          />
                        </g>
                      </svg>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {user?.id === ADMIN_USER_ID && (
                    <>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleTogglePin(message.id)}
                        className="text-yellow-500 hover:text-yellow-600"
                        aria-label={message.is_pinned ? 'Unpin message' : 'Pin message'}
                      >
                        <MapPinIcon className={`w-5 h-5 ${message.is_pinned ? 'fill-yellow-500' : ''}`} />
                      </motion.button>
                      <button
                        onClick={() => {
                          setShowConfirmModal(true)
                          setMessageToDelete(message.id)
                        }}
                        className="ml-2 text-red-500 hover:text-red-700 text-xs"
                        aria-label="Delete message"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
              <p className="break-words">{message.content}</p>
              <time
                title={new Date(message.created_at).toLocaleString()}
                className="text-xs opacity-80 mt-1"
              >
                {getRelativeTime(message.created_at)}
                {message.is_pinned && (
                  <span className="ml-2 text-yellow-500">Pinned</span>
                )}
              </time>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => {
                  setShowConfirmModal(false)
                  setMessageToDelete(null)
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => {
                  if (messageToDelete) handleDeleteMessage(messageToDelete)
                  setShowConfirmModal(false)
                  setMessageToDelete(null)
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-2 flex border-t border-gray-200 dark:border-gray-700">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-4 mr-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-main dark:bg-gray-800 dark:text-white"
          aria-label="Type your message"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className={`h-12 w-12 flex items-center justify-center text-main-dark bg-main rounded-lg cursor-pointer select-none
            active:translate-y-1 active:[box-shadow:0_0px_0_0_#6CC832,0_0px_0_0_#9cee69]
            active:border-b-[1px]
            transition-all duration-150 [box-shadow:0_6px_0_0_#6CC832,0_10px_0_0_#9cee69]
            border-b border-main-dark ${
              newMessage.trim() ? '' : 'cursor-not-allowed'
            }`}
          aria-label="Send message"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}

export default ChatBox
