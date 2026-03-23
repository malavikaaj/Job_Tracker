import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { LogIn, UserPlus, Mail, User as UserIcon, Lock } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      // For demo, we just use the name from state or a fallback
      login(email, name || email.split('@')[0]);
    } else {
      register(email, name);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl shadow-slate-200 overflow-hidden border border-slate-100">
        <div className="bg-blue-600 p-8 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">JobTracker</h1>
          <p className="text-blue-100 opacity-90">
            {isLogin ? 'Welcome back! Log in to see your applications.' : 'Start your journey. Track your applications today.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                required
                type="password"
                name="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isLogin ? (
              <>
                <LogIn size={20} />
                Sign In
              </>
            ) : (
              <>
                <UserPlus size={20} />
                Create Account
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
