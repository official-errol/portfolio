import React from 'react'
import { GithubIcon, MailIcon, FacebookIcon, InstagramIcon } from 'lucide-react'

const Footer: React.FC = () => {
  const year = new Date().getFullYear()
  const ownerName = import.meta.env.VITE_PORTFOLIO_OWNER_NAME

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 dark:text-gray-400">
              © {year} {ownerName}. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-4">
            <a href="https://github.com/official-errol" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <GithubIcon className="text-gray-600 dark:text-gray-400 hover:text-main dark:hover:text-main-light transition-colors w-6 h-6" />
            </a>
            <a href="https://facebook.com/official.errol" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FacebookIcon className="text-gray-600 dark:text-gray-400 hover:text-main dark:hover:text-main-light transition-colors w-6 h-6" />
            </a>
            <a href="https://instagram.com/official.errol" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <InstagramIcon className="text-gray-600 dark:text-gray-400 hover:text-main dark:hover:text-main-light transition-colors w-6 h-6" />
            </a>
            <a href="mailto:mr.errolsolomon@gmail.com" aria-label="Email">
              <MailIcon className="text-gray-600 dark:text-gray-400 hover:text-main dark:hover:text-main-light transition-colors w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer