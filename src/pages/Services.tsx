import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  PaintBrushIcon,
  DocumentIcon,
  CpuChipIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'
import { Helmet } from 'react-helmet'

const Services: React.FC = () => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    print: false,
    digital: false
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
          <h1 className="text-4xl font-bold mb-12 text-left text-gray-800">
            My Services
          </h1>

          {/* Logo & Branding Section */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                🎨 Logo & Brand Visual Identity
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
              {[
                { title: 'Basic', desc: 'Logo Design Only', price: '₱800' },
                { title: 'Standard', desc: 'Logo + Brand Guide', price: '₱1,800' },
                { title: 'Premium', desc: 'Full Branding, Stationery, Poster', price: '₱3,000' }
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                  <p className="font-semibold mt-2">{item.price}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Printables Section */}
          <ServiceCollapse
            icon={DocumentIcon}
            title="🖨️ Printables"
            open={openSections.print}
            onToggle={() => toggle('print')}
            items={[
              ['Flyer (1–2 pages)', '₱350'],
              ['Poster / Banner', '₱500'],
              ['Business Card', '₱400'],
              ['Invitation / Letterhead', '₱450'],
              ['Certificate / Folder', '₱500']
            ]}
          />

          {/* Digital Art Section */}
          <ServiceCollapse
            icon={CpuChipIcon}
            title="🖌️ Digital Artwork & Editing"
            open={openSections.digital}
            onToggle={() => toggle('digital')}
            items={[
              ['Menu Design', '₱900'],
              ['Photo Editing', '₱200'],
              ['Product Label', '₱600'],
              ['Photomanipulation', '₱500'],
              ['Event Poster', '₱800']
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
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
        {open ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-800" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-800" />
        )}
      </button>

      {open && (
        <div className="grid md:grid-cols-2 gap-4 text-sm mt-2 bg-white p-4 rounded-lg border border-gray-200">
          {items.map(([item, price]) => (
            <div
              key={item}
              className="flex justify-between border-b py-2 border-gray-200"
            >
              <span>{item}</span>
              <span className="font-semibold">{price}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Services
