import React from 'react'
import { motion } from 'framer-motion'
import {
  CodeBracketIcon,
  PaintBrushIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline'
import { Helmet } from 'react-helmet'
import {
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiNextdotjs,
  SiFramer,
  SiNodedotjs,
  SiMysql,
  SiFirebase,
  SiSupabase,
  SiPhp,
  SiLaravel,
  SiGit,
  SiAdobephotoshop,
  SiFigma
} from 'react-icons/si'
import { FaQuestion } from 'react-icons/fa'

const About: React.FC = () => {
  const skills = [
    { name: 'Frontend', items: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Framer Motion'] },
    { name: 'Backend', items: ['Node.js', 'MySQL', 'Firebase', 'Supabase', 'PHP', 'Laravel'] },
    { name: 'Tools', items: ['Git', 'Photoshop', 'Figma'] },
  ]

  const skillIcons: Record<string, React.ReactNode> = {
    'React': <SiReact className="w-5 h-5 mr-2 text-sky-500" />,
    'TypeScript': <SiTypescript className="w-5 h-5 mr-2 text-blue-600" />,
    'Tailwind CSS': <SiTailwindcss className="w-5 h-5 mr-2 text-cyan-500" />,
    'Next.js': <SiNextdotjs className="w-5 h-5 mr-2 text-gray-900 dark:text-white" />,
    'Framer Motion': <SiFramer className="w-5 h-5 mr-2 text-pink-500" />,
  
    'Node.js': <SiNodedotjs className="w-5 h-5 mr-2 text-green-600" />,
    'MySQL': <SiMysql className="w-5 h-5 mr-2 text-blue-700" />,
    'Firebase': <SiFirebase className="w-5 h-5 mr-2 text-yellow-500" />,
    'Supabase': <SiSupabase className="w-5 h-5 mr-2 text-emerald-600" />,
    'PHP': <SiPhp className="w-5 h-5 mr-2 text-indigo-700 opacity-70" />,
    'Laravel': <SiLaravel className="w-5 h-5 mr-2 text-red-500" />,
  
    'Git': <SiGit className="w-5 h-5 mr-2 text-orange-500" />,
    'Photoshop': <SiAdobephotoshop className="w-5 h-5 mr-2 text-blue-400" />,
    'Figma': <SiFigma className="w-5 h-5 mr-2 text-pink-500" />,
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
                        className="px-4 py-2 bg-gray-100 rounded-full text-sm flex items-center"
                      >
                        {skillIcons[item] || (
                          <FaQuestion className="w-5 h-5 mr-2 text-gray-500" />
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
