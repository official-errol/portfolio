import React, { useState, useEffect, ChangeEvent, DragEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import {
  ArrowLeftIcon,
  PlusIcon,
  PhotoIcon,
  VideoCameraIcon,
  PlayCircleIcon
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

const BlogEditor: React.FC<BlogEditorProps> = ({ editingPostId, onPostSelect, onClearEditing }) => {
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

  const handleFileUpload = async (file: File) => {
    const ext = file.name.split('.').pop()
    const filePath = `${Date.now()}.${ext}`

    const { data: uploadData, error } = await supabase.storage.from('media').upload(filePath, file)

    if (error || !uploadData?.path) {
      alert('Upload failed: ' + error?.message)
      return
    }

    const { publicUrl } = supabase.storage.from('media').getPublicUrl(uploadData.path).data
    if (!publicUrl) return

    setMediaUrl(publicUrl)

    if (file.type.startsWith('image')) setMediaType('image')
    else if (file.type.startsWith('video')) setMediaType('video')
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileUpload(file)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleMediaUrl = (url: string) => {
    setMediaUrl(url)
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      setMediaType('youtube')
    }
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
    <div className="flex flex-col bg-gray-50 text-gray-800 h-full">
      {editingPostId ? (
        <div className="flex-grow overflow-y-auto bg-white p-6 w-full">
          <button onClick={onClearEditing} className="flex items-center gap-2 mb-4 text-sm text-main hover:text-main-dark">
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </button>

          <h1 className="text-2xl font-bold mb-4 text-main-dark">{editingPostId === 'new' ? 'New Post' : 'Edit Post'}</h1>

          <div className="space-y-3 text-sm">
            <input title="Title" placeholder="Title" className="w-full p-2 border border-gray-300 rounded" value={title} onChange={e => setTitle(e.target.value)} />
            <input title="Author" placeholder="Author" className="w-full p-2 border border-gray-300 rounded" value={author} onChange={e => setAuthor(e.target.value)} />
            <input title="Category" placeholder="Category" className="w-full p-2 border border-gray-300 rounded" value={category} onChange={e => setCategory(e.target.value)} />
            <input title="Tags" placeholder="Tags (comma separated)" className="w-full p-2 border border-gray-300 rounded" value={tags} onChange={e => setTags(e.target.value)} />
            <textarea title="Content" placeholder="Content" className="w-full p-3 border border-gray-300 rounded min-h-[160px]" value={content} onChange={e => setContent(e.target.value)} />

            {/* Drag & Drop Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border border-dashed border-gray-400 rounded p-4 text-center text-gray-500 bg-gray-50"
            >
              Drag & drop image or video here
              <input type="file" accept="image/*,video/*" onChange={e => e.target.files && handleFileUpload(e.target.files[0])} className="mt-2" />
            </div>

            {/* YouTube Link */}
            <input
              title="YouTube URL"
              placeholder="YouTube URL (optional)"
              className="w-full p-2 border border-gray-300 rounded"
              value={mediaUrl}
              onChange={e => handleMediaUrl(e.target.value)}
            />

            {/* Media Type Display */}
            {mediaType && mediaUrl && (
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                {mediaType === 'image' && <PhotoIcon className="h-4 w-4 text-main-dark" />}
                {mediaType === 'video' && <VideoCameraIcon className="h-4 w-4 text-main-dark" />}
                {mediaType === 'youtube' && <PlayCircleIcon className="h-4 w-4 text-main-dark" />}
                <span className="capitalize">{mediaType}</span>
              </div>
            )}

            {/* Media Preview */}
            {mediaType === 'image' && mediaUrl && (
              <img src={mediaUrl} alt="Uploaded" className="w-full max-w-xs rounded border mt-2" />
            )}
            {mediaType === 'video' && mediaUrl && (
              <video src={mediaUrl} controls className="w-full max-w-xs rounded border mt-2" />
            )}
            {mediaType === 'youtube' && mediaUrl && (
              <iframe
                className="w-full max-w-xs h-48 rounded border mt-2"
                src={`https://www.youtube.com/embed/${mediaUrl.split('v=')[1]}`}
                title="YouTube video"
                allowFullScreen
              ></iframe>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <button onClick={savePost} disabled={saving} className="px-4 py-2 bg-main text-white text-sm rounded hover:bg-main-dark">
                {saving ? 'Saving...' : editingPostId === 'new' ? 'Save Post' : 'Update Post'}
              </button>
              <button onClick={clearForm} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300">
                Clear
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto bg-white p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-main-dark">Blog Posts</h1>
            <button onClick={() => onPostSelect('new')} className="px-4 py-2 text-sm bg-main text-white rounded hover:bg-main-dark flex items-center gap-1">
              <PlusIcon className="h-4 w-4" />
              New
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map(post => (
              <div key={post.id} onClick={() => onPostSelect(post.id)} className="cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-main transition-colors text-sm">
                <p className="font-semibold">{post.title}</p>
                <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                      {tag}
                    </span>
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
