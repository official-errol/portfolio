import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { LikeButton } from '../components/LikeButton'
import { CommentSection } from '../components/CommentSection'
import { SocialShare } from '../components/SocialShare'
import LoadingSpinner from '../components/LoadingSpinner'
import { Helmet } from 'react-helmet'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

interface Post {
  id: string
  title: string
  slug: string
  content: string
  author: string
  category: string
  tags: string[]
  media_url?: string
  media_type?: 'image' | 'video' | 'youtube'
  created_at: string
}

interface PostSearchResult {
  id: string
  title: string
  slug: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

const BlogPost: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])
  const [previousPost, setPreviousPost] = useState<Post | null>(null)
  const [nextPost, setNextPost] = useState<Post | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<PostSearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const { slug } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(res => setPost(res.data || null))
  }, [slug])

  useEffect(() => {
    if (post) {
      supabase
        .from('posts')
        .select('*')
        .neq('id', post.id)
        .eq('category', post.category)
        .limit(5)
        .then(res => setRelatedPosts(res.data || []));
  
      supabase
        .from('posts')
        .select('*')
        .gt('created_at', post.created_at)
        .order('created_at', { ascending: true })
        .limit(1)
        .then(res => setPreviousPost(res.data?.[0] || null));
  
      supabase
        .from('posts')
        .select('*')
        .lt('created_at', post.created_at)
        .order('created_at', { ascending: false })
        .limit(1)
        .then(res => setNextPost(res.data?.[0] || null));
    }
  }, [post]);

  useEffect(() => {
    const adElement = document.querySelector('ins.adsbygoogle') as any
    if (adElement && !adElement.getAttribute('data-adsbygoogle-status')) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (e) {
        console.error('Adsbygoogle push error', e)
      }
    }
  }, [post])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([])
      setShowResults(false)
      return
    }
  
    setShowResults(true)
  
    const delayDebounce = setTimeout(() => {
      supabase
        .from('posts')
        .select('id, title, slug')
        .ilike('title', `%${searchQuery}%`)
        .limit(5)
        .then(res => setSearchResults(res.data || []))
    }, 300)
  
    return () => clearTimeout(delayDebounce)
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
  
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleResultClick = (slug: string) => {
    setSearchQuery('')
    setSearchResults([])
    navigate(`/blog/${slug}`)
  }

  const renderMedia = () => {
    if (!post?.media_url || !post?.media_type) return null

    switch (post.media_type) {
      case 'image':
        return <img src={post.media_url} alt="Post Media" className="my-6 w-full max-w-2xl rounded" />
      case 'video':
        return <video src={post.media_url} controls className="my-6 w-full max-w-2xl rounded" />
      case 'youtube':
        const videoId = post.media_url.split('v=')[1]?.split('&')[0]
        return videoId ? (
          <iframe
            className="my-6 w-full max-w-2xl h-64"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube Video"
            allowFullScreen
          ></iframe>
        ) : null
      default:
        return null
    }
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <link rel="canonical" href={`https://www.errolsolomon.me/blog/${post.slug}`} />
      </Helmet>

      {/* Title and Search */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <Link to="/blog" className="text-2xl font-bold text-gray-900">
          Blogs
        </Link>
        <div ref={searchRef} className="relative w-full">
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-full w-full focus:border-main focus:outline-none"
          />
          {showResults && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-2xl">
              {searchResults.length > 0 ? (
                searchResults.map(result => (
                  <div
                    key={result.id}
                    onClick={() => handleResultClick(result.slug)}
                    className="px-4 py-4 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {result.title}
                  </div>
                ))
              ) : (
                <div className="px-4 py-4 text-sm text-gray-500">No results found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Blog Post Content */}
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto p-4 py-4 bg-white">
        <div className="w-full md:w-2/3 md:pr-4">
          <h1 className="text-4xl font-bold text-main-dark mb-2">{post.title}</h1>
          <p className="text-sm text-gray-500 mb-2">By {post.author} • {new Date(post.created_at).toLocaleDateString()}</p>
          <p className="text-sm text-gray-500 mb-4">{post.category}</p>

          {renderMedia()}

          <div dangerouslySetInnerHTML={{ __html: post.content }} className="prose max-w-none mt-4" />

          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map(t => (
              <span key={t} className="text-xs bg-gray-200 px-2 py-1 rounded-full">{t}</span>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2">
            <LikeButton postId={post.id} />
            <SocialShare title={post.title} url={window.location.href} />
          </div>

          {/* Pagination */}
          <div className="mt-10 flex justify-between items-center">
            <button
              disabled={!previousPost}
              onClick={() => previousPost && navigate(`/blog/${previousPost.slug}`)}
              className={`flex text-xs items-center gap-2 px-4 py-2 rounded-full ${previousPost ? 'bg-gray-200 hover:bg-gray-300 text-black' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              <ArrowLeftIcon className="w-4 h-4" />
              PREVIOUS
            </button>
            <button
              disabled={!nextPost}
              onClick={() => nextPost && navigate(`/blog/${nextPost.slug}`)}
              className={`flex text-xs items-center gap-2 px-4 py-2 rounded-full ${nextPost ? 'bg-gray-200 hover:bg-gray-300 text-black' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              NEXT
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>

          <CommentSection postId={post.id} />
        </div>

        {/* Sidebar */}
        <aside className="md:w-1/3 mt-8 md:mt-0 border-l border-gray-200 pl-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Related Posts</h3>
            {relatedPosts.length === 0 ? (
              <p className="text-sm text-gray-500">No related posts found.</p>
            ) : (
              <ul className="space-y-3">
                {relatedPosts.map(rp => (
                  <li key={rp.id}>
                    <a href={`/blog/${rp.slug}`} className="block text-sm font-medium text-main hover:underline">
                      {rp.title}
                    </a>
                    <p className="text-xs text-gray-500">{new Date(rp.created_at).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Sponsored</h3>
            <ins
              key={post.id}
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

export default BlogPost
