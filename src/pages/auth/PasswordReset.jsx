import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { APP_NAME } from '../../config/constants';
import { HiOutlineEnvelope, HiOutlineArrowLeft, HiOutlineCheckCircle } from 'react-icons/hi2';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-10 md:p-14 text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <HiOutlineCheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Check your email</h1>
          <p className="text-slate-500 font-medium mb-10 leading-relaxed">
            We've sent password reset instructions to <span className="text-slate-900 font-bold">{email}</span>.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="btn-primary w-full py-4"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-3xl opacity-50"></div>
      
      <div className="w-full max-w-md relative">
        <Link 
          to="/login" 
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm uppercase tracking-widest mb-8 transition-colors group"
        >
          <HiOutlineArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        <div className="bg-white rounded-[2rem] shadow-2xl p-10 md:p-14 animate-fade-in">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black italic mb-6 shadow-xl text-2xl">SD</div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Reset Password</h1>
            <p className="text-slate-500 mt-2 font-medium text-center">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Work Email</label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-12 py-4"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading || !email}
              className="btn-primary w-full py-5 text-lg"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
