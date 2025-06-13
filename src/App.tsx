import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { setThemeVariables } from './utils/theme'
import Nav from './components/Nav'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Chat from './pages/Chat'
import LoadingSpinner from './components/LoadingSpinner'

const App: React.FC = () => {
  useEffect(() => {
    setThemeVariables()
  }, [])

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen bg-primary-light">
            
            <main className="flex-grow">
              <React.Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </React.Suspense>
            </main>
            
            <Nav />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
