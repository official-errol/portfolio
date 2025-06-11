import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, useAnimation } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
  HomeIcon,
  UserIcon,
  FolderIcon,
  EnvelopeIcon,
  ChatBubbleOvalLeftEllipsisIcon
} from '@heroicons/react/24/outline'

const iconsMap = {
  Home: HomeIcon,
  About: UserIcon,
  Projects: FolderIcon,
  Contact: EnvelopeIcon,
  Chat: ChatBubbleOvalLeftEllipsisIcon
}

const Header: React.FC = () => {
  const { loading } = useAuth()
  const controls = useAnimation()
  const [lastScrollY, setLastScrollY] = useState(0)

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
    { name: 'Chat', path: '/chat' }
  ]

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 40) {
        controls.start({ y: '130%' })
      } else {
        controls.start({ y: '0%' })
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, controls])

  return (
    <div className="fixed bottom-4 w-full flex justify-center z-50">
      <motion.header
        animate={controls}
        initial={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="px-4 py-2 w-auto rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border border-gray-500/20 shadow-sm"
      >
        <nav>
          <ul className="flex items-center space-x-4">
            {!loading &&
              navLinks.map((link) => {
                const Icon = iconsMap[link.name as keyof typeof iconsMap]
                return (
                  <li key={link.path}>
                    <NavLink to={link.path}>
                      {({ isActive }) => (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex flex-col items-center px-3 py-1 rounded-lg transition-colors duration-300 ${
                            isActive
                              ? 'text-main dark:text-main-light bg-main/10 dark:bg-main-light/10'
                              : 'text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          <Icon className="w-6 h-6 mb-0.5" />
                          {isActive && (
                            <motion.span
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              className="text-xs"
                            >
                              {link.name}
                            </motion.span>
                          )}
                        </motion.div>
                      )}
                    </NavLink>
                  </li>
                )
              })}
          </ul>
        </nav>
      </motion.header>
    </div>
  )
}

export default Header