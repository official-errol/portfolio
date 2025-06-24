import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  media_url?: string;
  media_type?: 'image' | 'video' | 'youtube';
  created_at: string;
}

const BlogEditor: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'youtube' | ''>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('isAdminAuthenticated') !== 'true') {
      navigate('/');
    }
  }, []);

  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];

    if (file) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const fileType = file.type.startsWith('video') ? 'video' : 'image';

      const { data, error } = await supabase.storage
        .from('media') // Ensure bucket named 'media' exists
        .upload(`posts/${Date.now()}-${file.name}`, file);

      if (!error && data) {
        const { publicUrl } = supabase.storage.from('media').getPublicUrl(data.path);
        setMediaUrl(publicUrl);
        setMediaType(fileType);
      }
    }
  };

  const handleYouTube = () => {
    const url = prompt('Paste YouTube video link:');
    if (url && url.includes('youtube.com')) {
      setMediaUrl(url);
      setMediaType('youtube');
    }
  };

  const savePost = async () => {
    setSaving(true);
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
    const slug = slugify(title);

    const { error } = await supabase.from('posts').insert([
      {
        title,
        slug,
        content,
        author,
        category,
        tags: tagArray,
        media_url: mediaUrl,
        media_type: mediaType,
      },
    ]);

    setSaving(false);
    if (!error) {
      alert('Post saved!');
      setTitle('');
      setAuthor('');
      setCategory('');
      setTags('');
      setContent('');
      setMediaUrl('');
      setMediaType('');
    } else {
      alert('Error saving post.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-main-dark">Create Blog Post</h1>

      <input
        className="w-full p-2 mb-3 border border-gray-300 rounded"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        className="w-full p-2 mb-3 border border-gray-300 rounded"
        placeholder="Author"
        value={author}
        onChange={e => setAuthor(e.target.value)}
      />
      <input
        className="w-full p-2 mb-3 border border-gray-300 rounded"
        placeholder="Category"
        value={category}
        onChange={e => setCategory(e.target.value)}
      />
      <input
        className="w-full p-2 mb-3 border border-gray-300 rounded"
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={e => setTags(e.target.value)}
      />

      <textarea
        className="w-full p-3 mb-3 border border-gray-300 rounded min-h-[200px]"
        placeholder="Write your blog post here..."
        value={content}
        onChange={e => setContent(e.target.value)}
      />

      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="border border-dashed border-gray-400 p-6 mb-4 rounded text-center text-gray-500 cursor-pointer"
      >
        Drag and drop image or video here
      </div>

      <button
        onClick={handleYouTube}
        className="mb-4 px-4 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
      >
        Add YouTube Video
      </button>

      {mediaUrl && (
        <div className="mb-4">
          {mediaType === 'image' && <img src={mediaUrl} alt="Uploaded" className="max-h-64" />}
          {mediaType === 'video' && (
            <video controls className="max-h-64">
              <source src={mediaUrl} />
            </video>
          )}
          {mediaType === 'youtube' && (
            <iframe
              className="w-full h-64"
              src={`https://www.youtube.com/embed/${new URL(mediaUrl).searchParams.get('v')}`}
              title="YouTube video"
              allowFullScreen
            />
          )}
        </div>
      )}

      <button
        onClick={savePost}
        disabled={saving}
        className="px-6 py-2 bg-main text-white rounded hover:bg-main-dark"
      >
        {saving ? 'Saving...' : 'Save Post'}
      </button>
    </div>
  );
};

export default BlogEditor;
