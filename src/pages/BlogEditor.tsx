import React, { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import { supabase } from '../services/supabaseClient'
import { useNavigate } from 'react-router-dom'

interface Post {
  id: string
  title: string
  slug: string
  content: string
  author: string
  category: string
  tags: string[]
  created_at: string
}

const BlogEditor: React.FC = () => {
  const navigate = useNavigate()

  const [posts, setPosts] = useState<Post[]>([])
  const [editingPost, setEditingPost] = useState<Post | null>(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('isAdminAuthenticated') !== 'true') {
      navigate('/')
    } else {
      fetchPosts()
    }
  }, [])

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setPosts(data)
    if (error) console.error(error.message)
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Image,
      Youtube,
      Placeholder.configure({
        placeholder: 'Write your blog content here...',
      }),
    ],
    content: '',
  })

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  const loadPostForEditing = (post: Post) => {
    setEditingPost(post)
    setTitle(post.title)
    setAuthor(post.author)
    setCategory(post.category)
    setTags(post.tags.join(', '))
    editor?.commands.setContent(post.content)
  }

  const savePost = async () => {
    if (!editor) return
    setSaving(true)

    const tagArr = tags.split(',').map(t => t.trim()).filter(Boolean)
    const slug = slugify(title)

    if (editingPost) {
      // Update
      const { error } = await supabase
        .from('posts')
        .update({
          title,
          slug,
          content: editor.getHTML(),
          category,
          tags: tagArr,
          author,
        })
        .eq('id', editingPost.id)

      if (error) alert('Update error: ' + error.message)
      else alert('Post updated!')
    } else {
      // Insert new
      const { error } = await supabase.from('posts').insert([
        {
          title,
          slug,
          content: editor.getHTML(),
          category,
          tags: tagArr,
          author,
        },
      ])
      if (error) alert('Insert error: ' + error.message)
      else alert('Post created!')
    }

    setSaving(false)
    fetchPosts()
    clearForm()
  }

  const clearForm = () => {
    setTitle('')
    setAuthor('')
    setCategory('')
    setTags('')
    editor?.commands.clearContent()
    setEditingPost(null)
  }

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-[280px] flex-shrink-0 bg-white border-r border-gray-200 p-4">
        <h2 className="text-lg font-bold mb-4">Your Posts</h2>
        <ul className="space-y-2">
          {posts.map(post => (
            <li
              key={post.id}
              onClick={() => loadPostForEditing(post)}
              className="cursor-pointer px-3 py-2 rounded hover:bg-gray-100 border border-gray-200"
            >
              <p className="font-medium">{post.title}</p>
              <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </aside>

      {/* Editor Form */}
      <main className="flex-grow p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-main-dark">
          {editingPost ? 'Edit Blog Post' : 'Create Blog Post'}
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 border border-gray-300 rounded"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Author"
            className="w-full p-2 border border-gray-300 rounded"
            value={author}
            onChange={e => setAuthor(e.target.value)}
          />
          <input
            type="text"
            placeholder="Category"
            className="w-full p-2 border border-gray-300 rounded"
            value={category}
            onChange={e => setCategory(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            className="w-full p-2 border border-gray-300 rounded"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />

          <div className="border border-gray-300 rounded bg-white min-h-[400px]">
            {editor ? (
              <EditorContent
                editor={editor}
                className="prose max-w-none p-4 min-h-[400px] outline-none"
              />
            ) : (
              <p className="p-4 text-gray-500">Loading editor...</p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={savePost}
              disabled={saving}
              className="px-6 py-2 bg-main text-white rounded hover:bg-main-dark"
            >
              {saving ? 'Saving...' : editingPost ? 'Update Post' : 'Save Post'}
            </button>
            <button
              onClick={clearForm}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default BlogEditor
