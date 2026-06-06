import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import SkeletonLoader from '../components/SkeletonLoader';
import { FileText, MessageSquare, BookOpen, FileEdit, Plus, Trash2, Edit, ExternalLink, Calendar } from 'lucide-react';

export default function Dashboard() {
  const { user, token, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Authenticate user check
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Fetch stats and posts
  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch Stats
        const statsRes = await fetch('/_/backend/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Fetch user posts
        const postsRes = await fetch('/_/backend/api/posts?authorOnly=true', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (statsRes.ok && postsRes.ok) {
          const statsData = await statsRes.json();
          const postsData = await postsRes.json();
          setStats(statsData);
          setPosts(postsData);
        } else {
          showToast('Failed to load dashboard data.', 'error');
        }
      } catch (err) {
        showToast('Error connecting to the server.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, token, showToast]);

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to permanently delete this post? All comments will also be deleted.')) return;

    try {
      const res = await fetch(`/_/backend/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setPosts(prev => prev.filter(p => p._id !== postId));
        // Recalculate stats locally
        setStats(prev => {
          const deletedPost = posts.find(p => p._id === postId);
          const wasPublished = deletedPost?.status === 'published';
          return {
            ...prev,
            totalPosts: prev.totalPosts - 1,
            publishedPosts: wasPublished ? prev.publishedPosts - 1 : prev.publishedPosts,
            draftPosts: !wasPublished ? prev.draftPosts - 1 : prev.draftPosts,
          };
        });
        showToast('Post deleted successfully.', 'success');
      } else {
        showToast('Failed to delete post.', 'error');
      }
    } catch (err) {
      showToast('Network error, post not deleted.', 'error');
    }
  };

  if (authLoading || (loading && !stats)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-10 w-48 rounded shimmer mb-8"></div>
        <SkeletonLoader type="stats" />
        <div className="h-6 w-32 rounded shimmer mb-4"></div>
        <SkeletonLoader type="grid" count={3} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 transition-colors duration-300">
      
      {/* Header Panel */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Writer Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your draft and published articles, and review statistics.
          </p>
        </div>
        <Link
          to="/create-edit"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-violet-500/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4.5 h-4.5" />
          Create New Article
        </Link>
      </header>

      {/* Statistics Cards Grid */}
      {stats && (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {/* Card 1: Total Posts */}
          <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400">
                <FileText className="w-5 h-5" />
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none mb-1.5">{stats.totalPosts}</p>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Articles</p>
          </div>

          {/* Card 2: Published Posts */}
          <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <BookOpen className="w-5 h-5" />
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none mb-1.5">{stats.publishedPosts}</p>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Published</p>
          </div>

          {/* Card 3: Draft Posts */}
          <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                <FileEdit className="w-5 h-5" />
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none mb-1.5">{stats.draftPosts}</p>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Drafts</p>
          </div>

          {/* Card 4: Total Comments */}
          <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
                <MessageSquare className="w-5 h-5" />
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none mb-1.5">{stats.totalComments}</p>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Comments Received</p>
          </div>
        </section>
      )}

      {/* User's Post Directory */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Your Articles</h2>
        
        {posts.length > 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/20 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Article</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Created</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                  {posts.map((post) => (
                    <tr key={post._id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors">
                      {/* Image & Title */}
                      <td className="px-6 py-4 min-w-[300px]">
                        <div className="flex items-center gap-4">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-16 h-10 rounded-lg object-cover border border-slate-200/30 dark:border-slate-700/30 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[250px]" title={post.title}>
                              {post.title}
                            </h4>
                            <span className="text-slate-400 dark:text-slate-500 text-xs flex items-center gap-1.5 mt-0.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                        {post.category}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center
                          ${post.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                          }
                        `}>
                          {post.status}
                        </span>
                      </td>

                      {/* Likes count */}
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {post.likes?.length || 0} Like{post.likes?.length !== 1 ? 's' : ''}
                      </td>

                      {/* Quick Actions */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {post.status === 'published' && (
                            <Link
                              to={`/post/${post._id}`}
                              className="p-2 text-slate-400 hover:text-violet-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                              title="View Post"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}
                          <Link
                            to={`/create-edit?edit=${post._id}`}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                            title="Edit Post"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors cursor-pointer"
                            title="Delete Post"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Empty Posts View */
          <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 bg-white/40 dark:bg-slate-900/40">
            <Plus className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Write your first article</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mb-5">
              Get started by creating drafts or publishing your stories to InkFlow.
            </p>
            <Link
              to="/create-edit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-950 hover:opacity-95 transition-opacity"
            >
              Write Article
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
