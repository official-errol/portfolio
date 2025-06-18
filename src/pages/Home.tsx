import React from 'react'
import { motion } from 'framer-motion'
import { EnvelopeIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import profilePic from '../assets/meh.jpg'

const Home: React.FC = () => {
  const ownerName = import.meta.env.VITE_PORTFOLIO_OWNER_NAME
  return (
    <div className="relative min-h-[80vh] flex flex-col justify-center items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 flex flex-col items-center"
      >
        {/* Profile Image with space above */}
        <div className="mt-8 mb-6">
          <img
            src={profilePic}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover shadow-md"
          />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary-light">
          Hi, I'm <span className="text-main-dark">{ownerName}</span>
        </h1>

        <motion.h2 
          className="text-2xl md:text-3xl font-semibold mb-8 text-secondary-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Full-Stack Developer & UI/UX Designer
        </motion.h2>

        <motion.p 
          className="text-md md:text-lg mb-10 text-secondary-light max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          I create beautiful, responsive websites and applications with a focus on user experience 
          and modern technologies. Passionate about solving complex problems with elegant solutions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex flex-row justify-center space-x-4 text-xs"
        >
          <a 
            href="/contact" 
            className="flex items-center px-5 py-3 text-main-dark bg-main rounded-lg cursor-pointer select-none
              active:translate-y-2 active:[box-shadow:0_0px_0_0_#6CC832,0_0px_0_0_#9cee69]
              active:border-b-[1px]
              transition-all duration-150 [box-shadow:0_6px_0_0_#6CC832,0_10px_0_0_#9cee69]
              border-b border-main-dark"
          >
            <EnvelopeIcon className='w-4 h-4 mr-3'/>
            HIRE ME
          </a>

          <a 
            href="/projects" 
            className="flex items-center px-5 py-3 text-gray-800 bg-white rounded-lg cursor-pointer select-none
              active:translate-y-2 active:[box-shadow:0_0px_0_0_#d1d5db,0_0px_0_0_#d1d5db66]
              active:border-b-[1px]
              transition-all duration-150 [box-shadow:0_6px_0_0_#d1d5db,0_10px_0_0_#d1d5db66]
              border-[1px] border-gray-200"
          >
            <ArrowRightIcon className="w-4 h-4 mr-2" />
            VIEW PROJECTS
          </a>
        </motion.div>
      </motion.div>
      {/* Services Section */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="w-full bg-gray-50 py-12 px-4 mt-20"
>
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-3xl font-bold text-main-dark mb-4">
      Need Graphic Design Services?
    </h2>
    <p className="text-gray-600 mb-6">
      From logo creation to full branding packages and social media designs, I offer high-quality, customizable solutions at flexible pricing.
    </p>
    <a 
      href="/services" 
      className="flex items-center px-5 py-3 text-main-dark bg-main rounded-lg cursor-pointer select-none
              active:translate-y-2 active:[box-shadow:0_0px_0_0_#6CC832,0_0px_0_0_#9cee69]
              active:border-b-[1px]
              transition-all duration-150 [box-shadow:0_6px_0_0_#6CC832,0_10px_0_0_#9cee69]
              border-b border-main-dark"
    >
      <ArrowRightIcon className="w-5 h-5 mr-2" />
      View All Services
    </a>
  </div>
</motion.div>
    </div>
  )
}

export default Home
