import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { APP_NAME, ROLES } from '../../config/constants';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash, HiOutlineExclamationCircle, HiOutlineUserGroup, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi2';
import { useTheme } from '../../hooks/useTheme';

const LoginPage = () => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('Admin@123'); // Default password
  const [selectedRole, setSelectedRole] = useState('Employee');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Check for Gmail addresses
  const isGmail = (email) => {
    return email.toLowerCase().endsWith('@gmail.com');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Always validate email is provided
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    // Check for Gmail addresses
    if (isGmail(email)) {
      setError('Gmail addresses are not allowed. Please use your company email address.');
      return;
    }

    // Validate password
    if (!password) {
      setError('Please enter a password.');
      return;
    }

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
    <div className="min-h-screen bg-neutral-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-xl bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all active:scale-95 z-10"
      >
        {theme === 'dark' ? <HiOutlineSun className="w-5 h-5 text-yellow-500" /> : <HiOutlineMoon className="w-5 h-5 text-neutral-600" />}
      </button>

      <div className="w-full max-w-lg relative">
        <div className="bg-white dark:bg-slate-800 card-3d rounded-2xl shadow-md border border-neutral-200 dark:border-slate-700 overflow-hidden animate-fade-in">
          <div className="p-8 md:p-10">
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold italic mb-5 shadow-sm text-xl rotate-2">SD</div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{APP_NAME}</h1>
              <p className="text-neutral-600 dark:text-slate-400 mt-2">Enterprise Support Portal</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 text-sm rounded-xl flex items-start gap-3 animate-shake">
                <HiOutlineExclamationCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider ml-1">Select Your Role</label>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all text-sm font-semibold ${
                        selectedRole === role.value 
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                          : 'border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-900 text-neutral-700 dark:text-slate-300 hover:border-neutral-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <span className="text-xl">{role.icon}</span>
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative">
                  <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`input pl-12 py-3 ${email && isGmail(email) ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                    placeholder="name@company.com"
                    required
                  />
                </div>
                {email && isGmail(email) && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
                    <HiOutlineExclamationCircle className="w-4 h-4" />
                    Gmail addresses are not permitted
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Password</label>
                  <a href="/password-reset" className="text-xs text-blue-600 font-semibold hover:text-blue-700">Forgot Password?</a>
                </div>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-12 pr-12 py-3"
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <HiOutlineEyeSlash className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-widest mt-2 ml-1">
                  Default: <span className="text-neutral-700">Admin@123</span>
                </p>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 mt-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  `Log in as ${selectedRole}`
                )}
              </button>
            </form>
          </div>
          
          <div className="bg-neutral-50 dark:bg-slate-900 p-6 text-center border-t border-neutral-200 dark:border-slate-700">
            <p className="text-sm text-neutral-600 dark:text-slate-400 font-medium">
              Enterprise Identity Enforced • <span className="text-blue-600 dark:text-blue-400 font-semibold">SSO Enabled</span>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-neutral-400 text-[10px] font-semibold uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Enterprise Service Desk Agent • Security Compliant
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
