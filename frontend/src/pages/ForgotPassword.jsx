import React, { useState } from 'react';
import { KeyRound, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { authAPI } from '../api/client';

export const ForgotPassword = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleCheckEmail = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const res = await authAPI.forgotCheck({ email });
      if (res.data?.success) {
        setSecurityQuestion(res.data.securityQuestion);
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'No account found with this email');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const res = await authAPI.resetPassword({
        email,
        securityAnswer,
        newPassword,
      });
      if (res.data?.success) {
        setMessage('Password reset successful! Redirecting to sign in...');
        setTimeout(() => {
          onNavigate('login');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-100 p-8 shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-6">
        
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Reset Password</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            {step === 1 ? 'Enter your registered email' : 'Answer your security question'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleCheckEmail} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="farmer@agrismart.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Verifying...' : 'Find Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-[#f8fafc] border border-slate-100 text-slate-600">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Security Question</span>
              <span className="font-bold text-slate-800">{securityQuestion}</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Your Answer</label>
              <input
                type="text"
                required
                placeholder="e.g. wheat"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">New Password</label>
              <input
                type="password"
                required
                placeholder="Enter new strong password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Resetting Password...' : 'Save New Password'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="text-emerald-600 hover:text-emerald-700 font-bold"
          >
            Back to Sign In
          </button>
        </div>

      </div>
    </div>
  );
};
