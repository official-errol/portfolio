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

const filter = new Filter()

const ChatBox: React.FC = () => {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
                <span className="font-medium">
                  {message.profile?.username}
                </span>
              </div>
              <p className="break-words">{message.content}</p>
              <div className="text-xs opacity-80 mt-1">
                {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
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
          className={`h-12 w-12 flex items-center justify-center text-white bg-blue-500 rounded-lg cursor-pointer select-none
            active:translate-y-1 active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
            active:border-b-[0px]
            transition-all duration-150 [box-shadow:0_6px_0_0_#1b6ff8,0_10px_0_0_#1b70f841]
            border-b border-blue-400 ${
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