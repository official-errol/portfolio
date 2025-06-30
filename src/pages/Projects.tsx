import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet'

const Projects: React.FC = () => {
  const [filter, setFilter] = useState('all')

  const projects = [
    {
      id: 0,
      title: 'QuicksheetCV',
      description: 'Live resume builder – no login required.',
      category: 'frontend',
      tags: ['React', 'Tailwind CSS', 'Vite'],
      iframe: true,
      liveLink: 'https://quicksheetcv.vercel.app',
    },
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Full-featured online store with payment integration',
      category: 'fullstack',
      tags: ['React', 'Node.js', 'Stripe', 'MongoDB'],
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Collaborative tool for team task organization',
      category: 'frontend',
      tags: ['React', 'TypeScript', 'Redux', 'Tailwind CSS'],
    },
    {
      id: 3,
      title: 'Portfolio Website',
      description: 'Responsive portfolio for creative professionals',
      category: 'frontend',
      tags: ['React', 'Framer Motion', 'Tailwind CSS'],
    },
    {
      id: 4,
      title: 'API Service',
      description: 'RESTful API for mobile application backend',
      category: 'backend',
      tags: ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
    },
    {
      id: 5,
      title: 'Real-time Dashboard',
      description: 'Data visualization dashboard with live updates',
      category: 'fullstack',
      tags: ['React', 'Socket.io', 'D3.js', 'Express'],
    },
    {
      id: 6,
      title: 'Mobile Banking App',
      description: 'Secure mobile banking application UI',
      category: 'design',
      tags: ['Figma', 'UI/UX Design', 'Prototyping'],
    },
  ]

  const filteredProjects =
    filter === 'all' ? projects : projects.filter(p => p.category === filter)

  return (
    <>
      <Helmet>
        <link rel="canonical" href="https://www.errolsolomon.me/projects" />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
            My Projects
          </h1>

          {/* Filters */}
          <div className="mb-10">
            <div className="flex flex-wrap gap-2">
              {['all', 'frontend', 'backend', 'fullstack', 'design'].map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded-full capitalize ${
                    filter === category
                      ? 'bg-main text-main-dark'
                      : 'text-gray-700 hover:bg-gray-200/30 bg-white/30 backdrop-blur-md border border-gray-500/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl bg-white/30 backdrop-blur-md border border-gray-500/20 overflow-hidden shadow"
              >
                {/* Live Preview */}
                <div
                  className="relative w-full overflow-hidden bg-gray-100"
                  style={{ aspectRatio: '16 / 9' }}
                >
                  {project.iframe && project.liveLink ? (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full"
                    >
                      <div
                        className="absolute top-0 left-0 origin-top-left scale-[0.2] md:scale-[0.22] lg:scale-[0.24]"
                        style={{ width: '1920px', height: '1080px' }}
                      >
                        <iframe
                          src={project.liveLink}
                          width="1920"
                          height="1080"
                          className="border-none pointer-events-none"
                          title={project.title}
                        />
                      </div>
                    </a>
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                      Preview not available
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="p-6 space-y-2">
                  <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                  <p className="text-gray-600">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4">
                    {project.liveLink ? (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 rounded bg-main text-main-dark font-medium hover:underline"
                      >
                        Visit Site
                      </a>
                    ) : (
                      <span className="text-gray-500 text-sm">Coming Soon</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default Projects
