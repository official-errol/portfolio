import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminAuthenticated') === 'true'
    if (isLoggedIn) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleLogin = () => {
    if (username === 'admin' && password === 'P@$$w0rdS3cur3d') {
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

        <form onSubmit={(e) => { e.preventDefault(); handleLogin() }}>
          <input
            type="text"
            placeholder="Username"
            className="w-full mb-3 p-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-main-dark"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-3 p-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-main-dark"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full py-2 text-main-dark bg-main rounded-lg cursor-pointer select-none
              active:translate-y-2 active:[box-shadow:0_0px_0_0_#6CC832,0_0px_0_0_#9cee69]
              active:border-b-[1px]
              transition-all duration-150 [box-shadow:0_6px_0_0_#6CC832,0_10px_0_0_#9cee69]
              border-b border-main-dark"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
