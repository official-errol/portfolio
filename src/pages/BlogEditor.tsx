import React, { useState, useEffect, useRef } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import {
  ArrowLeftIcon,
  PlusIcon,
  PhotoIcon,
  PlayCircleIcon,
  TrashIcon,
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
  media_type?: 'image' | 'youtube' | 'video'
  created_at: string
}

interface BlogEditorProps {
  editingPostId: string | null
  onPostSelect: (postId: string) => void
  onClearEditing: () => void
}

const BlogEditor: React.FC<BlogEditorProps> = ({
  editingPostId,
  onPostSelect,
  onClearEditing,
}) => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [content, setContent] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaType, setMediaType] = useState<'image' | 'youtube' | 'video' | ''>('')
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (localStorage.getItem('isAdminAuthenticated') !== 'true') {
      navigate('/')
    } else {
      fetchPosts()
    }
  }, [])

  useEffect(() => {
    if (editingPostId && editingPostId !== 'new') {
      const post = posts.find(p => p.id === editingPostId)
      if (post) loadPost(post)
    } else if (editingPostId === 'new') {
      clearForm()
    }
  }, [editingPostId, posts])

  const fetchPosts = async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
    if (data) setPosts(data)
  }

  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const loadPost = (post: Post) => {
    setTitle(post.title)
    setAuthor(post.author)
    setCategory(post.category)
    setTags(post.tags.join(', '))
    setContent(post.content)
    setMediaUrl(post.media_url || '')
    setMediaType(post.media_type || '')
  }

  const clearForm = () => {
    setTitle('')
    setAuthor('')
    setCategory('')
    setTags('')
    setContent('')
    setMediaUrl('')
    setMediaType('')
  }

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement> | DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = (e as ChangeEvent<HTMLInputElement>).target?.files?.[0] ||
      (e as DragEvent<HTMLDivElement>).dataTransfer?.files?.[0]
    if (!file) return

    const ext = file.name.split('.').pop()
    const filePath = `${Date.now()}.${ext}`

    const { data: uploadData, error } = await supabase.storage
      .from('media')
      .upload(filePath, file)

    if (error || !uploadData?.path) return alert('Upload failed: ' + error?.message)

    const { publicUrl } = supabase.storage.from('media').getPublicUrl(uploadData.path).data
    setMediaUrl(publicUrl)

    if (file.type.startsWith('image')) setMediaType('image')
    else if (file.type.startsWith('video')) setMediaType('video')
  }

  const handleMediaUrl = (url: string) => {
    setMediaUrl(url)
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      setMediaType('youtube')
    }
  }

  const getYoutubeEmbedId = (url: string) => {
    const match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)
    return match ? match[1] : ''
  }

  const removeMedia = () => {
    setMediaUrl('')
    setMediaType('')
  }

  const savePost = async () => {
    setSaving(true)
    const slug = slugify(title)
    const tagArr = tags.split(',').map(t => t.trim()).filter(Boolean)

    const newPost = {
      title,
      slug,
      content,
      author,
      category,
      tags: tagArr,
      media_url: mediaUrl,
      media_type: mediaType,
    }

    if (editingPostId && editingPostId !== 'new') {
      await supabase.from('posts').update(newPost).eq('id', editingPostId)
    } else {
      await supabase.from('posts').insert([newPost])
    }

    setSaving(false)
    clearForm()
    fetchPosts()
    onClearEditing()
  }

  return (
    <div className="flex flex-col bg-gray-100 text-gray-800 h-full">
      {editingPostId ? (
        <div className="flex-grow overflow-y-auto bg-white p-6">
          <button onClick={onClearEditing} className="flex items-center gap-2 mb-4 text-main hover:text-main-dark text-sm">
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </button>

          <h1 className="text-2xl font-bold mb-4 text-main-dark">{editingPostId === 'new' ? 'Create Post' : 'Edit Post'}</h1>

          <div className="space-y-3 text-sm">
            <input title="Title" placeholder="Title" className="w-full p-2 border border-gray-200 rounded" value={title} onChange={e => setTitle(e.target.value)} />
            <input title="Author" placeholder="Author" className="w-full p-2 border border-gray-200 rounded" value={author} onChange={e => setAuthor(e.target.value)} />
            <input title="Category" placeholder="Category" className="w-full p-2 border border-gray-200 rounded" value={category} onChange={e => setCategory(e.target.value)} />
            <input title="Tags" placeholder="Tags (comma separated)" className="w-full p-2 border border-gray-200 rounded" value={tags} onChange={e => setTags(e.target.value)} />
            <textarea title="Content" placeholder="Write your blog here..." className="w-full p-3 border border-gray-200 rounded min-h-[150px]" value={content} onChange={e => setContent(e.target.value)} />

            <div
              onDrop={handleFileUpload}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="w-full border border-dashed border-gray-200 p-4 text-center rounded cursor-pointer bg-gray-50"
            >
              <p className="text-sm flex justify-center items-center gap-2 text-gray-700">
                <PhotoIcon className="w-4 h-4" />
                Drag & Drop or Click to Upload Image/Video
              </p>
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
            </div>

            <div className="text-center text-sm text-gray-500 mt-2 mb-2">— or —</div>

            <div className="relative">
              <PlayCircleIcon className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
              <input
                title="YouTube Link"
                type="text"
                placeholder="YouTube link (https://...)"
                className="w-full pl-8 p-2 border border-gray-200 rounded"
                value={mediaType === 'youtube' ? mediaUrl : ''}
                onChange={(e) => handleMediaUrl(e.target.value)}
              />
            </div>

            {/* Media Preview + Delete */}
            <div className="relative w-full max-w-sm mt-2">
              {mediaType === 'image' && <img src={mediaUrl} alt="Uploaded" className="rounded border border-gray-200" />}
              {mediaType === 'video' && <video src={mediaUrl} controls className="rounded border border-gray-200" />}
              {mediaType === 'youtube' && (
                <iframe
                  className="w-full h-56 border rounded"
                  src={`https://www.youtube.com/embed/${getYoutubeEmbedId(mediaUrl)}`}
                  title="YouTube video"
                  allowFullScreen
                ></iframe>
              )}
              {mediaUrl && (
                <button
                  onClick={removeMedia}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                  title="Remove media"
                >
                  <TrashIcon className="h-4 w-4 text-red-500" />
                </button>
              )}
            </div>

            <div className="flex gap-4 mt-4">
              <button onClick={savePost} disabled={saving} className="px-5 py-2 bg-main text-white rounded hover:bg-main-dark text-sm">
                {saving ? 'Saving...' : editingPostId === 'new' ? 'Save' : 'Update'}
              </button>
              <button onClick={clearForm} className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm">
                Clear
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto bg-white p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-main-dark">Blog Posts</h1>
            <button onClick={() => onPostSelect('new')} className="px-4 py-2 bg-main text-white rounded hover:bg-main-dark flex items-center gap-2 text-sm">
              <PlusIcon className="h-5 w-5" />
              New Post
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map(post => (
              <div key={post.id} onClick={() => onPostSelect(post.id)} className="cursor-pointer p-3 rounded border border-gray-200 text-sm">
                <p className="font-medium text-base">{post.title}</p>
                <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogEditor
