import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('isAdminAuthenticated') !== 'true') {
      navigate('/')
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-light p-4">
      <h1 className="text-4xl font-bold text-main-dark mb-6">Admin Dashboard</h1>
      <div className="space-y-4 w-full max-w-sm">
        <button
          onClick={() => navigate('/editor')}
          className="w-full py-3 bg-main text-white rounded hover:bg-main-dark"
        >
          ✍️ Create / Edit Blog
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('isAdminAuthenticated')
            navigate('/')
          }}
          className="w-full py-3 bg-red-500 text-white rounded hover:bg-red-600"
        >
          🔒 Logout
        </button>
      </div>
    </div>
  )
}

export default AdminDashboard
