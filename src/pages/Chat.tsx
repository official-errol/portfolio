import React from 'react'
import { useAuth } from '../context/AuthContext'
import ChatBox from '../components/ChatBox'
import LoadingSpinner from '../components/LoadingSpinner'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

const ADMIN_USER_ID = '4f702a81-2788-4b32-bf0b-5a6a4233f5c4'

const Chat: React.FC = () => {
  const { user, login, logout, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <p className="mb-4 text-lg text-gray-700 dark:text-gray-200">
          Please sign in to access the chat.
        </p>
        <button 
          onClick={() => login('google')}
            className="mb-6 flex items-center gap-4 px-6 py-3 text-gray-800 bg-white rounded-lg cursor-pointer select-none
    active:translate-y-2  active:[box-shadow:0_0px_0_0_#d1d5db,0_0px_0_0_#d1d5db66]
    active:border-b-[1px]
    transition-all duration-150 [box-shadow:0_10px_0_0_#d1d5db,0_15px_0_0_#d1d5db66]
    border-[1px] border-gray-200"
        >
          <img
            src="https://cdn.freebiesupply.com/logos/large/2x/google-icon-logo-png-transparent.png"
            alt="Google logo"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>
        <button 
          onClick={() => login('github')}
            className="flex items-center gap-4 px-6 py-3 text-white bg-stone-900 rounded-lg cursor-pointer select-none
    active:translate-y-2 active:[box-shadow:0_0px_0_0_#383534,0_0px_0_0_#0f172a66]
    active:border-b-[1px]
    transition-all duration-150 [box-shadow:0_10px_0_0_#383534,0_15px_0_0_#0f172a66]
    border-[1px] border-stone-600"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
            alt="Github logo"
            className="w-6 h-6 bg-white p-0.5 rounded-full"
          />
          Sign in with Github
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Global Chat</h1>
        </div>
      </div>
      
      <div className="rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border border-gray-500/20 shadow-sm overflow-hidden">
        <div className="p-4 pb-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
                {user.user_metadata.avatar_url ? (
                <img 
                    src={user.user_metadata.avatar_url} 
                    alt={user.user_metadata.full_name} 
                    className="w-10 h-10 rounded-full mr-3"
                />
                ) : (
                <div className="bg-gray-300 dark:bg-gray-600 w-10 h-10 rounded-full mr-3" />
                )}
                <div>
                <h2 className="font-semibold">{user.user_metadata.full_name}</h2>
                <div>
                  {user?.id === ADMIN_USER_ID ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-1 w-4 h-4 text-blue-500"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z" />
                    </svg>
                  ) : (
                    <span className="text-sm text-gray-500">Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                  )}
                </div>
                </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-3 h-10 px-4 py-2 text-sm text-white bg-red-500 rounded-lg cursor-pointer select-none
                active:translate-y-2 active:[box-shadow:0_0px_0_0_#e11d48,0_0px_0_0_#e11d4866]
                active:border-b-[0px]
                transition-all duration-150 [box-shadow:0_6px_0_0_#e11d48,0_10px_0_0_#e11d4866]
                border-b-[1px] border-red-400"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>

          </div>
        </div>
        
        <div className="h-[56vh]">
          <ChatBox />
        </div>
      </div>
    </div>
  )
}

export default Chat
