import React, { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import OrderedList from '@tiptap/extension-ordered-list'
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'

import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  PhotoIcon,
  ArrowTopRightOnSquareIcon,
  Bars3BottomLeftIcon,
  Bars3BottomRightIcon,
  Bars3Icon,
  Bars4Icon, // for ordered list alternative
} from '@heroicons/react/24/outline'

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
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setPosts(data)
  }

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your blog...',
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      Link,
      Image,
      Youtube,
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: '',
  })

  const toolbarButton = (icon: React.ReactNode, command: () => void, isActive: boolean) => (
    <button
      type="button"
      onClick={command}
      className={`p-2 rounded hover:bg-gray-200 ${
        isActive ? 'bg-main text-white' : 'text-gray-800'
      }`}
    >
      {icon}
    </button>
  )

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
      await supabase
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
    } else {
      await supabase.from('posts').insert([
        {
          title,
          slug,
          content: editor.getHTML(),
          category,
          tags: tagArr,
          author,
        },
      ])
    }

    setSaving(false)
    clearForm()
    fetchPosts()
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
      <aside className="w-[280px] flex-shrink-0 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Your Posts</h2>
        <ul className="space-y-2">
          {posts.map(post => (
            <li
              key={post.id}
              onClick={() => loadPostForEditing(post)}
              className="cursor-pointer px-3 py-2 rounded hover:bg-gray-100 border border-gray-200"
            >
              <p className="font-medium">{post.title}</p>
              <p className="text-xs text-gray-500">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      </aside>

      {/* Editor */}
      <main className="flex-grow p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-4 text-main-dark">
          {editingPost ? 'Edit Blog Post' : 'Create Blog Post'}
        </h1>

        <div className="space-y-4">
          {/* Inputs */}
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

          {/* Toolbar */}
          <div className="flex flex-wrap gap-2 bg-white p-3 border border-gray-200 rounded">
            {editor && (
              <>
                {toolbarButton(<BoldIcon className="h-5 w-5" />, () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}
                {toolbarButton(<ItalicIcon className="h-5 w-5" />, () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}
                {toolbarButton(<UnderlineIcon className="h-5 w-5" />, () => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'))}
                {toolbarButton(<ListBulletIcon className="h-5 w-5" />, () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'))}
                {toolbarButton(<Bars4Icon className="h-5 w-5" />, () => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'))}
                {toolbarButton(<Bars3BottomLeftIcon className="h-5 w-5" />, () => editor.chain().focus().setTextAlign('left').run(), editor.isActive({ textAlign: 'left' }))}
                {toolbarButton(<Bars3Icon className="h-5 w-5" />, () => editor.chain().focus().setTextAlign('center').run(), editor.isActive({ textAlign: 'center' }))}
                {toolbarButton(<Bars3BottomRightIcon className="h-5 w-5" />, () => editor.chain().focus().setTextAlign('right').run(), editor.isActive({ textAlign: 'right' }))}
                {toolbarButton(<ArrowTopRightOnSquareIcon className="h-5 w-5" />, () => {
                  const url = prompt('Enter URL')
                  if (url) editor.chain().focus().setLink({ href: url }).run()
                }, editor.isActive('link'))}
                {toolbarButton(<PhotoIcon className="h-5 w-5" />, () => {
                  const url = prompt('Enter image URL')
                  if (url) editor.chain().focus().setImage({ src: url }).run()
                }, false)}
              </>
            )}
          </div>

          {/* Content Editor */}
          <div className="bg-white border border-main rounded overflow-hidden min-h-[400px]">
            {editor ? (
              <EditorContent
                editor={editor}
                className="p-4 w-full min-h-[400px] h-auto outline-none focus:ring-2 focus:ring-main text-gray-800"
                style={{ minHeight: '400px' }}
              />
            ) : (
              <p className="p-4 text-gray-500">Loading editor...</p>
            )}
          </div>

          {/* Action Buttons */}
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
