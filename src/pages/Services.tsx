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

const SectionWrapper: React.FC<{
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  open: boolean
  toggle: () => void
}> = ({ icon, title, children, open, toggle }) => (
  <section className="mb-8 bg-main/10 rounded-lg border border-gray-500">
    <button
      onClick={toggle}
      className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
    >
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-xl font-semibold text-main-dark">{title}</h2>
      </div>
      {open ? (
        <ChevronUpIcon className="w-4 h-4 text-main-dark" />
      ) : (
        <ChevronDownIcon className="w-4 h-4 text-main-dark" />
      )}
    </button>

    {open && <div className="px-6 pb-6">{children}</div>}
  </section>
)

const Services: React.FC = () => {
  const [open, setOpen] = useState({
    brand: true,
    print: false,
    digital: false,
    social: false
  })

  const toggle = (key: keyof typeof open) =>
    setOpen(prev => ({ ...prev, [key]: !prev[key] }))

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

        {/* Logo & Brand (Scrollable Cards) */}
        <section className="mb-8 bg-main/10 border border-gray-500 rounded-lg px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <PaintBrushIcon className="w-6 h-6 text-main" />
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
                className="min-w-[200px] flex-shrink-0 border border-gray-500 rounded-lg p-4 bg-white"
              >
                <h3 className="font-bold text-main-dark mb-1">{item.title}</h3>
                <p className="text-tiny text-gray-600">{item.desc}</p>
                <p className="font-semibold text-main mt-2">{item.price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Printables */}
        <SectionWrapper
          title="Printables"
          open={open.print}
          toggle={() => toggle('print')}
          icon={<DocumentIcon className="w-5 h-5 text-main" />}
        >
          <div className="grid md:grid-cols-2 gap-4 text-sm">
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
        </SectionWrapper>

        {/* Digital */}
        <SectionWrapper
          title="Digital Artwork & Editing"
          open={open.digital}
          toggle={() => toggle('digital')}
          icon={<CpuChipIcon className="w-5 h-5 text-main" />}
        >
          <div className="grid md:grid-cols-2 gap-4 text-sm">
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
        </SectionWrapper>

        {/* Social Media */}
        <SectionWrapper
          title="Social Media Design"
          open={open.social}
          toggle={() => toggle('social')}
          icon={<DevicePhoneMobileIcon className="w-5 h-5 text-main" />}
        >
          <div className="grid md:grid-cols-2 gap-4 text-sm">
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
        </SectionWrapper>

        {/* Placeholder for More Services */}
        <section className="mt-10 text-center text-sm text-gray-500">
          <p>🚧 More services like Web Development, UI/UX Design, and Video Editing coming soon!</p>
        </section>
      </div>
    </motion.div>
  )
}

export default Services
