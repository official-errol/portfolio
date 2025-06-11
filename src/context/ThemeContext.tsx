import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface ThemeContextType {
  darkMode: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const handleChange = () => {
    if (localStorage.getItem('darkMode') === null) {
      setDarkMode(media.matches)
      document.documentElement.classList.toggle('dark', media.matches)
    }
  }
  media.addEventListener('change', handleChange)
  return () => media.removeEventListener('change', handleChange)
}, [])


  const toggleTheme = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', String(newDarkMode))
    document.documentElement.classList.toggle('dark', newDarkMode)
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
