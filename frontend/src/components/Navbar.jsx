import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, X, LogOut, LayoutDashboard, FileEdit, LogIn } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200/50 dark:border-slate-800/50 glassmorphism transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-black bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                InkFlow
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-violet-600 dark:hover:text-violet-400 ${
                isActive('/') 
                  ? 'text-violet-600 dark:text-violet-400 font-semibold' 
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Feed
            </Link>

            {user && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium transition-colors hover:text-violet-600 dark:hover:text-violet-400 ${
                    isActive('/dashboard') 
                      ? 'text-violet-600 dark:text-violet-400 font-semibold' 
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/create-edit" 
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-violet-600 dark:hover:text-violet-400 ${
                    isActive('/create-edit') 
                      ? 'text-violet-600 dark:text-violet-400 font-semibold' 
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <FileEdit className="w-4 h-4" />
                  Write
                </Link>
              </>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth Actions */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 cursor-pointer focus:outline-none"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full ring-2 ring-violet-500/20 hover:ring-violet-500/50 transition-all object-cover"
                  />
                </button>

                {showDropdown && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                    <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 py-1 z-20 transition-all">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-left text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md hover:shadow-violet-500/20 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200/50 dark:border-slate-800/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-xl text-base font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/30'
              }`}
            >
              Feed
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-xl text-base font-medium transition-colors ${
                    isActive('/dashboard') 
                      ? 'bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/create-edit"
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-xl text-base font-medium transition-colors ${
                    isActive('/create-edit') 
                      ? 'bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  Write Post
                </Link>
                <div className="pt-4 pb-2 border-t border-slate-200 dark:border-slate-800 mt-2">
                  <div className="flex items-center px-3 gap-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3 py-2 mt-3 text-base font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-5 h-5 text-rose-500" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 mt-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center items-center gap-1.5 w-full px-4 py-2.5 rounded-xl text-base font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md cursor-pointer"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
