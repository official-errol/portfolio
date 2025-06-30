import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  PaintBrushIcon,
  DocumentIcon,
  CpuChipIcon,
  DevicePhoneMobileIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'
import { Helmet } from 'react-helmet'

const Services: React.FC = () => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    print: false,
    digital: false,
    social: false
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
        className="min-h-screen bg-white px-4 py-12 text-gray-800"
      >
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-12 text-center text-main-dark">
            My Services
          </h1>

          {/* Logo & Branding Section */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <PaintBrushIcon className="w-6 h-6 text-main" />
              <h2 className="text-2xl font-semibold text-main">Logo & Brand Visual Identity</h2>
            </div>

            <div className="flex space-x-4 overflow-x-auto pb-2 text-sm scrollbar-thin">
              {[
                { title: 'Basic', desc: 'Logo Design Only', price: '₱500 – ₱1,000' },
                { title: 'Standard', desc: 'Logo + Brand Guide', price: '₱1,500 – ₱2,000' },
                { title: 'Premium', desc: 'Full Branding, Stationery, Poster', price: '₱2,500 – ₱3,000' }
              ].map((item) => (
                <div
                  key={item.title}
                  className="min-w-[220px] bg-white border border-gray-300 rounded-lg p-4"
                >
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                  <p className="font-semibold text-main-dark mt-2">{item.price}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Printables Section */}
          <ServiceCollapse
            icon={DocumentIcon}
            title="Printables"
            open={openSections.print}
            onToggle={() => toggle('print')}
            items={[
              ['Flyer (1–2 pages)', '₱300 – ₱500'],
              ['Poster / Banner', '₱400 – ₱700'],
              ['Business Card', '₱300 – ₱500'],
              ['Invitation / Letterhead', '₱400 – ₱600'],
              ['Certificate / Folder', '₱400 – ₱600']
            ]}
          />

          {/* Digital Art Section */}
          <ServiceCollapse
            icon={CpuChipIcon}
            title="Digital Artwork & Editing"
            open={openSections.digital}
            onToggle={() => toggle('digital')}
            items={[
              ['Menu Design', '₱800 – ₱1,000'],
              ['Photo Editing', '₱150 – ₱300'],
              ['Product Label', '₱500 – ₱800'],
              ['Photomanipulation', '₱400 – ₱700'],
              ['Event Poster', '₱700 – ₱1,000']
            ]}
          />

          {/* Social Media Section */}
          <ServiceCollapse
            icon={DevicePhoneMobileIcon}
            title="Social Media Design"
            open={openSections.social}
            onToggle={() => toggle('social')}
            items={[
              ['Single Post (FB/IG)', '₱200 – ₱300'],
              ['10 Posts', '₱1,000 – ₱1,500'],
              ['20 Posts', '₱2,000 – ₱2,500'],
              ['30 Posts', '₱3,000 – ₱4,000'],
              ['Reels / TikTok Layout', '₱500 – ₱800'],
              ['Cover Banner', '₱400 – ₱600']
            ]}
          />

          {/* Coming Soon */}
          <div className="mt-12 text-center text-sm text-gray-500">
            🚧 More services like web development, UI/UX, and video editing coming soon!
          </div>
        </div>
      </motion.div>
    </>
  )
}

interface CollapseProps {
  title: string
  icon: React.ElementType
  open: boolean
  onToggle: () => void
  items: [string, string][]
}

const ServiceCollapse: React.FC<CollapseProps> = ({ title, icon: Icon, open, onToggle, items }) => {
  return (
    <section className="mb-8">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-2"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-main" />
          <h2 className="text-xl font-semibold text-main">{title}</h2>
        </div>
        {open ? (
          <ChevronUpIcon className="w-4 h-4 text-main" />
        ) : (
          <ChevronDownIcon className="w-4 h-4 text-main" />
        )}
      </button>

      {open && (
        <div className="grid md:grid-cols-2 gap-4 text-sm mt-2 bg-white p-4 rounded-lg border border-gray-300">
          {items.map(([item, price]) => (
            <div
              key={item}
              className="flex justify-between border-b py-2 border-gray-200"
            >
              <span>{item}</span>
              <span className="font-semibold text-main-dark">{price}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Services
