import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import SkeletonLoader from '../components/SkeletonLoader';
import { Heart, Clock, Send, Trash2, ArrowLeft, MessageSquare } from 'lucide-react';

export default function BlogPostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [liking, setLiking] = useState(false);
  const [postingComment, setPostingComment] = useState(false);

  // Fetch Post and Comments
  useEffect(() => {
    const fetchPostDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/_/backend/api/posts/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data.post);
          setComments(data.comments);
        } else {
          showToast('Article not found.', 'error');
          navigate('/');
        }
      } catch (err) {
        showToast('Error loading article.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [id, navigate, showToast]);

  // Handle Like Action
  const handleLike = async () => {
    if (!user) {
      showToast('Please sign in to like this post.', 'info');
      navigate('/login');
      return;
    }

    if (liking) return;
    setLiking(true);

    try {
      const res = await fetch(`/_/backend/api/posts/${post._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const updatedLikes = await res.json();
        setPost(prev => ({
          ...prev,
          likes: updatedLikes
        }));
      } else {
        showToast('Failed to update likes.', 'error');
      }
    } catch (err) {
      showToast('Network error, try again.', 'error');
    } finally {
      setLiking(false);
    }
  };

  // Handle Comment Submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    if (!user) {
      showToast('Please sign in to comment.', 'info');
      navigate('/login');
      return;
    }

    setPostingComment(true);

    try {
      const res = await fetch('/_/backend/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          postId: post._id,
          content: commentContent
        })
      });

      const data = await res.json();
      if (res.ok) {
        // Add new comment to top of the list
        setComments(prev => [data, ...prev]);
        setCommentContent('');
        showToast('Comment posted successfully!', 'success');
      } else {
        showToast(data.message || 'Failed to post comment.', 'error');
      }
    } catch (err) {
      showToast('Network error, comment not posted.', 'error');
    } finally {
      setPostingComment(false);
    }
  };

  // Handle Comment Deletion
  const handleCommentDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const res = await fetch(`/_/backend/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setComments(prev => prev.filter(c => c._id !== commentId));
        showToast('Comment deleted successfully.', 'success');
      } else {
        showToast('Failed to delete comment.', 'error');
      }
    } catch (err) {
      showToast('Network error, try again.', 'error');
    }
  };

  // Reading time helper
  const calculateReadingTime = (text) => {
    if (!text) return '1 min read';
    const words = text.trim().split(/\s+/).length;
    return `${Math.ceil(words / 200)} min read`;
  };

  if (loading) {
    return <SkeletonLoader type="detail" />;
  }

  if (!post) {
    return null;
  }

  const isLiked = user && post.likes.includes(user.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 transition-colors duration-300">
      
      {/* Back Button */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Feed
      </Link>

      {/* Article Header */}
      <header className="text-center mb-8">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-800/50">
          {post.category}
        </span>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mt-4 mb-6 leading-tight max-w-3xl mx-auto">
          {post.title}
        </h1>

        {/* Author Metadata */}
        <div className="flex items-center justify-center gap-3">
          <img
            src={post.author?.avatar}
            alt={post.author?.name}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
          />
          <div className="text-left">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {post.author?.name}
              {post.author?.role === 'admin' && (
                <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-400 font-bold uppercase">
                  Admin
                </span>
              )}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {calculateReadingTime(post.content)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200/40 dark:border-slate-800/40 mb-10">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Content */}
      <article className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed text-base sm:text-lg mb-12 space-y-6">
        {post.content.split('\n').map((paragraph, index) => {
          if (!paragraph.trim()) return null;
          return <p key={index} className="whitespace-pre-line">{paragraph}</p>;
        })}
      </article>

      {/* Tags list */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {post.tags.map((tag, idx) => (
            <span 
              key={idx} 
              className="text-xs px-3 py-1 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-lg border border-slate-200/30 dark:border-slate-800/30"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Interactions Action Bar */}
      <section className="flex items-center justify-between py-5 border-y border-slate-200/60 dark:border-slate-800/60 mb-12">
        <button
          onClick={handleLike}
          disabled={liking}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all cursor-pointer disabled:opacity-50
            ${isLiked
              ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900 dark:text-rose-400 shadow-sm'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
            }
          `}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>{isLiked ? 'Liked' : 'Like Post'} ({post.likes?.length || 0})</span>
        </button>

        <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <MessageSquare className="w-5 h-5" />
          <span>{comments.length} Comment{comments.length !== 1 ? 's' : ''}</span>
        </div>
      </section>

      {/* Comments Section */}
      <section className="space-y-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          Discussion ({comments.length})
        </h3>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="flex flex-col gap-3">
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder={user ? "Share your thoughts on this article..." : "Please sign in to join the discussion."}
            rows="4"
            disabled={!user || postingComment}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-950 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm resize-none disabled:bg-slate-100/50 dark:disabled:bg-slate-950/50"
            required
          />
          {user ? (
            <button
              type="submit"
              disabled={postingComment || !commentContent.trim()}
              className="self-end flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md hover:shadow-violet-500/20 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              Post Comment
              <Send className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              to="/login"
              className="self-start text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
            >
              Sign in to write a comment
            </Link>
          )}
        </form>

        {/* Comments List */}
        <div className="space-y-4 pt-4">
          {comments.length > 0 ? (
            comments.map((comment) => {
              const isCommentAuthor = user && comment.userId?._id === user.id;
              return (
                <div 
                  key={comment._id} 
                  className="flex gap-4 p-5 bg-white dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl"
                >
                  <img
                    src={comment.userId?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                    alt={comment.userId?.name}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {comment.userId?.name || 'Anonymous'}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {new Date(comment.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      {isCommentAuthor && (
                        <button
                          onClick={() => handleCommentDelete(comment._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
                          title="Delete Comment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed break-words whitespace-pre-line">
                      {comment.content}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-medium">No comments yet.</p>
              <p className="text-xs text-slate-400">Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
