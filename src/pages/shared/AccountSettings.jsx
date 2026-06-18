import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import { 
  HiOutlineUser, 
  HiOutlineAtSymbol, 
  HiOutlinePhone, 
  HiOutlineBuildingOffice, 
  HiOutlineShieldCheck, 
  HiOutlineExclamationCircle, 
  HiOutlineCheck,
  HiOutlineKey
} from 'react-icons/hi2';

const AccountSettings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || 'General Support'
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess('');
    setError('');
    
    try {
      await userService.updateUser(user.id, formData);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsChangingPassword(true);
    try {
      await userService.changePassword(passwordForm.oldPassword, passwordForm.newPassword);
      setSuccess('Password updated successfully!');
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Account Settings</h1>
        <p className="text-slate-500 dark:text-slate-300 mt-2 text-lg">Manage your profile and change your password</p>
      </div>

      {/* Profile Section */}
      <div className="card card-3d shadow-xl shadow-slate-200/50">
        <div className="card-header">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Profile Information</h3>
        </div>
        <form onSubmit={handleSaveProfile} className="p-8 space-y-6">
          {success && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-2xl text-green-700 dark:text-green-400 flex items-center gap-3">
              <HiOutlineShieldCheck className="w-5 h-5" />
              <span className="font-semibold">{success}</span>
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-700 dark:text-red-400 flex items-center gap-3">
              <HiOutlineExclamationCircle className="w-5 h-5" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input pl-12 py-4"
                  placeholder="Your full name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative">
                <HiOutlineAtSymbol className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input pl-12 py-4"
                  placeholder="name@company.com"
                  disabled
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
              <div className="relative">
                <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input pl-12 py-4"
                  placeholder="+1-555-0100"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ml-1">Department</label>
              <div className="relative">
                <HiOutlineBuildingOffice className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <select 
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="input pl-12 py-4"
                  disabled
                >
                  <option>Engineering</option>
                  <option>Marketing</option>
                  <option>Sales</option>
                  <option>HR</option>
                  <option>Network Team</option>
                  <option>Hardware Team</option>
                  <option>Application Team</option>
                  <option>Security Team</option>
                </select>
              </div>
            </div>
          </div>
          <div className="pt-4">
            <button 
              type="submit"
              disabled={isSaving}
              className="btn-primary flex items-center gap-3"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <HiOutlineCheck className="w-5 h-5" />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Password Section */}
      <div className="card card-3d shadow-xl shadow-slate-200/50">
        <div className="card-header flex items-center gap-3">
          <HiOutlineKey className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Change Password</h3>
        </div>
        {user?.canResetPassword === false ? (
          <div className="p-8">
            <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl text-amber-700 dark:text-amber-400">
              <div className="flex items-center gap-3 mb-2">
                <HiOutlineExclamationCircle className="w-6 h-6" />
                <h4 className="font-bold text-lg">Password Reset Not Allowed</h4>
              </div>
              <p className="text-sm">
                Your account currently doesn't have permission to reset the password. 
                Please contact your system administrator to request access.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleChangePassword} className="p-8 space-y-6">
            {success && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-2xl text-green-700 dark:text-green-400 flex items-center gap-3">
                <HiOutlineShieldCheck className="w-5 h-5" />
                <span className="font-semibold">{success}</span>
              </div>
            )}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-700 dark:text-red-400 flex items-center gap-3">
                <HiOutlineExclamationCircle className="w-5 h-5" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ml-1">Current Password</label>
                <input 
                  type="password" 
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  className="input py-4"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ml-1">New Password</label>
                <input 
                  type="password" 
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="input py-4"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ml-1">Confirm New Password</label>
                <input 
                  type="password" 
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="input py-4"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <div className="pt-4">
              <button 
                type="submit"
                disabled={isChangingPassword}
                className="btn-primary flex items-center gap-3"
              >
                {isChangingPassword ? (
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <HiOutlineKey className="w-5 h-5" />
                )}
                {isChangingPassword ? 'Changing Password...' : 'Change Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
