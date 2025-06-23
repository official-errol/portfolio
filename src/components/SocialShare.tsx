import React from 'react'
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, LinkedinIcon, WhatsappIcon } from 'react-share'

export const SocialShare: React.FC<{ title: string, url: string }> = ({ title, url }) => (
  <div className="flex gap-2">
    <FacebookShareButton url={url}><FacebookIcon size={32} round /></FacebookShareButton>
    <TwitterShareButton url={url} title={title}><TwitterIcon size={32} round /></TwitterShareButton>
    <LinkedinShareButton url={url} title={title}><LinkedinIcon size={32} round /></LinkedinShareButton>
    <WhatsappShareButton url={url} title={title}><WhatsappIcon size={32} round /></WhatsappShareButton>
  </div>
)
