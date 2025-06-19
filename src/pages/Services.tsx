import React from 'react'
import { motion } from 'framer-motion'
import {
  PaintBrushIcon,
  DocumentIcon,
  CpuChipIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline'

const Section: React.FC<{
  icon: React.ReactNode
  title: string
  items: [string, string][]
}> = ({ icon, title, items }) => (
  <section className="mb-12">
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <h2 className="text-xl font-semibold text-main-dark">{title}</h2>
    </div>

    <div className="grid md:grid-cols-2 gap-4 text-sm">
      {items.map(([label, price]) => (
        <div
          key={label}
          className="flex justify-between border-b py-2 border-gray-500/20"
        >
          <span>{label}</span>
          <span className="font-semibold text-main-dark">{price}</span>
        </div>
      ))}
    </div>
  </section>
)

const Services: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen px-4 py-10 text-gray-800 bg-white"
    >
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center text-main-dark">
          My Services
        </h1>

        {/* Logo & Brand Visual Identity */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <PaintBrushIcon className="w-5 h-5 text-main" />
            <h2 className="text-xl font-semibold text-main-dark">
              Logo & Brand Visual Identity
            </h2>
          </div>

          <div className="flex space-x-4 overflow-x-auto pb-2 text-sm">
            {[
              { title: 'Basic', desc: 'Logo Design Only', price: 'P500 – P1,000' },
              { title: 'Standard', desc: 'Logo + Brand Guide', price: 'P1,500 – P2,000' },
              { title: 'Premium', desc: 'Full Branding, Stationery, Poster', price: 'P2,500 – P3,000' }
            ].map((item) => (
              <div
                key={item.title}
                className="min-w-[200px] flex-shrink-0 border border-gray-500/20 rounded-lg p-4 bg-white"
              >
                <h3 className="font-bold text-main-dark mb-1">{item.title}</h3>
                <p className="text-tiny text-gray-600">{item.desc}</p>
                <p className="font-semibold text-main mt-2">{item.price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Printables */}
        <Section
          title="Printables"
          icon={<DocumentIcon className="w-5 h-5 text-main" />}
          items={[
            ['Flyer (1–2 pages)', 'P300 – P500'],
            ['Poster / Banner', 'P400 – P700'],
            ['Business Card', 'P300 – P500'],
            ['Invitation / Letterhead', 'P400 – P600'],
            ['Certificate / Folder', 'P400 – P600']
          ]}
        />

        {/* Digital Artwork & Editing */}
        <Section
          title="Digital Artwork & Editing"
          icon={<CpuChipIcon className="w-5 h-5 text-main" />}
          items={[
            ['Menu Design', 'P800 – P1,000'],
            ['Photo Editing', 'P150 – P300'],
            ['Product Label', 'P500 – P800'],
            ['Photomanipulation', 'P400 – P700'],
            ['Event Poster', 'P700 – P1,000']
          ]}
        />

        {/* Social Media Design */}
        <Section
          title="Social Media Design"
          icon={<DevicePhoneMobileIcon className="w-5 h-5 text-main" />}
          items={[
            ['Single Post (FB/IG)', 'P200 – P300'],
            ['10 Posts', 'P1,000 – P1,500'],
            ['20 Posts', 'P2,000 – P2,500'],
            ['30 Posts', 'P3,000 – P4,000'],
            ['Reels / TikTok Layout', 'P500 – P800'],
            ['Cover Banner', 'P400 – P600']
          ]}
        />

        {/* Future Services */}
        <div className="text-center mt-10 text-sm text-gray-500">
          🚧 More services like web development, UI/UX design, and video editing coming soon!
        </div>
      </div>
    </motion.div>
  )
}

export default Services
