import React from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

const Contact: React.FC = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Form submitted:', data)
    reset()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800 dark:text-white">
          Get In Touch
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-main-dark dark:text-main-light">
                Contact Information
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <EnvelopeIcon className="w-6 h-6 mr-4 text-main dark:text-main-light mt-1" />
                  <div>
                    <h3 className="font-medium text-lg">Email</h3>
                    <a 
                      href="mailto:contact@example.com" 
                      className="text-gray-600 dark:text-gray-300 hover:text-main dark:hover:text-main-light"
                    >
                      mr.errolsolomon@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <PhoneIcon className="w-6 h-6 mr-4 text-main dark:text-main-light mt-1" />
                  <div>
                    <h3 className="font-medium text-lg">Phone</h3>
                    <a 
                      href="tel:+1234567890" 
                      className="text-gray-600 dark:text-gray-300 hover:text-main dark:hover:text-main-light"
                    >
                      +63 994-399-6202
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPinIcon className="w-6 h-6 mr-4 text-main dark:text-main-light mt-1" />
                  <div>
                    <h3 className="font-medium text-lg">Location</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        Lipa City, Batangas 4217, Philippines
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-main-dark dark:text-main-light">
                Let's Connect
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Feel free to reach out if you want to collaborate with me, or simply have a chat.
              </p>
              <div className="flex space-x-4">
                {['facebook', 'instagram', 'github'].map((platform) => (
                  <a 
                    key={platform}
                    href={`https://${platform}.com`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-main hover:text-white dark:hover:bg-main-light transition-colors"
                    aria-label={platform}
                  >
                    <span className="font-semibold">{platform.charAt(0).toUpperCase()}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-8 rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border border-gray-500/20 shadow-sm">
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main dark:bg-gray-700 dark:text-white ${
                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  {...register('name', { required: 'Name is required' })}
                  aria-invalid={errors.name ? "true" : "false"}
                />
                {errors.name && (
                  <p className="mt-1 text-red-500">{errors.name.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main dark:bg-gray-700 dark:text-white ${
                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <p className="mt-1 text-red-500">{errors.email.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main dark:bg-gray-700 dark:text-white ${
                    errors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  {...register('subject', { required: 'Subject is required' })}
                  aria-invalid={errors.subject ? "true" : "false"}
                />
                {errors.subject && (
                  <p className="mt-1 text-red-500">{errors.subject.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main dark:bg-gray-700 dark:text-white ${
                    errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  {...register('message', { 
                    required: 'Message is required',
                    minLength: {
                      value: 20,
                      message: 'Message should be at least 20 characters'
                    }
                  })}
                  aria-invalid={errors.message ? "true" : "false"}
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-red-500">{errors.message.message}</p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full mb-4 px-6 py-3 text-white bg-stone-900 rounded-lg cursor-pointer select-none
    active:translate-y-2  active:[box-shadow:0_0px_0_0_#383534,0_0px_0_0_#0f172a66]
    active:border-b-[1px]
    transition-all duration-150 [box-shadow:0_10px_0_0_#383534,0_15px_0_0_#0f172a66]
    border-[1px] border-stone-600 ${
                  isSubmitting
                    ? 'cursor-not-allowed'
                    : ''
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Contact
