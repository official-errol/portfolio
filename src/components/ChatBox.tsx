import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import LoadingSpinner from './LoadingSpinner'
import { Filter } from 'bad-words'

interface Message {
  id: string
  content: string
  created_at: string
  user_id: string
  profile: {
    username: string
    avatar_url: string
  } | null
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

  useEffect(() => {
    fetchMessages()

    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          const { data, error } = await supabase
            .from('messages')
            .select(`
              id,
              content,
              created_at,
              user_id,
              profiles(username, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single()

          if (!error && data) {
            const profileData = (data.profiles && Array.isArray(data.profiles) && data.profiles.length > 0)
              ? data.profiles[0]
              : null;

            const newMsg: Message = {
                id: data.id,
                content: data.content,
                created_at: data.created_at,
                user_id: data.user_id,
                profile: profileData ? {
                    username: profileData.username ?? 'Unknown',
                    avatar_url: profileData.avatar_url ?? ''
                } : null
            }


            setMessages(prev => {
              if (prev.some(msg => msg.id === newMsg.id)) return prev
              return [...prev, newMsg]
            })
          } else {
            console.error('Failed to fetch new message:', error)
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
  }, [messages])

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
          profiles(username, avatar_url)
        `)
        .order('created_at', { ascending: true })

      if (error) throw error

      const transformedData = (data ?? []).map(msg => {
        const profileData = Array.isArray(msg.profiles) ? msg.profiles[0] : msg.profiles;

        return {
        id: msg.id,
        content: msg.content,
        created_at: msg.created_at,
        user_id: msg.user_id,
        profile: profileData ? {
            username: profileData.username,
            avatar_url: profileData.avatar_url
        } : null
        }

      }) as unknown as Message[]

      setMessages(transformedData)
    } catch (err) {
      setError('Failed to load messages')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    try {
      // Optimistically update UI
      setMessages(prev => prev.filter(msg => msg.id !== messageId))

      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)

      if (error) {
        setError('Failed to delete message')
        // Refetch messages to revert UI if delete failed
        fetchMessages()
      }
    } catch (err) {
      setError('Failed to delete message')
      fetchMessages()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
            username: user.user_metadata?.username || 'You', // Fallback
            avatar_url: user.user_metadata?.avatar_url || ''
        }
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className="w-full max-w-md px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200
              "
            >
              <div className="flex items-center mb-1">
                {message.profile?.avatar_url ? (
                  <img 
                    src={message.profile.avatar_url} 
                    alt={message.profile.username} 
                    className="w-6 h-6 rounded-full mr-2"
                  />
                ) : (
                  <div className="bg-gray-300 dark:bg-gray-600 w-6 h-6 rounded-full mr-2" />
                )}
                <span className="font-medium flex items-center gap-1">
                  <span className="flex items-center gap-1">
                    {message.profile?.username}
                    {message.user_id === ADMIN_USER_ID && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-blue-500"
                      >56
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.5924 3.20027C9.34888 3.4078 9.22711 3.51158 9.09706 3.59874C8.79896 3.79854 8.46417 3.93721 8.1121 4.00672C7.95851 4.03705 7.79903 4.04977 7.48008 4.07522C6.6787 4.13918 6.278 4.17115 5.94371 4.28923C5.17051 4.56233 4.56233 5.17051 4.28923 5.94371C4.17115 6.278 4.13918 6.6787 4.07522 7.48008C4.04977 7.79903 4.03705 7.95851 4.00672 8.1121C3.93721 8.46417 3.79854 8.79896 3.59874 9.09706C3.51158 9.22711 3.40781 9.34887 3.20027 9.5924C2.67883 10.2043 2.4181 10.5102 2.26522 10.8301C1.91159 11.57 1.91159 12.43 2.26522 13.1699C2.41811 13.4898 2.67883 13.7957 3.20027 14.4076C3.40778 14.6511 3.51158 14.7729 3.59874 14.9029C3.79854 15.201 3.93721 15.5358 4.00672 15.8879C4.03705 16.0415 4.04977 16.201 4.07522 16.5199C4.13918 17.3213 4.17115 17.722 4.28923 18.0563C4.56233 18.8295 5.17051 19.4377 5.94371 19.7108C6.278 19.8288 6.6787 19.8608 7.48008 19.9248C7.79903 19.9502 7.95851 19.963 8.1121 19.9933C8.46417 20.0628 8.79896 20.2015 9.09706 20.4013C9.22711 20.4884 9.34887 20.5922 9.5924 20.7997C10.2043 21.3212 10.5102 21.5819 10.8301 21.7348C11.57 22.0884 12.43 22.0884 13.1699 21.7348C13.4898 21.5819 13.7957 21.3212 14.4076 20.7997C14.6511 20.5922 14.7729 20.4884 14.9029 20.4013C15.201 20.2015 15.5358 20.0628 15.8879 19.9933C16.0415 19.963 16.201 19.9502 16.5199 19.9248C17.3213 19.8608 17.722 19.8288 18.0563 19.7108C18.8295 19.4377 19.4377 18.8295 19.7108 18.0563C19.8288 17.722 19.8608 17.3213 19.9248 16.5199C19.9502 16.201 19.963 16.0415 19.9933 15.8879C20.0628 15.5358 20.2015 15.201 20.4013 14.9029C20.4884 14.7729 20.5922 14.6511 20.7997 14.4076C21.3212 13.7957 21.5819 13.4898 21.7348 13.1699C22.0884 12.43 22.0884 11.57 21.7348 10.8301C21.5819 10.5102 21.3212 10.2043 20.7997 9.5924C20.5922 9.34887 20.4884 9.22711 20.4013 9.09706C20.2015 8.79896 20.0628 8.46417 19.9933 8.1121C19.963 7.95851 19.9502 7.79903 19.9248 7.48008C19.8608 6.6787 19.8288 6.278 19.7108 5.94371C19.4377 5.17051 18.8295 4.56233 18.0563 4.28923C17.722 4.17115 17.3213 4.13918 16.5199 4.07522C16.201 4.04977 16.0415 4.03705 15.8879 4.00672C15.5358 3.93721 15.201 3.79854 14.9029 3.59874C14.7729 3.51158 14.6511 3.40781 14.4076 3.20027C13.7957 2.67883 13.4898 2.41811 13.1699 2.26522C12.43 1.91159 11.57 1.91159 10.8301 2.26522C10.5102 2.4181 10.2043 2.67883 9.5924 3.20027ZM16.3735 9.86314C16.6913 9.5453 16.6913 9.03 16.3735 8.71216C16.0557 8.39433 15.5403 8.39433 15.2225 8.71216L10.3723 13.5624L8.77746 11.9676C8.45963 11.6498 7.94432 11.6498 7.62649 11.9676C7.30866 12.2854 7.30866 12.8007 7.62649 13.1186L9.79678 15.2889C10.1146 15.6067 10.6299 15.6067 10.9478 15.2889L16.3735 9.86314Z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                  </span>
                </span>
                {user?.id === ADMIN_USER_ID && (
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
               )}
              </div>
              <p className="break-words">{message.content}</p>
              <time
                title={new Date(message.created_at).toLocaleString()}
                className="text-xs opacity-80 mt-1"
              >
                {getRelativeTime(message.created_at)}
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
          className={`h-12 w-12 flex items-center justify-center text-white bg-main rounded-lg cursor-pointer select-none
            active:translate-y-1 active:[box-shadow:0_0px_0_0_#6CC832,0_0px_0_0_#9cee69]
            active:border-b-[0px]
            transition-all duration-150 [box-shadow:0_6px_0_0_#6CC832,0_10px_0_0_#9cee69]
            border-b border-main ${
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
