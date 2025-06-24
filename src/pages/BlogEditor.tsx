import React, { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline'

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

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
  
    const ext = file.name.split('.').pop()
    const filePath = `${Date.now()}.${ext}`
  
    // Upload the file to the "media" bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file)
  
    if (uploadError || !uploadData?.path) {
      alert('Upload failed: ' + uploadError?.message)
      return
    }
  
    // Get the public URL
    const { data: publicData, error: publicUrlError } = supabase
      .storage
      .from('media')
      .getPublicUrl(uploadData.path)
  
    if (publicUrlError || !publicData?.publicUrl) {
      alert('Failed to get public URL')
      return
    }
  
    setMediaUrl(publicData.publicUrl)
  
    if (file.type.startsWith('image')) setMediaType('image')
    else if (file.type.startsWith('video')) setMediaType('video')
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
        <div className="flex-grow overflow-y-auto bg-white p-8 w-full">
          <button onClick={onClearEditing} className="flex items-center gap-2 mb-6 text-main hover:text-main-dark">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to posts
          </button>

          <h1 className="text-3xl font-bold mb-4 text-main-dark">{editingPostId === 'new' ? 'Create Post' : 'Edit Post'}</h1>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Title" className="w-full p-2 border border-gray-300 rounded" value={title} onChange={e => setTitle(e.target.value)} />
              <input type="text" placeholder="Author" className="w-full p-2 border border-gray-300 rounded" value={author} onChange={e => setAuthor(e.target.value)} />
              <input type="text" placeholder="Category" className="w-full p-2 border border-gray-300 rounded" value={category} onChange={e => setCategory(e.target.value)} />
              <input type="text" placeholder="Tags (comma-separated)" className="w-full p-2 border border-gray-300 rounded" value={tags} onChange={e => setTags(e.target.value)} />
            </div>

            <textarea placeholder="Write your blog here..." className="w-full p-4 border border-gray-300 rounded min-h-[200px]" value={content} onChange={e => setContent(e.target.value)} />

            {/* Media Upload & Preview */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload Image/Video</label>
              <input type="file" accept="image/*,video/*" onChange={handleFileUpload} />

              <label className="block text-sm font-medium text-gray-700">or Paste YouTube Link</label>
              <input type="text" placeholder="https://youtube.com/..." className="w-full p-2 border border-gray-300 rounded" value={mediaUrl} onChange={e => handleMediaUrl(e.target.value)} />

              {mediaType === 'image' && mediaUrl && <img src={mediaUrl} alt="Uploaded" className="w-full max-w-md rounded border" />}
              {mediaType === 'video' && mediaUrl && <video src={mediaUrl} controls className="w-full max-w-md rounded border" />}
              {mediaType === 'youtube' && mediaUrl && (
                <iframe
                  className="w-full max-w-md h-64 border rounded"
                  src={`https://www.youtube.com/embed/${mediaUrl.split('v=')[1]}`}
                  title="YouTube video"
                  allowFullScreen
                ></iframe>
              )}
            </div>

            <div className="flex gap-4">
              <button onClick={savePost} disabled={saving} className="px-6 py-2 bg-main text-white rounded hover:bg-main-dark">
                {saving ? 'Saving...' : editingPostId === 'new' ? 'Save Post' : 'Update Post'}
              </button>
              <button onClick={clearForm} className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                Clear
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto bg-white p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-main-dark">Blog Posts</h1>
            <button onClick={() => onPostSelect('new')} className="px-4 py-2 bg-main text-white rounded hover:bg-main-dark flex items-center gap-2">
              <PlusIcon className="h-5 w-5" />
              New Post
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map(post => (
              <div key={post.id} onClick={() => onPostSelect(post.id)} className="cursor-pointer p-4 rounded-lg border border-gray-200 hover:border-main transition-colors">
                <p className="font-medium text-lg">{post.title}</p>
                <div className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
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
