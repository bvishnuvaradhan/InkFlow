import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginRegister from './pages/LoginRegister';
import Dashboard from './pages/Dashboard';
import CreateEditPost from './pages/CreateEditPost';
import BlogPostDetail from './pages/BlogPostDetail';

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
              
              {/* Header Navigation */}
              <Navbar />

              {/* Page Content Container */}
              <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<LoginRegister />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/create-edit" element={<CreateEditPost />} />
                  <Route path="/post/:id" element={<BlogPostDetail />} />
                </Routes>
              </div>

              {/* Premium Footer */}
              <footer className="w-full py-8 mt-16 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/20 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 text-center">
                  <p className="text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    InkFlow Blogging Platform
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                    © {new Date().getFullYear()} InkFlow. All rights reserved. Built with React + Tailwind CSS v4.
                  </p>
                </div>
              </footer>

            </div>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
