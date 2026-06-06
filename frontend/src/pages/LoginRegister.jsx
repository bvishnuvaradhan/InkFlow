import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginRegister() {
  const { login, register, user, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatarSeed: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  // Set view based on path state if navigating from redirect
  useEffect(() => {
    if (location.state?.register) {
      setIsLogin(false);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, avatarSeed } = formData;

    if (!email || !password) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    if (!isLogin && !name) {
      showToast('Please enter your name.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      if (isLogin) {
        const res = await login(email, password);
        if (res.success) {
          showToast('Welcome back to InkFlow!', 'success');
          navigate('/dashboard');
        } else {
          showToast(res.error || 'Failed to login.', 'error');
        }
      } else {
        // Build avatar url if seed is provided
        const avatarUrl = avatarSeed 
          ? `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(avatarSeed)}`
          : undefined;

        const res = await register(name, email, password, avatarUrl);
        if (res.success) {
          showToast('Account created successfully! Welcome to InkFlow.', 'success');
          navigate('/dashboard');
        } else {
          showToast(res.error || 'Failed to register.', 'error');
        }
      }
    } catch (err) {
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-violet-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md glassmorphism border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-8 z-10 transition-all duration-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {isLogin ? 'Welcome Back' : 'Join InkFlow'}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {isLogin 
              ? 'Log in to manage your posts and write stories.' 
              : 'Create a writer account to start publishing today.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field (Register Only) */}
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-950 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-950 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-950 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Avatar Seed Field (Register Only) */}
          {!isLogin && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Avatar Character Seed (Optional)</label>
                <span className="text-[10px] text-slate-400">(Dicebear Character generator)</span>
              </div>
              <input
                type="text"
                name="avatarSeed"
                value={formData.avatarSeed}
                onChange={handleChange}
                placeholder="e.g. sparky, lucy, felix"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-950 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 w-full py-3 mt-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {submitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            {!submitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center border-t border-slate-200/50 dark:border-slate-800/50 pt-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ name: '', email: '', password: '', avatarSeed: '' });
              }}
              className="ml-1.5 font-semibold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
