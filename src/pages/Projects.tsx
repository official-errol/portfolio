import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet'

const Projects: React.FC = () => {
  const [filter, setFilter] = useState('all')

  const projects = [
    {
      id: 1,
      title: 'QuicksheetCV',
      description: 'Instant resume builder without login',
      category: 'frontend',
      tags: ['React', 'Tailwind CSS', 'Vite'],
      liveLink: 'https://quicksheetcv.vercel.app',
      iframe: true,
    },
    {
      id: 2,
      title: 'E-Commerce Platform',
      description: 'Full-featured online store with payment integration',
      category: 'fullstack',
      tags: ['React', 'Node.js', 'Stripe', 'MongoDB'],
    },
    {
      id: 3,
      title: 'Task Management App',
      description: 'Collaborative tool for team task organization',
      category: 'frontend',
      tags: ['React', 'TypeScript', 'Redux', 'Tailwind CSS'],
    },
    {
      id: 4,
      title: 'Portfolio Website',
      description: 'Responsive portfolio for creative professionals',
      category: 'frontend',
      tags: ['React', 'Framer Motion', 'Tailwind CSS'],
    },
    {
      id: 5,
      title: 'API Service',
      description: 'RESTful API for mobile application backend',
      category: 'backend',
      tags: ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
    },
    {
      id: 6,
      title: 'Real-time Dashboard',
      description: 'Data visualization dashboard with live updates',
      category: 'fullstack',
      tags: ['React', 'Socket.io', 'D3.js', 'Express'],
    },
    {
      id: 7,
      title: 'Mobile Banking App',
      description: 'Secure mobile banking application UI',
      category: 'design',
      tags: ['Figma', 'UI/UX Design', 'Prototyping'],
    },
  ]

  const filteredProjects =
    filter === 'all' ? projects : projects.filter((project) => project.category === filter)

  return (
    <>
      <Helmet>
        <link rel="canonical" href="https://www.errolsolomon.me/projects" />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">My Projects</h1>

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl bg-white/30 backdrop-blur-md border border-gray-500/20 overflow-hidden"
              >
                <div className="h-56 bg-gray-200 relative overflow-hidden">
                  {project.iframe ? (
                    <div className="w-full h-full scale-[0.4] md:scale-[0.5] origin-top-left pointer-events-none">
                      <iframe
                        src={project.liveLink}
                        className="w-[1920px] h-[1080px] border-none"
                        title={project.title}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-xl font-bold text-white">{project.title}</h3>
                        <p className="text-gray-300">{project.description}</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2 text-gray-800">{project.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    {project.liveLink ? (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-main-dark font-medium hover:underline"
                      >
                        Live Preview
                      </a>
                    ) : (
                      <span className="text-gray-500">No Preview</span>
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
