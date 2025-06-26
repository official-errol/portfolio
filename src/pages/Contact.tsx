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
    <>
    <Helmet>
      <link rel="canonical" href="https://www.errolsolomon.me/contact" />
    </Helmet>
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-row items-center justify-between flex-wrap gap-4 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Get In Touch
          </h1>
          <img 
            src="/get-in-touch.svg" 
            alt="Contact banner" 
            className="w-32 sm:w-40 md:w-50 lg:w-60 h-auto object-contain"
          />
        </div>
       
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-main-dark">
                Contact Information
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <EnvelopeIcon className="w-6 h-6 mr-4 text-main mt-1" />
                  <div>
                    <h3 className="font-medium text-lg">Email</h3>
                    <a 
                      href="mailto:mr.errolsolomon@gmail.com" 
                      className="text-gray-600 hover:text-main"
                    >
                      mr.errolsolomon@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <PhoneIcon className="w-6 h-6 mr-4 text-main mt-1" />
                  <div>
                    <h3 className="font-medium text-lg">Phone</h3>
                    <a 
                      href="tel:+1234567890" 
                      className="text-gray-600 hover:text-main"
                    >
                      +63 994-399-6202
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPinIcon className="w-6 h-6 mr-4 text-main mt-1" />
                  <div>
                    <h3 className="font-medium text-lg">Location</h3>
                    <p className="text-gray-600">
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
              <h2 className="text-2xl font-semibold mb-6 text-main-dark">
                Let's Connect
              </h2>
              <p className="text-gray-600 mb-6">
                Feel free to reach out if you want to collaborate with me, or simply have a chat.
              </p>
              <div className="flex space-x-4">
                <div className="flex space-x-4">
  <a
    href="https://facebook.com/official.errol"
    target="_blank"
    rel="noopener noreferrer"
    className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center hover:bg-main hover:text-white transition-colors"
    aria-label="Facebook"
  >
    <svg className="w-6 h-6 text-gray-700 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.79c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 16.99 22 12z" />
    </svg>
  </a>
  <a
    href="https://instagram.com/official.errol"
    target="_blank"
    rel="noopener noreferrer"
    className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center hover:bg-main hover:text-white transition-colors"
    aria-label="Instagram"
  >
    <svg className="w-6 h-6 text-gray-700 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10zM12 7c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-3a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/>
    </svg>
  </a>
  <a
    href="https://github.com/official-errol"
    target="_blank"
    rel="noopener noreferrer"
    className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center hover:bg-main hover:text-white transition-colors"
    aria-label="GitHub"
  >
    <svg className="w-6 h-6 text-gray-700 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.486 2 12.014c0 4.426 2.865 8.179 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.455-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.004.07 1.533 1.032 1.533 1.032.892 1.529 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025a9.56 9.56 0 012.5-.336c.849.004 1.704.115 2.5.336 1.908-1.294 2.746-1.025 2.746-1.025.546 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.359.31.678.923.678 1.861 0 1.343-.012 2.426-.012 2.756 0 .267.18.58.688.481C19.137 20.19 22 16.437 22 12.014 22 6.486 17.523 2 12 2z"/>
    </svg>
  </a>
</div>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="px-4 py-6 rounded-xl bg-white/30 backdrop-blur-md border border-gray-500/20">
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('name', { required: 'Name is required' })}
                  aria-invalid={errors.name ? "true" : "false"}
                />
                {errors.name && (
                  <p className="mt-1 text-red-500">{errors.name.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
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
                <label htmlFor="subject" className="block text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main ${
                    errors.subject ? 'border-red-500' : 'border-gray-300'
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
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
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
                className={`w-full mb-4 px-5 py-3 text-white text-xs bg-stone-900 rounded-lg cursor-pointer select-none
    active:translate-y-2  active:[box-shadow:0_0px_0_0_#383534,0_0px_0_0_#0f172a66]
    active:border-b-[1px]
    transition-all duration-150 [box-shadow:0_6px_0_0_#383534,0_10px_0_0_#0f172a66]
    border-[1px] border-stone-600 ${
                  isSubmitting
                    ? 'cursor-not-allowed'
                    : ''
                }`}
              >
                {isSubmitting ? 'SENDING ...' : 'SEND MESSAGE'}
              </button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
    </>
  )
}

export default Contact
