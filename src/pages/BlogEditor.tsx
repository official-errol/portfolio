import React, { useEffect, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import {
  ArrowLeftIcon,
  PlusIcon,
  PhotoIcon,
  FilmIcon,
  LinkIcon,
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

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const ext = file.name.split('.').pop()
    const filePath = `${Date.now()}.${ext}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file)

    if (uploadError || !uploadData?.path) {
      alert('Upload failed: ' + uploadError?.message)
      return
    }

    const { publicUrl } = supabase
      .storage
      .from('media')
      .getPublicUrl(uploadData.path).data

    if (!publicUrl) {
      alert('Failed to get public URL')
      return
    }

    setMediaUrl(publicUrl)
    if (file.type.startsWith('image')) setMediaType('image')
    else if (file.type.startsWith('video')) setMediaType('video')
  }

  const handleDragDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const ext = file.name.split('.').pop()
      const filePath = `${Date.now()}.${ext}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file)

      if (uploadError || !uploadData?.path) {
        alert('Upload failed: ' + uploadError?.message)
        return
      }

      const { publicUrl } = supabase
        .storage
        .from('media')
        .getPublicUrl(uploadData.path).data

      if (file.type.startsWith('image')) setMediaType('image')
      else if (file.type.startsWith('video')) setMediaType('video')
      setMediaUrl(publicUrl)
    }
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
    <div className="flex flex-col bg-gray-100 text-gray-800 h-full">
      {editingPostId ? (
        <div className="flex-grow overflow-y-auto bg-white p-6 w-full">
          <button onClick={onClearEditing} className="flex items-center gap-2 mb-6 text-main hover:text-main-dark">
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </button>

          <h1 className="text-2xl font-bold mb-6 text-main-dark">
            {editingPostId === 'new' ? 'Create Post' : 'Edit Post'}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <input
                  type="text"
                  placeholder="Post title"
                  className="w-full p-2 border rounded"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Author</label>
                <input
                  type="text"
                  placeholder="Author name"
                  className="w-full p-2 border rounded"
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <input
                  type="text"
                  placeholder="Category"
                  className="w-full p-2 border rounded"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="tag1, tag2"
                  className="w-full p-2 border rounded"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium flex items-center gap-1">
                  <PhotoIcon className="w-4 h-4" /> Upload Image/Video
                </label>
                <input type="file" accept="image/*,video/*" onChange={handleFileUpload} />
              </div>

              <div
                onDrop={handleDragDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border border-dashed rounded p-4 text-center text-sm bg-gray-50"
              >
                <div className="flex justify-center mb-2 text-gray-600">
                  <FilmIcon className="w-5 h-5 mr-1" />
                  Drag and drop file here
                </div>
              </div>

              <div>
                <label className="text-sm font-medium flex items-center gap-1">
                  <LinkIcon className="w-4 h-4" /> YouTube Link
                </label>
                <input
                  type="text"
                  placeholder="https://youtube.com/..."
                  className="w-full p-2 border rounded"
                  value={mediaUrl}
                  onChange={e => handleMediaUrl(e.target.value)}
                />
              </div>

              {mediaType === 'image' && mediaUrl && (
                <img src={mediaUrl} alt="preview" className="rounded border max-w-full" />
              )}
              {mediaType === 'video' && mediaUrl && (
                <video src={mediaUrl} controls className="rounded border max-w-full" />
              )}
              {mediaType === 'youtube' && (
                <iframe
                  src={`https://www.youtube.com/embed/${mediaUrl.split('v=')[1]}`}
                  className="w-full h-64 border rounded"
                  allowFullScreen
                  title="YouTube"
                ></iframe>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2">Content</label>
              <textarea
                placeholder="Write your blog content here..."
                className="flex-grow p-4 border rounded min-h-[400px]"
                value={content}
                onChange={e => setContent(e.target.value)}
              />
              <div className="mt-4 flex gap-4">
                <button
                  onClick={savePost}
                  disabled={saving}
                  className="bg-main text-white px-6 py-2 rounded hover:bg-main-dark"
                >
                  {saving ? 'Saving...' : 'Save Post'}
                </button>
                <button
                  onClick={clearForm}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto bg-white p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-main-dark">Blog Posts</h1>
            <button
              onClick={() => onPostSelect('new')}
              className="px-4 py-2 bg-main text-white rounded hover:bg-main-dark flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              New Post
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map(post => (
              <div
                key={post.id}
                onClick={() => onPostSelect(post.id)}
                className="cursor-pointer p-4 border rounded hover:border-main transition"
              >
                <p className="font-semibold text-lg">{post.title}</p>
                <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                    >
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
