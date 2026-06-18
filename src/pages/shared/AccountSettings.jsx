import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineUser, HiOutlineAtSymbol, HiOutlinePhone, HiOutlineBuildingOffice, HiOutlineShieldCheck, HiOutlineExclamationCircle, HiOutlineCheck } from 'react-icons/hi2';

const AccountSettings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    department: user?.department || 'General Support'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSuccess('Account settings updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Account Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Manage your profile and preferences</p>
      </div>

      <div className="card card-3d shadow-xl shadow-slate-200/50">
        <div className="card-header">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Profile Information</h3>
        </div>
        <form onSubmit={handleSave} className="p-8 space-y-6">
          {success && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400 rounded-2xl flex items-center gap-3">
              <HiOutlineShieldCheck className="w-6 h-6" />
              <span className="font-semibold">{success}</span>
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
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="input pl-12 py-4"
                  placeholder="name@company.com"
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
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="input pl-12 py-4"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ml-1">Department</label>
              <div className="relative">
                <HiOutlineBuildingOffice className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="input pl-12 py-4"
                >
                  <option value="General Support">General Support</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
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
              {isSaving ? 'Saving Changes' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;
