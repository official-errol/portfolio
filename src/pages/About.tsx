import React from 'react'
import { motion } from 'framer-motion'
import {
  CodeBracketIcon,
  PaintBrushIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline'
import { Helmet } from 'react-helmet'

const About: React.FC = () => {
  const skills = [
    { name: 'Frontend', items: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Framer Motion'] },
    { name: 'Backend', items: ['Node.js', 'MySQL', 'Firebase', 'Supabase', 'PHP', 'Laravel'] },
    { name: 'Tools', items: ['Git', 'Photoshop', 'Figma'] },
  ]

  const skillIcons: Record<string, React.ReactNode> = {
    'React': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1 20.615v-8.723c-.625.347-1 .984-1 1.718 0 1.103.896 2 2 2s2-.897 2-2c0-.734-.375-1.371-1-1.718v8.723c-1.684-.552-3-1.2-3-1.937 0-.736 1.316-1.385 3-1.937v-2.416c-2.293.552-4 1.734-4 3.187 0 1.454 1.707 2.635 4 3.187v2.416c-1.684.552-3 1.2-3 1.937 0 .737 1.316 1.385 3 1.937v-2.416c2.293-.552 4-1.734 4-3.187 0-1.453-1.707-2.635-4-3.187v2.416c1.684.552 3 1.2 3 1.937 0 .737-1.316 1.385-3 1.937z"/>
      </svg>
    ),
    'TypeScript': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
        <path d="M3 3h18v18h-18v-18zm13.33 11.84c.18.4.43.71.76.95.33.24.76.36 1.27.36.59 0 1.06-.15 1.4-.45.35-.3.52-.74.52-1.31 0-.28-.05-.52-.14-.73-.1-.2-.24-.38-.42-.52-.18-.14-.4-.25-.66-.33-.26-.08-.55-.13-.88-.15l-.72-.08c-.26-.03-.49-.06-.69-.09-.2-.03-.38-.07-.54-.12-.16-.05-.29-.12-.4-.21-.11-.09-.18-.21-.24-.35-.05-.15-.08-.33-.08-.55 0-.23.05-.43.16-.6.11-.17.26-.31.45-.42.2-.11.43-.19.71-.24.28-.05.6-.08.97-.08.39 0 .74.05 1.05.14.31.09.58.23.8.41.22.18.39.41.51.68.12.27.18.59.18.96h-1.56c0-.26-.04-.48-.12-.66-.08-.18-.19-.32-.34-.42-.15-.1-.34-.15-.56-.15-.21 0-.38.04-.51.13-.13.09-.22.21-.28.36-.06.15-.09.32-.09.51 0 .18.03.34.09.47.06.13.15.24.27.33.12.09.26.16.43.22.17.06.36.1.57.13l.69.08c.28.03.54.06.78.1.24.04.46.09.66.15.2.06.38.14.54.24.16.1.28.23.38.39.1.16.14.36.14.6 0 .25-.05.47-.16.66-.11.19-.27.34-.48.46-.21.12-.46.21-.76.27-.3.06-.65.09-1.05.09-.43 0-.82-.05-1.17-.14-.35-.09-.65-.22-.91-.4-.26-.18-.46-.41-.6-.68-.14-.27-.21-.6-.21-1h1.59c0 .24.05.44.14.6.09.16.22.28.39.37.17.09.37.13.6.13.23 0 .41-.04.55-.13.14-.09.24-.21.31-.36.07-.15.1-.32.1-.5 0-.18-.03-.33-.09-.46-.06-.13-.15-.24-.26-.32zm-5.34-1.48l-1.41-2.35h1.71v-1.32h-4.65v1.32h1.6l1.64 2.79-1.64 2.79h-1.6v1.32h4.65v-1.32h-1.71l1.41-2.35z"/>
      </svg>
    ),
    'Tailwind CSS': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
        <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35-.98-1-2.09-2.15-4.59-2.15zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35-.98-1-2.09-2.15-4.59-2.15z"/>
      </svg>
    ),
    'Next.js': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
        <path d="M11.25 0l-1.5 1.5 5.25 5.25h-9v1.5h9l-5.25 5.25 1.5 1.5 7.5-7.5-7.5-7.5zm-9 22.5h1.5v-3h9v-1.5h-9v-1.5h9v-1.5h-10.5v7.5z"/>
      </svg>
    ),
    'Framer Motion': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
        <path d="M4 0l16 12-16 12-4-8 8-4-8-4 4-8z"/>
      </svg>
    ),
    'Node.js': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1 18.465v-10.93l-6.5 3.465v-1.93l6.5-3.465v-1.93l-8.5 4.53v10.94l8.5 4.53v-1.931l-6.5-3.465v-1.93l6.5 3.465z"/>
      </svg>
    ),
    'MySQL': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
        <path d="M17.417 9.5c-.417-.333-1.083-.5-2-.5-1 0-1.5.25-1.5.75s.5.75 1.5.75c.5 0 .917-.083 1.25-.25.333-.167.583-.417.75-.75.167-.333.25-.667.25-1s-.083-.667-.25-1zm-10.834 0c-.417-.333-1.083-.5-2-.5-1 0-1.5.25-1.5.75s.5.75 1.5.75c.5 0 .917-.083 1.25-.25.333-.167.583-.417.75-.75.167-.333.25-.667.25-1s-.083-.667-.25-1zm10.834 3c-.417-.333-1.083-.5-2-.5-1 0-1.5.25-1.5.75s.5.75 1.5.75c.5 0 .917-.083 1.25-.25.333-.167.583-.417.75-.75.167-.333.25-.667.25-1s-.083-.667-.25-1zm-10.834 0c-.417-.333-1.083-.5-2-.5-1 0-1.5.25-1.5.75s.5.75 1.5.75c.5 0 .917-.083 1.25-.25.333-.167.583-.417.75-.75.167-.333.25-.667.25-1s-.083-.667-.25-1zm10.834 3c-.417-.333-1.083-.5-2-.5-1 0-1.5.25-1.5.75s.5.75 1.5.75c.5 0 .917-.083 1.25-.25.333-.167.583-.417.75-.75.167-.333.25-.667.25-1s-.083-.667-.25-1zm-10.834 0c-.417-.333-1.083-.5-2-.5-1 0-1.5.25-1.5.75s.5.75 1.5.75c.5 0 .917-.083 1.25-.25.333-.167.583-.417.75-.75.167-.333.25-.667.25-1s-.083-.667-.25-1z"/>
      </svg>
    ),
    'Firebase': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
        <path d="M4 24l3-5.5-3-16 14 12-14 9.5zm14-9.5l3-16-3 5.5 3 10.5z"/>
      </svg>
    ),
    'Supabase': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
        <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.659z"/>
      </svg>
    ),
    'PHP': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1 17.5h-2v-7h2v7zm4 0h-2v-7h2v7zm4 0h-2v-7h2v7z"/>
      </svg>
    ),
    'Laravel': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
        <path d="M10.1 15.9l-3.1 1.8 6.2 3.6V24l-9.2-5.3v-10L12 1.1l5.2 3v10l-3.1-1.8V12l3.1 1.8v3.6l-3.1-1.8v3.6l3.1 1.8v3.6l-6.2-3.6v-3.6z"/>
      </svg>
    ),
    'Git': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
        <path d="M23.546 10.93L13.067.452a1.55 1.55 0 0 0-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 0 1 2.327 2.341l2.658 2.66a1.838 1.838 0 0 1 1.9 3.039 1.837 1.837 0 0 1-2.6 0 1.846 1.846 0 0 1-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348a1.848 1.848 0 0 1 0 2.6 1.844 1.844 0 0 1-2.609 0 1.834 1.834 0 0 1 0-2.598c.182-.18.387-.316.605-.406V8.835a1.834 1.834 0 0 1-.996-2.41L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477a1.545 1.545 0 0 0 2.186 0l10.43-10.43a1.544 1.544 0 0 0 0-2.187z"/>
      </svg>
    ),
    'Photoshop': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
        <path d="M3 3v18h18V3H3zm8.5 10.5h-1.5V15H8v-6h3c.66 0 1.5.34 1.5 1.5 0 .66-.84 1.5-1.5 1.5v.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5H11.5zm4.5-3.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm0 6c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5z"/>
      </svg>
    ),
    'Figma': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
        <path d="M15.5 12c0-1.4-.5-2.5-1-3.5.5-1 1-2 1-3.5C15.5 3 13 0 10.5 0S5.5 3 5.5 5c0 1.5.5 2.5 1 3.5-.5 1-1 2-1 3.5 0 3 2.5 6 4.5 6s4.5-3 4.5-6zm-6 0c0-1.4.5-2.5 1-3.5-.5-1-1-2-1-3.5 0-1.4.5-2.5 1-3.5h-3C3.5 3 1 6 1 9s2.5 6 4.5 6c1.4 0 2.5-.5 3.5-1-.5.5-1.5 1-2.5 1-1.4 0-2.5-.5-3.5-1 .5.5 1.5 1 2.5 1 1.4 0 2.5-.5 3.5-1-.5.5-1.5 1-2.5 1-1.4 0-2.5-.5-3.5-1 .5.5 1.5 1 2.5 1 1.4 0 2.5-.5 3.5-1-.5.5-1.5 1-2.5 1-1.4 0-2.5-.5-3.5-1 .5.5 1.5 1 2.5 1 1.4 0 2.5-.5 3.5-1v-3z"/>
      </svg>
    )
  }

  return (
    <>
      <Helmet>
        <link rel="canonical" href="https://www.errolsolomon.me/about" />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">About Me</h1>

          {/* Two Column Layout (My Journey + My Philosophy) */}
          <div className="flex flex-col md:flex-row gap-10">

            {/* Left: My Journey */}
            <div className="md:w-1/2">
              <motion.h2
                className="text-2xl font-semibold mb-6 text-main-dark"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                My Journey
              </motion.h2>

              {/* Paragraph + Image Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <motion.p
                  className="text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  I've been passionate about technology since childhood, starting with basic HTML/CSS websites and gradually growing into full-stack development. Now, as a graduating BSCS student, I've built a strong foundation through academic projects, internships, and personal learning.
                </motion.p>

                <motion.img
                  src="/static-website.svg"
                  alt="Static website illustration"
                  className="w-full h-auto object-contain max-w-[200px] mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                />
              </div>

              {/* Second paragraph */}
              <motion.p
                className="text-gray-600 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                I enjoy creating digital solutions that are both functional and user-friendly, blending technical skills with a focus on design and user experience.
              </motion.p>
            </div>

            {/* Right: My Philosophy */}
            <div className="md:w-1/2">
              <motion.h2
                className="text-2xl font-semibold mb-6 text-main-dark"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                My Philosophy
              </motion.h2>

              <div className="space-y-6">
                <motion.div
                  className="flex items-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <CodeBracketIcon className="w-6 h-6 mr-4 text-main mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Clean Code</h3>
                    <p className="text-gray-600">
                      Writing maintainable, efficient code with best practices.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <PaintBrushIcon className="w-6 h-6 mr-4 text-main mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Beautiful Design</h3>
                    <p className="text-gray-600">
                      Creating intuitive interfaces with attention to detail.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <DevicePhoneMobileIcon className="w-6 h-6 mr-4 text-main mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Responsive Experiences</h3>
                    <p className="text-gray-600">
                      Ensuring seamless performance across all devices.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-main-dark text-center">Skills & Technologies</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {skills.map((category, index) => (
                <motion.div
                  key={category.name}
                  className="p-6 rounded-xl bg-white/30 backdrop-blur-md border border-gray-500/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.2 }}
                >
                  <h3 className="text-xl font-semibold mb-4">{category.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center"
                      >
                        {skillIcons[item] || (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                          </svg>
                        )}
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}

export default About
