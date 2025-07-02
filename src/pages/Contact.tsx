import React from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet'
import { FaFacebookF, FaInstagram, FaGithub } from 'react-icons/fa'
import { HiOutlineMail, HiOutlinePhone, HiOutlineMap } from 'react-icons/hi'

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

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
            Get In Touch
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column */}
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
                        href="tel:+639943996202" 
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
                  {/* Facebook */}
                  <a
                    href="https://facebook.com/official.errol"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center transition-transform hover:scale-105"
                    aria-label="Facebook"
                  >
                    <FaFacebookF className="w-5 h-5 text-white" />
                  </a>
                
                  {/* Instagram */}
                  <a
                    href="https://instagram.com/official.errol"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center transition-transform hover:scale-105"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="w-5 h-5 text-white" />
                  </a>
                
                  {/* GitHub */}
                  <a
                    href="https://github.com/official-errol"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center transition-transform hover:scale-105"
                    aria-label="GitHub"
                  >
                    <FaGithub className="w-5 h-5 text-white" />
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Right Column (Form) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="px-4 py-6 rounded-xl bg-white/30 backdrop-blur-md border border-gray-500/20">
                {['name', 'email', 'subject'].map((field) => (
                  <div className="mb-4" key={field}>
                    <label htmlFor={field} className="block text-gray-700 mb-2 capitalize">{field}</label>
                    <input
                      id={field}
                      type={field === 'email' ? 'email' : 'text'}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main ${
                        errors[field as keyof FormData] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      {...register(field as keyof FormData, { required: `${field} is required` })}
                    />
                    {errors[field as keyof FormData] && (
                      <p className="mt-1 text-red-500">{errors[field as keyof FormData]?.message}</p>
                    )}
                  </div>
                ))}

                <div className="mb-4">
                  <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
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
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-red-500">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-5 py-3 text-white bg-stone-900 rounded-lg text-xs transition-all duration-150 border border-stone-600
                    active:translate-y-2 active:[box-shadow:0_0px_0_0_#383534,0_0px_0_0_#0f172a66]
                    active:border-b-[1px] [box-shadow:0_6px_0_0_#383534,0_10px_0_0_#0f172a66]
                    ${isSubmitting ? 'cursor-not-allowed' : ''}`}
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
