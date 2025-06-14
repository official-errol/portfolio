import React from 'react'
import { motion } from 'framer-motion'
import { CodeBracketIcon, PaintBrushIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline'

const About: React.FC = () => {
  const skills = [
    { name: 'Frontend', items: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Framer Motion'] },
    { name: 'Backend', items: ['Node.js', 'MySQL', 'Firebase', 'Supabase', 'PHP', 'Laravel'] },
    { name: 'Tools', items: ['Git', 'Photoshop', 'Figma'] },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header + Image Row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">About Me</h1>
            <motion.h2 
              className="text-2xl font-semibold mb-4 text-main-dark"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              My Journey
            </motion.h2>
          </div>

          {/* Image aligned beside titles only */}
          <motion.div 
            className="w-full md:w-1/3 md:ml-6 mb-6 md:mb-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <img 
              src="/static-website.svg" 
              alt="Static website illustration"
              className="h-28 w-auto object-contain mx-auto md:mx-0"
            />
          </motion.div>
        </div>

        {/* Text below titles and image */}
        <motion.p 
          className="mb-4 text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          I've been passionate about technology since childhood, starting with basic HTML/CSS websites and gradually growing into full-stack development. Now, as a graduating BSCS student, I've built a strong foundation through academic projects, internships, and personal learning. I enjoy creating digital solutions that are both functional and user-friendly, blending technical skills with a focus on design and user experience.
        </motion.p>

        <motion.p 
          className="text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          My approach combines technical excellence with design thinking, ensuring that every solution 
          not only works flawlessly but also delivers an exceptional user experience.
        </motion.p>

        {/* Philosophy Section */}
        <div className="mt-16">
          <motion.h2 
            className="text-2xl font-semibold mb-4 text-main-dark"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            My Philosophy
          </motion.h2>
          <div className="space-y-6">
            <motion.div 
              className="flex items-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <CodeBracketIcon className="w-6 h-6 mr-4 text-main mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Clean Code</h3>
                <p className="text-gray-600">
                  Writing maintainable, efficient code with best practices
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <PaintBrushIcon className="w-6 h-6 mr-4 text-main mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Beautiful Design</h3>
                <p className="text-gray-600">
                  Creating intuitive interfaces with attention to detail
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <DevicePhoneMobileIcon className="w-6 h-6 mr-4 text-main mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Responsive Experiences</h3>
                <p className="text-gray-600">
                  Ensuring seamless performance across all devices
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Skills Section */}
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-main-dark">Skills & Technologies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skills.map((category, index) => (
              <motion.div 
                key={category.name}
                className="p-6 rounded-xl bg-white/30 backdrop-blur-md border border-gray-500/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 + index * 0.2 }}
              >
                <h3 className="text-xl font-semibold mb-4">{category.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span 
                      key={item}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
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
  )
}

export default About
