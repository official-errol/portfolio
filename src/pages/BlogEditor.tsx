import React, { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import { supabase } from '../services/supabaseClient'
import { useNavigate } from 'react-router-dom'

const BlogEditor: React.FC = () => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('isAdminAuthenticated') !== 'true') {
      navigate('/')
    }
  }, [])

  const editor = useEditor({
    extensions: [StarterKit, Link, Image, Youtube],
    content: '<p>Start writing your blog...</p>',
  })
  const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // replace spaces/symbols with hyphens
    .replace(/(^-|-$)/g, '')     // remove leading/trailing hyphens

  const slug = slugify(title)

  const savePost = async () => {
    if (!editor) return
    setSaving(true)

    const tagArr = tags.split(',').map(t => t.trim()).filter(Boolean)

    const { error } = await supabase.from('posts').insert([
      {
        title,
        slug,
        content: editor.getHTML(),
        category,
        tags: tagArr,
        author: 'Admin',
      },
    ])

    setSaving(false)
    if (error) alert('Error: ' + error.message)
    else {
      alert('Saved!')
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold mb-4 text-main-dark">Blog Editor</h1>
      <input
        type="text"
        placeholder="Title"
        className="w-full mb-3 p-2 border border-gray-300 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        className="w-full mb-3 p-2 border border-gray-300 rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tags (comma-separated)"
        className="w-full mb-3 p-2 border border-gray-300 rounded"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <div className="border border-gray-300 rounded p-2 mb-4 min-h-[200px]">
        <EditorContent editor={editor} />
      </div>

      <button
        onClick={savePost}
        disabled={saving}
        className="px-5 py-2 bg-main text-white rounded hover:bg-main-dark"
      >
        {saving ? 'Saving...' : 'Save Post'}
      </button>
    </div>
  )
}

export default BlogEditor
