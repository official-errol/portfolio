import React, { useEffect, useState, useRef } from 'react'
import { supabase } from '../services/supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

interface Post {
  id: string
  title: string
  slug: string
  content: string
  created_at: string
  media_url?: string
  media_type?: 'image' | 'video' | 'youtube'
  category?: string
}

interface SearchResult {
  id: string
  title: string
  slug: string
}

const POSTS_PER_PAGE = 10

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [filtered, setFiltered] = useState<Post[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [page, setPage] = useState(1)

  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const resultBoxRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('id, title, slug, content, created_at, media_url, media_type, category')
        .order('created_at', { ascending: false })

      const all = data || []
      setPosts(all)
      setFiltered(all)

      const cats = Array.from(new Set(all.map(p => p.category).filter(Boolean)))
      setCategories(cats)
    }

    fetchPosts()
  }, [])

  useEffect(() => {
    if (search.trim() === '') {
      setSearchResults([])
      return
    }

    const delay = setTimeout(() => {
      supabase
        .from('posts')
        .select('id, title, slug')
        .ilike('title', `%${search}%`)
        .limit(5)
        .then(res => setSearchResults(res.data || []))
    }, 300)

    return () => clearTimeout(delay)
  }, [search])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        resultBoxRef.current &&
        !resultBoxRef.current.contains(e.target as Node)
      ) {
        setSearchResults([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    applyCategoryFilter()
  }, [selectedCategory, posts])

  const applyCategoryFilter = () => {
    const filteredByCategory = selectedCategory
      ? posts.filter(p => p.category === selectedCategory)
      : posts

    setFiltered(filteredByCategory)
    setPage(1)
  }

  const handleResultClick = (slug: string) => {
    setSearch('')
    setSearchResults([])
    navigate(`/blog/${slug}`)
  }

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE)
  const pagePosts = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)

  return (
    <>
      <Helmet>
        <link rel="canonical" href="https://www.errolsolomon.me/blog" />
      </Helmet>

      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 md:items-center gap-4 relative">
        <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>

        <div className="relative w-full" ref={resultBoxRef}>
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:border-main focus:outline-none"
          />
          {search.trim() !== '' && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-2xl">
              {searchResults.length > 0 ? (
                searchResults.map(result => (
                  <div
                    key={result.id}
                    onClick={() => handleResultClick(result.slug)}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {result.title}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No posts matched your search.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Category Filters */}
      {categories.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 pb-2 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-full text-sm border ${selectedCategory === null ? 'bg-main text-main-dark' : 'border-gray-200 text-gray-600'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm border ${selectedCategory === cat ? 'bg-main text-main-dark' : 'border-gray-200 text-gray-600'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row gap-8">
        {/* Post List */}
        <div className="md:w-2/3 space-y-6">
          <ul className="space-y-6">
            {pagePosts.map(post => (
              <li key={post.id}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="flex items-center gap-4 border border-gray-200 rounded-2xl overflow-hidden hover:bg-gray-50 transition"
                >
                  <div className="py-3 px-4 flex-1">
                    <h2 className="text-xl font-semibold text-main-dark">{post.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{new Date(post.created_at).toLocaleDateString()}</p>
                    {post.category && (
                      <span className="inline-block text-xs text-gray-400 mt-1">{post.category}</span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
            {pagePosts.length === 0 && (
              <p className="text-center text-gray-500">No posts found.</p>
            )}
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

        {/* Sidebar */}
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
    </>
  )
}

export default Blog
