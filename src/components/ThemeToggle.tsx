import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

const ThemeToggle: React.FC = () => {
  const { darkMode, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <SunIcon className="w-5 h-5" />
      ) : (
        <MoonIcon className="w-5 h-5" />
      )}
    </button>
  )
}

export default ThemeToggle