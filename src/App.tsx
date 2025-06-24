import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { setThemeVariables } from './utils/theme'

// Portfolio pages
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Chat from './pages/Chat'
import Services from './pages/Services'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import LoadingSpinner from './components/LoadingSpinner'
import Nav from './components/Nav'

// Admin pages
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import BlogEditor from './pages/BlogEditor'

const isAdmin = window.location.hostname.startsWith('admin')

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
                  {isAdmin ? (
                    <>
                      <Route path="/" element={<AdminLogin />} />
                      <Route path="/dashboard" element={<AdminDashboard />} />
                      <Route path="/editor" element={<BlogEditor />} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </>
                  ) : (
                    <>
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<BlogPost />} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </>
                  )}
                </Routes>
              </React.Suspense>
            </main>

            {/* Only show Nav if not on admin domain */}
            {!isAdmin && <Nav />}
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
