import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('isAdminAuthenticated', 'true')
      navigate('/dashboard')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary-light px-4">
      <div className="w-full max-w-md bg-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-main-dark">Admin Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 p-2 border border-gray-300 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-main text-white py-2 rounded hover:bg-main-dark"
        >
          Login
        </button>
      </div>
    </div>
  )
}

export default AdminLogin
