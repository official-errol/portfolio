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

  useEffect(() => {
    if (localStorage.getItem('isAdminAuthenticated') !== 'true') {
      navigate('/')
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated')
    navigate('/')
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-white border border-r-gray-200 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-main-dark mb-6">Admin Panel</h2>
          <nav className="space-y-3">
            <button
              onClick={() => setActiveSection('blog')}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-main-light transition ${
                activeSection === 'blog' ? 'bg-main text-white' : 'text-main-dark'
              }`}
            >
              <PencilSquareIcon className="h-5 w-5" />
              Blog Editor
            </button>

            <button
              onClick={() => setActiveSection('other')}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-main-light transition ${
                activeSection === 'other' ? 'bg-main text-white' : 'text-main-dark'
              }`}
            >
              <FolderIcon className="h-5 w-5" />
              Other Section
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 mt-10 w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow h-screen overflow-y-auto">
        {activeSection === 'blog' && <BlogEditor />}
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
