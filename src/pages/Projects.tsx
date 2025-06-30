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
    filter === 'all'
      ? projects
      : projects.filter((project) => project.category === filter)

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

          <div className="mb-10">
            <div className="flex flex-wrap gap-2">
              {['all', 'frontend', 'backend', 'fullstack', 'design'].map(
                (category) => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`px-4 py-2 rounded-full capitalize ${
                      filter === category
                        ? 'bg-main text-main-dark'
                        : 'text-gray-700 hover:bg-gray-200/30 rounded-full bg-white/30 backdrop-blur-md border border-gray-500/20'
                    }`}
                  >
                    {category}
                  </button>
                )
              )}
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
                <div className="relative w-full h-[300px] overflow-hidden rounded-t-xl bg-gray-100">
                  {project.iframe && project.liveLink ? (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full"
                    >
                      <div
                        className="absolute top-0 left-0 origin-top-left scale-[0.1875] md:scale-[0.2]"
                        style={{
                          width: '1920px',
                          height: '1080px',
                        }}
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
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-xl font-bold text-white">
                          {project.title}
                        </h3>
                        <p className="text-gray-300">{project.description}</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
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
                        Visit Site
                      </a>
                    ) : (
                      <button className="text-main-dark font-medium hover:underline">
                        View Details
                      </button>
                    )}
                    <button className="text-gray-700 hover:text-main">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
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
