import React from 'react'
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp
} from 'react-icons/fa'

interface SocialShareProps {
  title: string
  url: string
}

export const SocialShare: React.FC<SocialShareProps> = ({ title, url }) => {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?url=${encodedUrl}&title=${encodedTitle}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
  }

  return (
    <div className="flex gap-3">
      <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" title="Share on Facebook">
        <FaFacebookF className="w-6 h-6 text-blue-600 hover:scale-110 transition-transform" />
      </a>
      <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" title="Share on Twitter">
        <FaTwitter className="w-6 h-6 text-sky-500 hover:scale-110 transition-transform" />
      </a>
      <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" title="Share on LinkedIn">
        <FaLinkedinIn className="w-6 h-6 text-blue-700 hover:scale-110 transition-transform" />
      </a>
      <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" title="Share on WhatsApp">
        <FaWhatsapp className="w-6 h-6 text-green-500 hover:scale-110 transition-transform" />
      </a>
    </div>
  )
}
