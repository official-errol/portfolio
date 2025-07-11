import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BlogEditor from './BlogEditor'

// Heroicons
import {
  PencilSquareIcon,
  FolderIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

// Lucide (ShadCN-style) icons
import { ChevronLeft, ChevronRight } from 'lucide-react'

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<'blog' | 'other'>('blog')
  const [editingPost, setEditingPost] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

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
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-main-dark">Site Manager</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 bg-white border-r border-gray-200 flex-shrink-0 h-full md:h-screen transition-all duration-300 overflow-hidden
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        ${isSidebarCollapsed ? 'w-16' : 'w-72'}`}
      >
        <div className="flex flex-col justify-between h-full p-4">
          {/* Collapse Toggle */}
          <div>
            <div className="hidden md:flex justify-end mb-4">
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="text-gray-500 hover:text-gray-700"
              >
                {isSidebarCollapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronLeft className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Title */}
            <div className={`hidden md:block mb-6 ${isSidebarCollapsed ? 'text-center' : ''}`}>
              <h2 className={`text-2xl font-bold text-main-dark ${isSidebarCollapsed ? 'text-sm' : ''}`}>
                {isSidebarCollapsed ? 'SM' : 'Site Manager'}
              </h2>
            </div>

            {/* Navigation */}
            <nav className="space-y-3">
              <button
                onClick={() => {
                  setActiveSection('blog')
                  setEditingPost(null)
                  setSidebarOpen(false)
                }}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded whitespace-nowrap ${
                  activeSection === 'blog'
                    ? 'border-l-2 border-main text-main-dark bg-gray-200'
                    : 'text-gray-600 bg-white'
                }`}
              >
                <PencilSquareIcon className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Blog Editor</span>}
              </button>

              <button
                onClick={() => {
                  setActiveSection('other')
                  setSidebarOpen(false)
                }}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded whitespace-nowrap ${
                  activeSection === 'other'
                    ? 'border-l-2 border-main text-main-dark bg-gray-200'
                    : 'text-gray-600 bg-white'
                }`}
              >
                <FolderIcon className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Other Section</span>}
              </button>
            </nav>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full py-2 px-3 text-sm text-white bg-red-500 rounded-lg cursor-pointer select-none
              active:translate-y-2 active:[box-shadow:0_0px_0_0_#e11d48,0_0px_0_0_#e11d4866]
              active:border-b-[0px]
              transition-all duration-150 [box-shadow:0_6px_0_0_#e11d48,0_10px_0_0_#e11d4866]
              border-b-[1px] border-red-400 mt-6 md:mt-0"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-[rgba(0,0,0,0.3)] z-30 md:hidden"
        />
      )}

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto bg-white p-4">
        {activeSection === 'blog' && (
          <BlogEditor
            editingPostId={editingPost}
            onPostSelect={handlePostSelect}
            onClearEditing={handleClearEditing}
          />
        )}
        {activeSection === 'other' && (
          <div className="text-gray-700">
            <h2 className="text-2xl font-semibold mb-4">Other Section</h2>
            <p>More admin tools coming soon...</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
