import React, { useState } from 'react';
import { Sprout, Lock, Mail, User, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Register = ({ onNavigate }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'farmer',
    phone: '',
    state: 'Maharashtra',
    district: 'Nashik',
    securityQuestion: 'What is your primary crop?',
    securityAnswer: 'wheat',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await register(formData);
    setLoading(false);
    if (res.success) {
      onNavigate('dashboard');
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-100 p-8 shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-6">
        
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20 mb-3 text-white">
            <Sprout className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Create FarmVista Account</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Join the verified mandi agricultural intelligence network
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-500"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="ramesh@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Account Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium"
              >
                <option value="farmer">🌾 Farmer / Kisan</option>
                <option value="admin">🛡️ Mandi Administrator</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">District / Mandi Region</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <span>{loading ? 'Creating Account...' : 'Complete Farmer Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Already registered? </span>
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="text-emerald-600 hover:text-emerald-700 font-bold"
          >
            Sign In here
          </button>
        </div>

      </div>
    </div>
  );
};
