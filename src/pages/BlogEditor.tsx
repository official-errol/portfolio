// src/pages/BlogEditor.tsx
import React, { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { PostgrestError } from '@supabase/supabase-js'

interface Post {
  id: string
  title: string
  slug: string
  content: string
  author: string
  category: string
  tags: string[]
  media_url?: string
  media_type?: string
  created_at: string
}

interface Props {
  editingPostId: string | null
  onPostSelect: (postId: string) => void
  onClearEditing: () => void
}

const BlogEditor: React.FC<Props> = ({ editingPostId, onPostSelect, onClearEditing }) => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [content, setContent] = useState('')
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (localStorage.getItem('isAdminAuthenticated') !== 'true') navigate('/')
    fetchPosts()
  }, [])

  useEffect(() => {
    if (editingPostId && editingPostId !== 'new') {
      const p = posts.find(x => x.id === editingPostId)!
      setTitle(p.title)
      setAuthor(p.author)
      setCategory(p.category)
      setTags(p.tags.join(', '))
      setContent(p.content)
      setMediaPreview(p.media_url ?? '')
    } else {
      resetForm()
    }
  }, [editingPostId, posts])

  async function fetchPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
    if (data) setPosts(data)
  }

  function resetForm() {
    setTitle(''); setAuthor(''); setCategory(''); setTags('')
    setContent(''); setMediaFile(null); setMediaPreview('')
  }

  function slugify(t: string) {
    return t.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
  }

  const onFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    setMediaFile(file)
    setMediaPreview(URL.createObjectURL(file))
  }

  const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setMediaFile(file)
    setMediaPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!title.trim()) return alert('Title is required')
    setSaving(true)
    let media_url='', media_type=''
    if (mediaFile) {
      const name = `${Date.now()}_${mediaFile.name}`
      const { error: upErr } = await supabase.storage
        .from('media')
        .upload(name, mediaFile)
      if (upErr) return alert(upErr.message)
      const { data } = supabase.storage.from('media').getPublicUrl(name)
      media_url = data.publicUrl
      media_type = mediaFile.type.startsWith('video/') ? 'video' : 'image'
    } else if (mediaPreview.includes('youtu')) {
      media_url = mediaPreview
      media_type = 'youtube'
    }

    const payload = {
      title, slug: slugify(title), author,
      content, category,
      tags: tags.split(',').map(x=>x.trim()).filter(Boolean),
      media_url, media_type
    }

    let err: PostgrestError | null = null
    if (editingPostId && editingPostId !== 'new') {
      const { error } = await supabase.from('posts').update(payload).eq('id', editingPostId)
      err = error
    } else {
      const { error } = await supabase.from('posts').insert([payload])
      err = error
    }

    setSaving(false)
    if(err) return alert(err.message)
    resetForm()
    onClearEditing()
    fetchPosts()
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-8 flex items-center justify-between border-b">
        <div>
          <h2 className="text-xl font-bold">
            {editingPostId === 'new' ? 'New Post' : 'Edit Post'}
          </h2>
        </div>
        <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => onPostSelect('new')}>
          + New
        </button>
      </div>

      <div className="flex flex-col md:flex-row flex-grow overflow-auto">
        {/* List */}
        <div className="w-full md:w-1/3 p-4 overflow-auto">
          {posts.map(p => (
            <div
              key={p.id}
              onClick={() => onPostSelect(p.id)}
              className={`p-3 mb-2 border rounded cursor-pointer ${
                p.id === editingPostId ? 'bg-gray-200 border-main-dark' : 'border-gray-300'
              }`}
            >
              <h3 className="font-medium">{p.title}</h3>
              <p className="text-xs text-gray-500">
                {new Date(p.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="flex-grow p-6 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input value={title} onChange={e=>setTitle(e.target.value)}
              className="p-2 border border-gray-300 rounded" placeholder="Title" />
            <input value={author} onChange={e=>setAuthor(e.target.value)}
              className="p-2 border border-gray-300 rounded" placeholder="Author" />
            <input value={category} onChange={e=>setCategory(e.target.value)}
              className="p-2 border border-gray-300 rounded" placeholder="Category" />
            <input value={tags} onChange={e=>setTags(e.target.value)}
              className="p-2 border border-gray-300 rounded" placeholder="Tags (comma)" />
          </div>

          <textarea
            value={content}
            onChange={e=>setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded h-48 mb-4 resize-y"
            placeholder="Write your content…"
          />

          <div
            ref={dropRef}
            onDrop={onFileDrop}
            onDragOver={e => e.preventDefault()}
            className="border-dashed border-2 border-gray-300 p-4 rounded mb-4 text-center"
          >
            {mediaPreview ? (
              mediaPreview.includes('youtu') ? (
                <iframe
                  width="100%" height="200"
                  src={mediaPreview.replace('watch?v=', 'embed/')}
                  frameBorder="0"
                  allowFullScreen
                />
              ) : (
                <img src={mediaPreview} className="max-h-40 mx-auto" />
              )
            ) : (
              <div>
                <p>Drag-&-drop image/video, or paste YouTube link</p>
                <label className="cursor-pointer text-blue-600">
                  <input type="file" accept="image/*,video/*" className="hidden" onChange={onFileSelect}/>
                  Select file
                </label>
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-main text-white rounded"
          >
            {saving ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BlogEditor
