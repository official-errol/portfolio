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
        <h1 className="text-3xl font-bold text-gray-800">Global Chat</h1>
        <p className="mb-4 text-lg text-gray-700">
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
          <h1 className="text-3xl font-bold text-gray-800">Global Chat</h1>
        </div>
      </div>
      
      <div className="rounded-xl bg-white/30 backdrop-blur-md border border-gray-500/20 overflow-hidden">
        <div className="p-2 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex justify-center">
                <div className="flex items-center">
                    {user.user_metadata.avatar_url ? (
                    <img 
                        src={user.user_metadata.avatar_url} 
                        alt={user.user_metadata.full_name} 
                        className="w-10 h-10 rounded-full mr-3"
                    />
                    ) : (
                    <div className="bg-gray-300 w-10 h-10 rounded-full mr-3" />
                    )}
                    <div>
                      <h2 className="font-semibold flex items-center gap-1">
                        {user.user_metadata.full_name}
                        {user?.id === ADMIN_USER_ID && (
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
                      </h2>
                      <div className="text-sm text-gray-500">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-3 h-10 p-3 text-xs text-white bg-red-500 rounded-lg cursor-pointer select-none
                active:translate-y-2 active:[box-shadow:0_0px_0_0_#e11d48,0_0px_0_0_#e11d4866]
                active:border-b-[0px]
                transition-all duration-150 [box-shadow:0_6px_0_0_#e11d48,0_10px_0_0_#e11d4866]
                border-b-[1px] border-red-400"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              LOGOUT
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
