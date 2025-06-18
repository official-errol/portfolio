import React from 'react'
import { motion } from 'framer-motion'
import { PaintBrushIcon, DocumentIcon, CpuChipIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline'

const Services: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-white px-4 py-10 text-gray-800"
    >
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center text-main-dark">
          My Services
        </h1>

        {/* Logo & Brand Identity */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <PaintBrushIcon className="w-6 h-6 text-primary-light" />
            <h2 className="text-2xl font-semibold text-primary-light">
              Logo & Brand Visual Identity
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">Basic</h3>
              <p>Logo Design Only</p>
              <p className="font-semibold mt-2 text-main-dark">P500 – P1,000</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">Standard</h3>
              <p>Logo + Brand Guide</p>
              <p className="font-semibold mt-2 text-main-dark">P1,500 – P2,000</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">Premium</h3>
              <p>Full Branding, Stationery, Poster</p>
              <p className="font-semibold mt-2 text-main-dark">P2,500 – P3,000</p>
            </div>
          </div>
        </section>

        {/* Printables */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <DocumentIcon className="w-6 h-6 text-primary-light" />
            <h2 className="text-2xl font-semibold text-primary-light">Printables</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              ['Flyer (1–2 pages)', 'P300 – P500'],
              ['Poster / Banner', 'P400 – P700'],
              ['Business Card', 'P300 – P500'],
              ['Invitation / Letterhead', 'P400 – P600'],
              ['Certificate / Folder', 'P400 – P600'],
            ].map(([item, price]) => (
              <div key={item} className="flex justify-between border-b py-2">
                <span>{item}</span>
                <span className="font-semibold text-main-dark">{price}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Digital Art & Editing */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <CpuChipIcon className="w-6 h-6 text-primary-light" />
            <h2 className="text-2xl font-semibold text-primary-light">Digital Artwork & Editing</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              ['Menu Design', 'P800 – P1,000'],
              ['Photo Editing', 'P150 – P300'],
              ['Product Label', 'P500 – P800'],
              ['Photomanipulation', 'P400 – P700'],
              ['Event Poster', 'P700 – P1,000']
            ].map(([item, price]) => (
              <div key={item} className="flex justify-between border-b py-2">
                <span>{item}</span>
                <span className="font-semibold text-main-dark">{price}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Social Media Design */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <DevicePhoneMobileIcon className="w-6 h-6 text-primary-light" />
            <h2 className="text-2xl font-semibold text-primary-light">Social Media Design</h2>
          </div>
          <p className="italic text-sm text-gray-600 mb-4">@charlesandrei.designs</p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              ['Single Post (FB/IG)', 'P200 – P300'],
              ['10 Posts', 'P1,000 – P1,500'],
              ['20 Posts', 'P2,000 – P2,500'],
              ['30 Posts', 'P3,000 – P4,000'],
              ['Reels / TikTok Layout', 'P500 – P800'],
              ['Cover Banner', 'P400 – P600']
            ].map(([item, price]) => (
              <div key={item} className="flex justify-between border-b py-2">
                <span>{item}</span>
                <span className="font-semibold text-main-dark">{price}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Future Services Placeholder */}
        <section className="mt-16 text-center text-sm text-gray-500">
          <p>🚧 More services like web development, UI/UX, and video editing coming soon!</p>
        </section>
      </div>
    </motion.div>
  )
}

export default Services
