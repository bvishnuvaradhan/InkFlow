import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Save, Sparkles, Image as ImageIcon, Send } from 'lucide-react';

export default function CreateEditPost() {
  const { user, token, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    content: '',
    coverImage: '',
    tags: '',
    status: 'published'
  });
  const [loading, setLoading] = useState(false);
  const [fetchingPost, setFetchingPost] = useState(false);

  // Authenticate user check
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Load post details if editing
  useEffect(() => {
    if (!editId || !user) return;

    const fetchPostToEdit = async () => {
      setFetchingPost(true);
      try {
        const res = await fetch(`/api/posts/${editId}`);
        if (res.ok) {
          const data = await res.json();
          const post = data.post;

          // Verify if user is author
          if (post.author._id !== user.id && user.role !== 'admin') {
            showToast('You are not authorized to edit this article.', 'error');
            navigate('/dashboard');
            return;
          }

          setFormData({
            title: post.title,
            category: post.category,
            content: post.content,
            coverImage: post.coverImage || '',
            tags: post.tags ? post.tags.join(', ') : '',
            status: post.status
          });
        } else {
          showToast('Failed to load article details.', 'error');
          navigate('/dashboard');
        }
      } catch (err) {
        showToast('Error connecting to the server.', 'error');
      } finally {
        setFetchingPost(false);
      }
    };

    fetchPostToEdit();
  }, [editId, user, navigate, showToast]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, category, content, coverImage, tags, status } = formData;

    if (!title.trim() || !content.trim() || !category) {
      showToast('Title, category, and content are required.', 'error');
      return;
    }

    setLoading(true);

    try {
      const url = editId ? `/api/posts/${editId}` : '/api/posts';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          category,
          content,
          coverImage: coverImage.trim() || undefined,
          tags, // Route handles tags formatting from string/array
          status
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(
          editId 
            ? 'Article updated successfully!' 
            : status === 'published' 
              ? 'Article published successfully!' 
              : 'Draft saved successfully!', 
          'success'
        );
        navigate('/dashboard');
      } else {
        showToast(data.message || 'Failed to save article.', 'error');
      }
    } catch (err) {
      showToast('Server connection error.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || fetchingPost) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">
        <div className="w-20 h-4 rounded shimmer mb-8"></div>
        <div className="w-1/2 h-10 rounded shimmer mb-8"></div>
        <div className="space-y-6">
          <div className="w-full h-12 rounded shimmer"></div>
          <div className="w-full h-12 rounded shimmer"></div>
          <div className="w-full h-48 rounded shimmer"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 transition-colors duration-300">
      
      {/* Back to Dashboard */}
      <Link 
        to="/dashboard" 
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-violet-500" />
          {editId ? 'Edit Article' : 'Write New Story'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {editId 
            ? 'Make adjustments to your written post and update.' 
            : 'Write your thoughts, format with simple text paragraphs, and add tags.'}
        </p>
      </header>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Building Responsive Layouts with Tailwind CSS v4"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-950 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-semibold text-base"
            required
          />
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Category */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-950 dark:text-white outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm font-medium"
            >
              <option value="Technology">Technology</option>
              <option value="Programming">Programming</option>
              <option value="AI">AI</option>
              <option value="Web Development">Web Development</option>
              <option value="Career">Career</option>
            </select>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-950 dark:text-white outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm font-medium"
            >
              <option value="published">Publish (Public feed)</option>
              <option value="draft">Draft (Private stats)</option>
            </select>
          </div>

        </div>

        {/* Cover Image URL */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cover Image URL (Optional)</label>
            <span className="text-[10px] text-slate-400">Leaves as default image if empty</span>
          </div>
          <div className="relative">
            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/... or other image url"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-950 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tags (Optional)</label>
            <span className="text-[10px] text-slate-400">Separated by commas</span>
          </div>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. React, Nodejs, MongoDB, WebDev"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-950 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm"
          />
        </div>

        {/* Content */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Content Body</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your blog post body here..."
            rows="10"
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-950 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm resize-y leading-relaxed font-sans"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <Link
            to="/dashboard"
            className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md hover:shadow-violet-500/20 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Saving...' : editId ? 'Update Article' : 'Publish Article'}
            {editId ? <Save className="w-4 h-4" /> : <Send className="w-4 h-4" />}
          </button>
        </div>

      </form>
    </div>
  );
}
