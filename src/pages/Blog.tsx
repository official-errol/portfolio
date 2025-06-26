import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface Post {
  id: string
  title: string
  slug: string
  content: string
  created_at: string
  media_url?: string
  media_type?: 'image' | 'video' | 'youtube'
}

const POSTS_PER_PAGE = 10

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [filtered, setFiltered] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase
      .from('posts')
      .select('id, title, slug, content, created_at, media_url, media_type')
      .order('created_at', { ascending: false })
      .then(res => {
        const data = res.data || []
        setPosts(data)
        setFiltered(data)
      })
  }, [])

  useEffect(() => {
    const adElement = document.querySelector('ins.adsbygoogle') as any
    if (adElement && !adElement.getAttribute('data-adsbygoogle-status')) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (e) {
        console.error('Adsbygoogle push error', e)
      }
    }
  }, [])

  const applySearch = (q: string) => {
    setSearch(q)
    const low = q.toLowerCase()
    setFiltered(posts.filter(p => p.title.toLowerCase().includes(low)))
    setPage(1)
  }

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE)
  const pagePosts = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)

  return (
    <>
      <Helmet>
        <title>Blogs | Errol Solomon</title>
        <link rel="canonical" href="https://www.errolsolomon.me/blog" />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Title and Search in one row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-main-dark">Blogs</h1>
          <div className="relative w-full md:w-96">
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={e => applySearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:border-main focus:outline-none"
            />
          </div>
        </div>
      
        {/* Main content and sidebar below */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Section */}
          <div className="md:w-2/3 space-y-6">
            {/* Post List */}
            <ul className="space-y-6">
              {pagePosts.map(post => (
                <li key={post.id}>
                  <Link to={`/blog/${post.slug}`} className="flex items-center gap-4 border border-gray-200 rounded-lg overflow-hidden hover:bg-gray-50 transition">
                    <div className="py-3 px-4 flex-1">
                      <h2 className="text-xl font-semibold text-main-dark">{post.title}</h2>
                      <p className="text-sm text-gray-500 mt-1">{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                  </Link>
                </li>
              ))}
              {pagePosts.length === 0 && <p className="text-center text-gray-500">No posts found.</p>}
            </ul>
      
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className={`px-3 py-1 rounded-lg ${page === 1 ? 'bg-gray-200' : 'bg-main text-white hover:bg-main-dark'}`}
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <span className="text-gray-700">Page {page} of {totalPages}</span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className={`px-3 py-1 rounded-lg ${page === totalPages ? 'bg-gray-200' : 'bg-main text-white hover:bg-main-dark'}`}
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
      
          {/* Sidebar with Google Ads */}
          <aside className="md:w-1/3 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-main-dark mb-2">Sponsored</h3>
              <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-4551987474608561"
                data-ad-slot="3193255453"
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

export default Blog
