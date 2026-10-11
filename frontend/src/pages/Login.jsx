import React, { useState } from 'react';
import { Sprout, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      onNavigate('dashboard');
    } else {
      setError(res.message || 'Invalid credentials');
    }
  };

  const handleDemoLogin = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setLoading(true);
    const res = await login(demoEmail, demoPass);
    setLoading(false);
    if (res.success) {
      onNavigate('dashboard');
    } else {
      setError(res.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-100 p-8 shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-6">
        
        {/* Brand */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20 mb-3 text-white">
            <Sprout className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Welcome to FarmVista</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Access live mandi market rates & weather intelligence
          </p>
        </div>

        {/* 1-Click Quick Demo Login Buttons */}
        <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-100 space-y-2.5 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            ⚡ Quick Test with 1-Click Demo
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('farmer@agrismart.in', 'Farmer@123')}
              className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              🌾 Farmer Demo
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@agrismart.in', 'Admin@123')}
              className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              🛡️ Admin Demo
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="farmer@agrismart.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => onNavigate('forgot')}
                className="text-emerald-600 hover:text-emerald-700 font-bold"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{loading ? 'Signing in...' : 'Sign In to FarmVista'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Switch to Register */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Don't have an account yet? </span>
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="text-emerald-600 hover:text-emerald-700 font-bold"
          >
            Register as Farmer
          </button>
        </div>

      </div>
    </div>
  );
};
