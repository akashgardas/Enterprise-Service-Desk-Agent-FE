import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { APP_NAME, ROLES } from '../../config/constants';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash, HiOutlineExclamationCircle, HiOutlineUserGroup, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi2';

const LoginPage = () => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('Admin@123'); // Default password
  const [selectedRole, setSelectedRole] = useState('Employee');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password, role: selectedRole });
      navigate(from, { replace: true });
    } catch (err) {
      setError('The credentials you entered are incorrect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { label: 'Employee', value: 'Employee', icon: '👤' },
    { label: 'Service Agent', value: 'Agent', icon: '🎧' },
    { label: 'Manager', value: 'Manager', icon: '📈' },
    { label: 'System Admin', value: 'Admin', icon: '🛡️' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-6 right-6 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all active:scale-95 z-10"
      >
        {isDarkMode ? <HiOutlineSun className="w-5 h-5 text-slate-700 dark:text-yellow-400" /> : <HiOutlineMoon className="w-5 h-5 text-slate-600" />}
      </button>

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-100 dark:bg-primary-900/30 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl opacity-50"></div>

      <div className="w-full max-w-lg relative">
        <div className="bg-white dark:bg-slate-900 card-3d rounded-[2rem] shadow-2xl shadow-slate-200/60 dark:shadow-slate-900/60 border border-slate-100 dark:border-slate-800 overflow-hidden animate-fade-in">
          <div className="p-10 md:p-14">
            <div className="flex flex-col items-center mb-10">
              <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black italic mb-6 shadow-xl shadow-primary-500/30 text-2xl rotate-3">SD</div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{APP_NAME}</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Enterprise Support Portal Login</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 text-sm rounded-2xl flex items-start gap-3 animate-shake">
                <HiOutlineExclamationCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Select Your Role</label>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-sm font-bold ${
                        selectedRole === role.value 
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm' 
                        : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-200 dark:hover:border-slate-600'
                      }`}
                    >
                      <span className="text-lg">{role.icon}</span>
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                <div className="relative">
                  <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-12 py-4"
                    placeholder="name@company.com"
                    required={!selectedRole}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Password</label>
                  <a href="/password-reset" className="text-xs text-primary-600 font-bold hover:text-primary-700">Forgot Password?</a>
                </div>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-12 pr-12 py-4"
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <HiOutlineEyeSlash className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 ml-1">
                  Default: <span className="text-slate-600">Admin@123</span>
                </p>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-5 text-lg shadow-xl shadow-primary-600/30 flex items-center justify-center gap-3 mt-4"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  `Log in as ${selectedRole}`
                )}
              </button>
            </form>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-950 p-8 text-center border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Enterprise Identity Enforced • <span className="text-primary-600 dark:text-primary-400 font-bold">SSO Enabled</span>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-10 text-slate-400 text-xs font-bold uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Enterprise Service Desk Agent • Security Compliant
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
