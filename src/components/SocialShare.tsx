import React, { useState, useRef, useEffect } from 'react'
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp
} from 'react-icons/fa'
import { BiShareAlt } from 'react-icons/bi'

interface SocialShareProps {
  title: string
  url: string
}

export const SocialShare: React.FC<SocialShareProps> = ({ title, url }) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?url=${encodedUrl}&title=${encodedTitle}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
  }

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-full text-gray-800 hover:bg-gray-300 transition"
      >
        <BiShareAlt className="w-4 h-4" />
        <span>Share</span>
      </button>

      {isOpen && (
        <div className="absolute mt-2 bg-white rounded-xl shadow-lg p-4 z-10 flex gap-4">
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook"
            className="hover:scale-110 transition-transform"
          >
            <FaFacebookF className="w-5 h-5 text-blue-600" />
          </a>
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            title="Twitter"
            className="hover:scale-110 transition-transform"
          >
            <FaTwitter className="w-5 h-5 text-sky-500" />
          </a>
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
            className="hover:scale-110 transition-transform"
          >
            <FaLinkedinIn className="w-5 h-5 text-blue-700" />
          </a>
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp"
            className="hover:scale-110 transition-transform"
          >
            <FaWhatsapp className="w-5 h-5 text-green-500" />
          </a>
        </div>
      )}
    </div>
  )
}
