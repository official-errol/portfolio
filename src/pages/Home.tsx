import React from 'react'
import { motion } from 'framer-motion'
import { EnvelopeIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

const Home: React.FC = () => {
  const ownerName = import.meta.env.VITE_PORTFOLIO_OWNER_NAME
  return (
    <div className="relative min-h-[80vh] flex flex-col justify-center items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800 dark:text-white">
          Hi, I'm <span className="text-main dark:text-main-light">{ownerName}</span>
        </h1>
        
        <motion.h2 
          className="text-2xl md:text-4xl font-semibold mb-8 text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Full-Stack Developer & UI/UX Designer
        </motion.h2>
        
        <motion.p 
          className="text-lg md:text-xl mb-10 text-gray-600 dark:text-gray-400 max-w-3xl"
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
          className="flex flex-col sm:flex-row justify-center"
        >
          <a 
            href="/contact" 
            className="flex items-center px-6 py-3 text-white bg-stone-900 rounded-lg cursor-pointer select-none
    active:translate-y-2  active:[box-shadow:0_0px_0_0_#383534,0_0px_0_0_#0f172a66]
    active:border-b-[1px]
    transition-all duration-150 [box-shadow:0_10px_0_0_#383534,0_15px_0_0_#0f172a66]
    border-[1px] border-stone-600 mb-6"
          >
            <EnvelopeIcon className='w-5 h-5 mr-3'/>
            Contact Me
          </a>
          <a 
            href="/projects" 
            className="flex items-center px-6 py-3 text-gray-800 bg-white rounded-lg cursor-pointer select-none
    active:translate-y-2  active:[box-shadow:0_0px_0_0_#d1d5db,0_0px_0_0_#d1d5db66]
    active:border-b-[1px]
    transition-all duration-150 [box-shadow:0_10px_0_0_#d1d5db,0_15px_0_0_#d1d5db66]
    border-[1px] border-gray-200"
          >
            <ArrowRightIcon className="w-5 h-5 mr-3" />
            View Projects
          </a>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Home
