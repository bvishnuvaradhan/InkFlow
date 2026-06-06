import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { Search, Compass, Flame, Clock, Sparkles, FilterX } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Home() {
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Search & Category states
  const searchVal = searchParams.get('search') || '';
  const categoryVal = searchParams.get('category') || '';
  const authorVal = searchParams.get('author') || '';

  const [searchInput, setSearchInput] = useState(searchVal);
  const [authorInput, setAuthorInput] = useState(authorVal);
  
  // Main Feed state
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab state: 'latest' vs 'popular'
  const [feedTab, setFeedTab] = useState('latest'); 
  
  // Highlighted Featured post state
  const [featuredPost, setFeaturedPost] = useState(null);

  const categories = ['All', 'Technology', 'Programming', 'AI', 'Web Development', 'Career'];

  // Sync inputs with URL params on load
  useEffect(() => {
    setSearchInput(searchVal);
    setAuthorInput(authorVal);
  }, [searchVal, authorVal]);

  // Fetch Featured Post (Top liked post overall)
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/posts?sortBy=likes');
        if (res.ok) {
          const data = await res.json();
          // Set the top liked post as featured
          if (data && data.length > 0) {
            setFeaturedPost(data[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching featured post:', err);
      }
    };
    fetchFeatured();
  }, []);

  // Fetch Main Feed Posts (Reacts to filters, search, and sorting tab)
  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        let url = `/api/posts?sortBy=${feedTab === 'popular' ? 'likes' : 'createdAt'}`;
        if (categoryVal && categoryVal !== 'All') {
          url += `&category=${encodeURIComponent(categoryVal)}`;
        }
        if (searchVal) {
          url += `&search=${encodeURIComponent(searchVal)}`;
        }
        if (authorVal) {
          url += `&authorName=${encodeURIComponent(authorVal)}`;
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        } else {
          showToast('Failed to fetch posts.', 'error');
        }
      } catch (err) {
        showToast('Error connecting to the server.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [categoryVal, searchVal, authorVal, feedTab, showToast]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (searchInput) params.search = searchInput;
    if (authorInput) params.author = authorInput;
    if (categoryVal) params.category = categoryVal;
    setSearchParams(params);
  };

  const handleCategorySelect = (category) => {
    const params = {};
    if (searchVal) params.search = searchVal;
    if (authorVal) params.author = authorVal;
    if (category !== 'All') params.category = category;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setAuthorInput('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
      
      {/* Premium Hero Banner */}
      <header className="relative text-center py-16 sm:py-20 mb-12 rounded-3xl overflow-hidden bg-slate-900 text-white shadow-2xl">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 bg-[url('https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&auto=format&fit=crop&q=60')]"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/60 via-slate-950/80 to-indigo-900/50"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 mb-4 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            Discover InkFlow
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none mb-6">
            Unleash Your Thoughts, <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-300 bg-clip-text text-transparent">
              Write the Future
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto mb-8 font-light">
            A minimalist workspace for developers, designers, and creators to share programming ideas, AI insights, and career growth.
          </p>

          {/* Inline Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto bg-white/10 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white/5 dark:bg-slate-950/20 rounded-xl border border-white/5">
              <Search className="w-5 h-5 text-slate-300 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search articles by title or tags..."
                className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
              />
            </div>
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white/5 dark:bg-slate-950/20 rounded-xl border border-white/5">
              <Compass className="w-5 h-5 text-slate-300 shrink-0" />
              <input
                type="text"
                value={authorInput}
                onChange={(e) => setAuthorInput(e.target.value)}
                placeholder="Filter by author name..."
                className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      </header>

      {/* Featured Post (Wow Header Card) */}
      {featuredPost && !searchVal && !categoryVal && !authorVal && (
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Featured Article</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group">
            {/* Image */}
            <div className="lg:col-span-7 aspect-[16/9] lg:aspect-auto lg:h-[320px] rounded-2xl overflow-hidden relative">
              <img
                src={featuredPost.coverImage}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-600 text-white border border-violet-500 shadow-md">
                  Featured
                </span>
              </div>
            </div>
            {/* Content */}
            <div className="lg:col-span-5 flex flex-col justify-between py-2">
              <div>
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400 tracking-wider uppercase">
                  {featuredPost.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 mb-4 leading-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  <Link to={`/post/${featuredPost._id}`}>{featuredPost.title}</Link>
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-4">
                  {featuredPost.content.replace(/<[^>]*>/g, '')}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src={featuredPost.author?.avatar}
                    alt={featuredPost.author?.name}
                    className="w-9 h-9 rounded-full ring-2 ring-slate-100 dark:ring-slate-800"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{featuredPost.author?.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(featuredPost.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/post/${featuredPost._id}`}
                  className="text-xs font-bold text-violet-600 dark:text-violet-400 group-hover:translate-x-1.5 transition-transform flex items-center gap-1 cursor-pointer"
                >
                  Read Post &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories Bar */}
      <section className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2.5">
          {categories.map((cat) => {
            const isCatActive = categoryVal === cat || (cat === 'All' && !categoryVal);
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border shrink-0 cursor-pointer
                  ${isCatActive
                    ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-950 shadow-md'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/50'
                  }
                `}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Feed Filters and Sorting header */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-200/50 dark:border-slate-800/50 pb-5">
        
        {/* Toggle between Latest and Popular */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/20">
          <button
            onClick={() => setFeedTab('latest')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer
              ${feedTab === 'latest'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }
            `}
          >
            <Clock className="w-3.5 h-3.5" />
            Latest Posts
          </button>
          <button
            onClick={() => setFeedTab('popular')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer
              ${feedTab === 'popular'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }
            `}
          >
            <Flame className="w-3.5 h-3.5" />
            Popular Posts
          </button>
        </div>

        {/* Filter feedback & Clear filters */}
        {(searchVal || categoryVal || authorVal) && (
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Showing filtered results
            </span>
            <button
              onClick={handleClearFilters}
              className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {/* Main Grid */}
      <main>
        {loading ? (
          <SkeletonLoader type="grid" count={6} />
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl max-w-xl mx-auto shadow-sm">
            <div className="inline-flex p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-4">
              <FilterX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Articles Found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-6">
              We couldn't find any articles matching your search queries or category filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-5 py-2.5 text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-950 rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
            >
              Reset Search Filter
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
