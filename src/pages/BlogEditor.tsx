// BlogEditor.tsx
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
  Bars4Icon,
  ArrowLeftIcon,
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

interface BlogEditorProps {
  editingPostId: string | null;
  onPostSelect: (postId: string) => void;
  onClearEditing: () => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ 
  editingPostId, 
  onPostSelect,
  onClearEditing 
}) => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
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

  useEffect(() => {
    if (editingPostId && editingPostId !== 'new') {
      const post = posts.find(p => p.id === editingPostId)
      if (post) {
        loadPostForEditing(post)
      }
    } else if (editingPostId === 'new') {
      clearForm()
    }
  }, [editingPostId, posts])

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
        isActive ? 'bg-main text-main-dark' : 'text-gray-800'
      }`}
    >
      {icon}
    </button>
  )

  const loadPostForEditing = (post: Post) => {
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

    if (editingPostId && editingPostId !== 'new') {
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
        .eq('id', editingPostId)
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
    onClearEditing()
  }

  const clearForm = () => {
    setTitle('')
    setAuthor('')
    setCategory('')
    setTags('')
    editor?.commands.clearContent()
  }

  return (
    <div className="flex flex-col bg-gray-100 text-gray-800 h-full">
      {editingPostId ? (
        // Editor View
        <div className="flex-grow overflow-y-auto bg-white p-8 max-w-6xl mx-auto w-full">
          <button
            onClick={onClearEditing}
            className="flex items-center gap-2 mb-6 text-main hover:text-main-dark"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to posts
          </button>
          
          <h1 className="text-3xl font-bold mb-4 text-main-dark">
            {editingPostId === 'new' ? 'Create Blog Post' : 'Edit Blog Post'}
          </h1>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

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
            <div className="bg-white border border-gray-200 rounded overflow-hidden min-h-[400px]">
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
                {saving ? 'Saving...' : editingPostId === 'new' ? 'Save Post' : 'Update Post'}
              </button>
              <button
                onClick={clearForm}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Post List View
        <div className="flex-grow overflow-y-auto bg-white p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-main-dark">Blog Posts</h1>
            <button
              onClick={() => onPostSelect('new')}
              className="px-4 py-2 bg-main text-white rounded hover:bg-main-dark flex items-center gap-2"
            >
              <DocumentPlusIcon className="h-5 w-5" />
              New Post
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map(post => (
              <div
                key={post.id}
                onClick={() => onPostSelect(post.id)}
                className="cursor-pointer p-4 rounded-lg border border-gray-200 hover:border-main transition-colors"
              >
                <p className="font-medium text-lg">{post.title}</p>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-600">{post.category}</span>
                  <span className="text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
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
