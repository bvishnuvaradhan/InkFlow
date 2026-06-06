import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Heart, User } from 'lucide-react';

export default function BlogCard({ post }) {
  const { _id, title, content, coverImage, tags, category, author, likes, createdAt } = post;

  // Calculate reading time (~200 words per minute)
  const calculateReadingTime = (text) => {
    if (!text) return '1 min read';
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Excerpt generation
  const getExcerpt = (text) => {
    if (!text) return '';
    // Strip html-like tags if any
    const plainText = text.replace(/<[^>]*>/g, '');
    return plainText.length > 120 ? plainText.substring(0, 120) + '...' : plainText;
  };

  // Category Colors
  const categoryColors = {
    'Technology': 'bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/50',
    'Programming': 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/50',
    'AI': 'bg-violet-50 text-violet-700 border-violet-200/60 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-800/50',
    'Web Development': 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50',
    'Career': 'bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/50',
  };

  const badgeClass = categoryColors[category] || 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700';

  return (
    <article className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
      {/* Cover Image */}
      <Link to={`/post/${_id}`} className="relative block aspect-[16/9] overflow-hidden">
        <img
          src={coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent"></div>
      </Link>

      {/* Content Area */}
      <div className="flex-1 flex flex-col p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-3">
          {/* Category */}
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}>
            {category}
          </span>
          {/* Reading Time */}
          <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            {calculateReadingTime(content)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold leading-snug mb-2.5 text-slate-900 dark:text-slate-50 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          <Link to={`/post/${_id}`}>{title}</Link>
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 flex-1 leading-relaxed">
          {getExcerpt(content)}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx} 
                className="text-xs px-2 py-0.5 bg-slate-100 hover:bg-slate-200/80 text-slate-600 dark:bg-slate-800/60 dark:hover:bg-slate-700/60 dark:text-slate-400 rounded-md transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 my-4"></div>

        {/* Author Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={author?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
              alt={author?.name || 'Author'}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-800"
            />
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                {author?.name || 'Anonymous'}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                {formatDate(createdAt)}
              </p>
            </div>
          </div>

          {/* Likes indicator */}
          <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
            <Heart className={`w-4 h-4 ${likes?.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            <span>{likes?.length || 0}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
