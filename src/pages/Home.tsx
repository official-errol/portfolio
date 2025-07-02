import React, { useEffect, useState } from 'react'
import BlurText from '../components/BlurText'
import TrueFocus from '../components/TrueFocus'
import DecryptedText from '../components/DecryptedText'
import { motion } from 'framer-motion'
import { EnvelopeIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import profilePic from '../assets/meh.jpg'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { Helmet } from 'react-helmet'

interface Post {
  id: string
  title: string
  slug: string
  content: string
  created_at: string
}

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <link rel="canonical" href="https://www.errolsolomon.me/" />
      </Helmet>

      {/* Page Container (Removed snap) */}
      <div className="min-h-screen flex flex-col">

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto flex flex-col items-center"
          >
            <div className="mt-8 mb-6">
              <img
                src={profilePic}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover shadow-md"
              />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary-light">
              Hi I'm
              <TrueFocus 
                sentence="Errol Solomon"
                manualMode={false}
                blurAmount={5}
                borderColor="red"
                animationDuration={2}
                pauseBetweenAnimations={1}
                />
          {/* <DecryptedText
                text=" Errol Solomon"
                characters="ABCD1234!?"
                animateOn="view"
                revealDirection="start"
                sequential={true}
                speed={100}
                maxIterations={20}
                className="revealed text-main-dark"
                parentClassName="all-letters"
                encryptedClassName="encrypted text-main-dark"
              /> */}
            </h1>

            <motion.h2
              className="text-2xl md:text-3xl font-semibold mb-8 text-secondary-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Full-Stack Developer & UI/UX Designer
            </motion.h2>

            <motion.p
              className="text-md md:text-lg mb-10 text-secondary-light max-w-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              I create beautiful, responsive websites and applications with a focus on user experience 
              and modern technologies. Passionate about solving complex problems with elegant solutions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex flex-row justify-center space-x-4 text-xs"
            >
              <a
                href="/contact"
                className="flex items-center px-5 py-3 text-main-dark bg-main rounded-lg cursor-pointer select-none
                  active:translate-y-2 active:[box-shadow:0_0px_0_0_#6CC832,0_0px_0_0_#9cee69]
                  active:border-b-[1px]
                  transition-all duration-150 [box-shadow:0_6px_0_0_#6CC832,0_10px_0_0_#9cee69]
                  border-b border-main-dark"
              >
                <EnvelopeIcon className='w-4 h-4 mr-3'/>
                HIRE ME
              </a>

              <a
                href="/projects"
                className="flex items-center px-5 py-3 text-gray-800 bg-white rounded-lg cursor-pointer select-none
                  active:translate-y-2 active:[box-shadow:0_0px_0_0_#d1d5db,0_0px_0_0_#d1d5db66]
                  active:border-b-[1px]
                  transition-all duration-150 [box-shadow:0_6px_0_0_#d1d5db,0_10px_0_0_#d1d5db66]
                  border-[1px] border-gray-200"
              >
                <ArrowRightIcon className="w-4 h-4 mr-2" />
                VIEW PROJECTS
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* Services Section */}
        <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-main-dark mb-4 text-center">
              Need Graphic Design Services?
          {/* <BlurText
                text="Need Graphic Design Services?"
                delay={150}
                animateBy="words"
                direction="top"
              /> */}
            </h2>
            <p className="text-gray-600 mb-6">
              From logo creation to full branding packages and social media designs, I offer high-quality, customizable solutions at flexible pricing.
            </p>
            <a
              href="/services"
              className="inline-flex items-center px-5 py-3 text-xs text-main-dark bg-main rounded-lg cursor-pointer select-none
                      active:translate-y-2 active:[box-shadow:0_0px_0_0_#6CC832,0_0px_0_0_#9cee69]
                      active:border-b-[1px]
                      transition-all duration-150 [box-shadow:0_6px_0_0_#6CC832,0_10px_0_0_#9cee69]
                      border-b border-main-dark"
            >
              <ArrowRightIcon className="w-5 h-5 mr-2" />
              MY SERVICES
            </a>
          </motion.div>
        </section>

        {/* Blog Section */}
        <section className="min-h-screen bg-white flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-main-dark mb-6">
              Latest Blog Posts
            </h2>

            <LatestBlogPreview />

            <div className="mt-6">
              <a
                href="/blog"
                className="inline-flex items-center px-5 py-3 text-xs text-gray-800 bg-white rounded-lg cursor-pointer select-none
                active:translate-y-2 active:[box-shadow:0_0px_0_0_#d1d5db,0_0px_0_0_#d1d5db66]
                active:border-b-[1px]
                transition-all duration-150 [box-shadow:0_6px_0_0_#d1d5db,0_10px_0_0_#d1d5db66]
                border-[1px] border-gray-200"
              >
                <ArrowRightIcon className="w-5 h-5 mr-2" />
                VIEW ALL BLOGS
              </a>
            </div>
          </motion.div>
        </section>
      </div>
    </>
  )
}

const LatestBlogPreview: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    supabase
      .from('posts')
      .select('id, title, slug, content, created_at')
      .order('created_at', { ascending: false })
      .limit(3)
      .then(res => setPosts(res.data || []))
  }, [])

  return (
    <div className="grid gap-6 md:grid-cols-3 mt-6 text-left bg-white">
      {posts.map(post => (
        <Link
          to={`/blog/${post.slug}`}
          key={post.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow transition"
        >
          <h3 className="text-lg font-semibold text-main-dark mb-2">
            {post.title}
          </h3>
          <div
            className="text-sm text-gray-600 line-clamp-3 mb-2"
            dangerouslySetInnerHTML={{
              __html: post.content?.slice(0, 100) + '...',
            }}
          />
          <p className="text-xs text-gray-400">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </Link>
      ))}
    </div>
  )
}

export default Home
