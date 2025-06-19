import React from 'react'
import { motion } from 'framer-motion'
import {
  PaintBrushIcon,
  DocumentTextIcon,
  SparklesIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline'

const services = [
  {
    title: 'Logo & Branding',
    icon: <PaintBrushIcon className="w-6 h-6 text-main" />,
    description:
      'Create standout logos and full brand systems that represent your identity.',
    packages: [
      ['Basic', 'Logo Only', 'P500 – P1,000'],
      ['Standard', 'Logo + Brand Guide', 'P1,500 – P2,000'],
      ['Premium', 'Full Branding Suite', 'P2,500 – P3,000']
    ]
  },
  {
    title: 'Printables',
    icon: <DocumentTextIcon className="w-6 h-6 text-main" />,
    description:
      'Professional designs for print like flyers, banners, invitations, and more.',
    packages: [
      ['Flyer (1–2 pages)', '', 'P300 – P500'],
      ['Banner / Poster', '', 'P400 – P700'],
      ['Business Card', '', 'P300 – P500']
    ]
  },
  {
    title: 'Digital Art & Editing',
    icon: <SparklesIcon className="w-6 h-6 text-main" />,
    description:
      'Photo manipulation, product label designs, and creative digital art.',
    packages: [
      ['Menu Design', '', 'P800 – P1,000'],
      ['Photo Editing', '', 'P150 – P300'],
      ['Photomanipulation', '', 'P400 – P700']
    ]
  },
  {
    title: 'Social Media Design',
    icon: <DevicePhoneMobileIcon className="w-6 h-6 text-main" />,
    description:
      'Scroll-stopping posts and layouts that grow your brand online.',
    packages: [
      ['Single Post (FB/IG)', '', 'P200 – P300'],
      ['10-30 Posts', '', 'P1,000 – P4,000'],
      ['Reels / TikTok Layouts', '', 'P500 – P800']
    ]
  }
]

const Services: React.FC = () => {
  return (
    <motion.div
      className="min-h-screen bg-white px-4 py-16 text-gray-800"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-main-dark">
          What I Can Do for You
        </h1>

        <div className="grid gap-10 md:grid-cols-2">
          {services.map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              className="border border-gray-300 rounded-xl p-6 shadow-sm bg-white transition"
            >
              <div className="flex items-center gap-3 mb-4">
                {service.icon}
                <h2 className="text-xl font-semibold text-main-dark">
                  {service.title}
                </h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">{service.description}</p>
              <div className="space-y-2 text-sm">
                {service.packages.map(([name, desc, price]) => (
                  <div
                    key={name}
                    className="flex justify-between items-center border-b border-gray-500/20 py-2"
                  >
                    <div>
                      <span className="font-medium text-gray-800">{name}</span>
                      {desc && (
                        <p className="text-xs text-gray-500">{desc}</p>
                      )}
                    </div>
                    <span className="text-main font-semibold">{price}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16 text-sm text-gray-500">
          🚧 More services like website development, UI/UX design, and automation tools coming soon!
        </div>
      </div>
    </motion.div>
  )
}

export default Services
