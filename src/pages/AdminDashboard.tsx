import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BlogEditor from './BlogEditor'

// Heroicons
import {
  PencilSquareIcon,
  FolderIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<'blog' | 'other'>('blog')
  const [editingPost, setEditingPost] = useState<string | null>(null)

  useEffect(() => {
    if (localStorage.getItem('isAdminAuthenticated') !== 'true') {
      navigate('/')
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated')
    navigate('/')
  }

  const handlePostSelect = (postId: string) => {
    setEditingPost(postId)
  }

  const handleClearEditing = () => {
    setEditingPost(null)
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar - Fixed width with flex-shrink-0 */}
      <aside className="w-64 flex-shrink-0 h-screen sticky top-0 bg-white border-r border-gray-200 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-main-dark mb-6">Site Manager</h2>
          <nav className="space-y-3">
            <button
              onClick={() => {
                setActiveSection('blog')
                setEditingPost(null)
              }}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded ${
                activeSection === 'blog' ? 'border-l border-2 border-main text-main-dark bg-white'
                : 'text-gray-600 bg-white'
              }`}
            >
              <PencilSquareIcon className="h-5 w-5" />
              Blog Editor
            </button>

            <button
              onClick={() => setActiveSection('other')}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded ${
                activeSection === 'other' ? 'border-l border-2 border-main text-main-dark bg-white'
                : 'text-gray-600 bg-white'
              }`}
            >
              <FolderIcon className="h-5 w-5" />
              Other Section
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full py-2 px-3 text-sm text-white bg-red-500 rounded-lg cursor-pointer select-none
                active:translate-y-2 active:[box-shadow:0_0px_0_0_#e11d48,0_0px_0_0_#e11d4866]
                active:border-b-[0px]
                transition-all duration-150 [box-shadow:0_6px_0_0_#e11d48,0_10px_0_0_#e11d4866]
                border-b-[1px] border-red-400"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </aside>

      {/* Main Content - Added flex-grow and min-w-0 */}
      <main className="flex-grow min-w-0 overflow-y-auto bg-white">
        {activeSection === 'blog' && (
          <BlogEditor 
            editingPostId={editingPost} 
            onPostSelect={handlePostSelect}
            onClearEditing={handleClearEditing}
          />
        )}
        {activeSection === 'other' && (
          <div className="text-gray-700 p-8">
            <h2 className="text-2xl font-semibold mb-4">Other Section</h2>
            <p>More admin tools coming soon...</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
