import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { PaintBrushIcon, DocumentIcon, CpuChipIcon, DevicePhoneMobileIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { Helmet } from 'react-helmet'

const Services: React.FC = () => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    print: false,
    digital: false,
    social: false,
  })

  const toggle = (section: string) =>
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))

  return (
    <>
    <Helmet>
      <link rel="canonical" href="https://www.errolsolomon.me/services" />
    </Helmet>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-white px-4 py-10 text-gray-800"
    >
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center text-main-dark">My Services</h1>

        {/* Logo & Brand - Horizontal Scroll */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <PaintBrushIcon className="w-6 h-6 text-primary-light" />
            <h2 className="text-2xl font-semibold text-primary-light">Logo & Brand Visual Identity</h2>
          </div>

          <div className="flex space-x-4 overflow-x-auto pb-2 text-md">
            {[
              { title: 'Basic', desc: 'Logo Design Only', price: 'P500 – P1,000' },
              { title: 'Standard', desc: 'Logo + Brand Guide', price: 'P1,500 – P2,000' },
              { title: 'Premium', desc: 'Full Branding, Stationery, Poster', price: 'P2,500 – P3,000' }
            ].map((item) => (
              <div
                key={item.title}
                className="min-w-[200px] flex-shrink-0 border border-gray-500 rounded-lg p-4"
              >
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p>{item.desc}</p>
                <p className="font-semibold text-main-dark mt-2">{item.price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Collapsible Printables */}
        <section className="mb-6">
          <button
            onClick={() => toggle('print')}
            className="w-full flex items-center justify-between mb-2"
          >
            <div className="flex items-center gap-2">
              <DocumentIcon className="w-5 h-5 text-primary-light" />
              <h2 className="text-xl font-semibold text-primary-light">Printables</h2>
            </div>
            {openSections.print ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
          </button>

          {openSections.print && (
            <div className="grid md:grid-cols-2 gap-6 text-tiny">
              {[
                ['Flyer (1–2 pages)', 'P300 – P500'],
                ['Poster / Banner', 'P400 – P700'],
                ['Business Card', 'P300 – P500'],
                ['Invitation / Letterhead', 'P400 – P600'],
                ['Certificate / Folder', 'P400 – P600']
              ].map(([item, price]) => (
                <div key={item} className="flex justify-between border-b py-2 border-gray-500">
                  <span>{item}</span>
                  <span className="font-semibold text-main-dark">{price}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Collapsible Digital Art */}
        <section className="mb-6">
          <button
            onClick={() => toggle('digital')}
            className="w-full flex items-center justify-between mb-2"
          >
            <div className="flex items-center gap-2">
              <CpuChipIcon className="w-5 h-5 text-primary-light" />
              <h2 className="text-xl font-semibold text-primary-light">Digital Artwork & Editing</h2>
            </div>
            {openSections.digital ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
          </button>

          {openSections.digital && (
            <div className="grid md:grid-cols-2 gap-6 text-tiny">
              {[
                ['Menu Design', 'P800 – P1,000'],
                ['Photo Editing', 'P150 – P300'],
                ['Product Label', 'P500 – P800'],
                ['Photomanipulation', 'P400 – P700'],
                ['Event Poster', 'P700 – P1,000']
              ].map(([item, price]) => (
                <div key={item} className="flex justify-between border-b py-2 border-gray-500">
                  <span>{item}</span>
                  <span className="font-semibold text-main-dark">{price}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Collapsible Social Media */}
        <section className="mb-6">
          <button
            onClick={() => toggle('social')}
            className="w-full flex items-center justify-between mb-2"
          >
            <div className="flex items-center gap-2">
              <DevicePhoneMobileIcon className="w-5 h-5 text-primary-light" />
              <h2 className="text-xl font-semibold text-primary-light">Social Media Design</h2>
            </div>
            {openSections.social ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
          </button>

          {openSections.social && (
            <div className="grid md:grid-cols-2 gap-6 text-tiny">
              {[
                ['Single Post (FB/IG)', 'P200 – P300'],
                ['10 Posts', 'P1,000 – P1,500'],
                ['20 Posts', 'P2,000 – P2,500'],
                ['30 Posts', 'P3,000 – P4,000'],
                ['Reels / TikTok Layout', 'P500 – P800'],
                ['Cover Banner', 'P400 – P600']
              ].map(([item, price]) => (
                <div key={item} className="flex justify-between border-b py-2 border-gray-500">
                  <span>{item}</span>
                  <span className="font-semibold text-main-dark">{price}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Coming Soon */}
        <section className="mt-10 text-center text-sm text-gray-500">
          <p>🚧 More services like web development, UI/UX, and video editing coming soon!</p>
        </section>
      </div>
    </motion.div>
    </>
  )
}

export default Services
