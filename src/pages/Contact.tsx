import React from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { Helmet } from 'react-helmet'

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
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Form submitted:', data)
    reset()
  }

  return (
    <>
      <Helmet>
        <link rel="canonical" href="https://www.errolsolomon.me/contact" />
      </Helmet>

      <div className="min-h-[80vh] px-4 py-6 lg:py-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"
        >
          {/* Column 1: Contact Info + Socials */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Get In Touch
              </h1>
              <h2 className="text-xl font-semibold text-main-dark mb-4">
                Contact Information
              </h2>
              <div className="space-y-4 text-sm">
                <div className="flex items-start">
                  <EnvelopeIcon className="w-5 h-5 mr-3 text-main mt-1" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <a href="mailto:mr.errolsolomon@gmail.com" className="text-gray-600 hover:text-main">
                      mr.errolsolomon@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <PhoneIcon className="w-5 h-5 mr-3 text-main mt-1" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <a href="tel:+639943996202" className="text-gray-600 hover:text-main">
                      +63 994-399-6202
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPinIcon className="w-5 h-5 mr-3 text-main mt-1" />
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p className="text-gray-600">
                      Lipa City, Batangas 4217, Philippines
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-main-dark mb-2">
                Let's Connect
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Feel free to reach out if you want to collaborate with me, or simply have a chat.
              </p>
              <div className="flex space-x-4">
                {/* Facebook */}
                <a href="https://facebook.com/official.errol" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-main hover:text-white transition-colors">
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.79c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 16.99 22 12z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a href="https://instagram.com/official.errol" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-main hover:text-main-dark hover:bg-main transition-colors">
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10zM12 7c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-3a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                  </svg>
                </a>

                {/* GitHub */}
                <a href="https://github.com/official-errol" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-main hover:text-main-dark hover:bg-main transition-colors">
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.486 2 12.014c0 4.426 2.865 8.179 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.455-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.004.07 1.533 1.032 1.533 1.032.892 1.529 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025a9.56 9.56 0 012.5-.336c.849.004 1.704.115 2.5.336 1.908-1.294 2.746-1.025 2.746-1.025.546 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.359.31.678.923.678 1.861 0 1.343-.012 2.426-.012 2.756 0 .267.18.58.688.481C19.137 20.19 22 16.437 22 12.014 22 6.486 17.523 2 12 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white/30 backdrop-blur-md border border-gray-500/20 p-6 rounded-xl space-y-4"
            >
              {['name', 'email', 'subject'].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="block text-sm text-gray-700 mb-1 capitalize">{field}</label>
                  <input
                    id={field}
                    type={field === 'email' ? 'email' : 'text'}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-main ${
                      errors[field as keyof FormData] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    {...register(field as keyof FormData, { required: `${field} is required` })}
                  />
                  {errors[field as keyof FormData] && (
                    <p className="text-xs text-red-500 mt-1">{errors[field as keyof FormData]?.message}</p>
                  )}
                </div>
              ))}

              <div>
                <label htmlFor="message" className="block text-sm text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-main ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('message', {
                    required: 'Message is required',
                    minLength: { value: 20, message: 'Message should be at least 20 characters' }
                  })}
                ></textarea>
                {errors.message && (
                  <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 text-white bg-stone-900 rounded-lg text-sm transition-all duration-150 border border-stone-600 ${
                  isSubmitting ? 'cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'SENDING ...' : 'SEND MESSAGE'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}

export default Contact
