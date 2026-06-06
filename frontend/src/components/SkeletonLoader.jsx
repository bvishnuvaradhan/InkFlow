import React from 'react';

export default function SkeletonLoader({ type = 'grid', count = 3 }) {
  if (type === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {Array.from({ length: count }).map((_, index) => (
          <div 
            key={index} 
            className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm h-[400px]"
          >
            {/* Image Placeholder */}
            <div className="aspect-[16/9] shimmer w-full"></div>
            
            {/* Content Placeholder */}
            <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
              <div>
                {/* Category & Time */}
                <div className="flex gap-2.5 mb-4">
                  <div className="w-16 h-4 rounded shimmer"></div>
                  <div className="w-20 h-4 rounded shimmer"></div>
                </div>
                
                {/* Title */}
                <div className="w-full h-6 rounded shimmer mb-2.5"></div>
                <div className="w-3/4 h-6 rounded shimmer mb-4"></div>
                
                {/* Excerpt */}
                <div className="w-full h-3 rounded shimmer mb-2"></div>
                <div className="w-full h-3 rounded shimmer mb-2"></div>
                <div className="w-5/6 h-3 rounded shimmer"></div>
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full shimmer"></div>
                  <div className="space-y-1.5">
                    <div className="w-16 h-3 rounded shimmer"></div>
                    <div className="w-12 h-2.5 rounded shimmer"></div>
                  </div>
                </div>
                <div className="w-8 h-4 rounded shimmer"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-pulse">
        {/* Category */}
        <div className="w-24 h-6 rounded shimmer mb-4 mx-auto"></div>
        {/* Title */}
        <div className="w-3/4 h-10 rounded shimmer mb-4 mx-auto"></div>
        <div className="w-1/2 h-10 rounded shimmer mb-8 mx-auto"></div>
        
        {/* Author */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-full shimmer"></div>
          <div className="space-y-1.5">
            <div className="w-24 h-4 rounded shimmer"></div>
            <div className="w-16 h-3 rounded shimmer"></div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="aspect-[21/9] w-full rounded-2xl shimmer mb-10"></div>

        {/* Article content paragraph blocks */}
        <div className="space-y-4 mb-8">
          <div className="w-full h-4 rounded shimmer"></div>
          <div className="w-full h-4 rounded shimmer"></div>
          <div className="w-5/6 h-4 rounded shimmer"></div>
          <div className="w-full h-4 rounded shimmer"></div>
          <div className="w-4/5 h-4 rounded shimmer"></div>
        </div>
        
        <div className="space-y-4">
          <div className="w-full h-4 rounded shimmer"></div>
          <div className="w-full h-4 rounded shimmer"></div>
          <div className="w-11/12 h-4 rounded shimmer"></div>
          <div className="w-full h-4 rounded shimmer"></div>
        </div>
      </div>
    );
  }

  if (type === 'stats') {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div 
            key={index} 
            className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl shimmer"></div>
            </div>
            <div className="w-12 h-8 rounded shimmer mb-1.5"></div>
            <div className="w-20 h-4 rounded shimmer"></div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
