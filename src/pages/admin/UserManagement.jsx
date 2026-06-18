import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import userService from '../../services/userService';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { 
  HiOutlineUserPlus, 
  HiOutlinePencilSquare, 
  HiOutlineTrash, 
  HiOutlineEnvelope, 
  HiOutlinePhone,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineEllipsisVertical,
  HiOutlineXMark,
  HiOutlineCheck,
  HiOutlineKey,
  HiOutlineLockOpen,
  HiOutlineLockClosed
} from 'react-icons/hi2';

const UserManagement = () => {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [showModal, setShowModal] = useState(null); // 'provision', 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'employee',
    department: 'Engineering',
    status: 'active'
  });
  const [editingUser, setEditingUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setNewUser({
      name: '',
      email: '',
      phone: '',
      role: 'employee',
      department: 'Engineering',
      status: 'active'
    });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      department: user.department || 'Engineering',
      status: user.status || 'active'
    });
    setShowModal(true);
  };

  useEffect(() => {
    if (location.state?.openProvisionModal) {
      openCreateModal();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                         user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All Roles' || user.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    
    try {
      if (showModal === 'edit' && selectedUser) {
        await userService.updateUser(selectedUser.id, formData);
        setSuccess('User updated successfully!');
      } else {
        await userService.createUser(formData);
        setSuccess('User provisioned successfully!');
      }
      fetchUsers();
      setTimeout(() => {
        setShowModal(null);
        setSelectedUser(null);
        setSuccess('');
        setEditingUser(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to save user', err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      department: user.department
    });
    setShowModal('edit');
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(userId);
        fetchUsers();
      } catch (err) {
        console.error('Failed to delete user', err);
      }
    }
  };

  const handleResetPassword = async (userId) => {
    try {
      const { data } = await userService.resetUserPassword(userId);
      alert(`Password reset successfully! Temporary password: ${data.tempPassword}`);
      setShowResetConfirm(null);
    } catch (err) {
      console.error('Failed to reset password', err);
    }
  };

  const handleTogglePermission = async (userId, canReset) => {
    try {
      await userService.toggleResetPermission(userId, canReset);
      fetchUsers();
    } catch (err) {
      console.error('Failed to toggle permission', err);
    }
  };

  const openProvisionModal = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'employee',
      department: 'Engineering'
    });
    setShowModal('provision');
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Administration</h1>
          <p className="text-slate-500 dark:text-slate-300 mt-2 text-lg font-medium">Manage user accounts, permissions, and departmental access.</p>
        </div>
        <button onClick={openProvisionModal} className="btn-primary flex items-center gap-2 py-3 px-8 shadow-xl shadow-blue-600/30">
          <HiOutlineUserPlus className="w-6 h-6" />
          Provision New User
        </button>
      </div>

      <div className="card shadow-xl shadow-slate-200/50">
        <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between gap-6">
          <div className="relative flex-grow max-w-xl">
            <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name, email, or employee ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-12 py-3 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <HiOutlineFunnel className="w-5 h-5" />
              Filter By Role
            </div>
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input py-2.5 text-sm font-bold min-w-[180px] bg-white dark:bg-slate-900 shadow-sm"
            >
              <option>All Roles</option>
              <option>Admin</option>
              <option>Manager</option>
              <option>Agent</option>
              <option>Employee</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="table-head">
              <tr>
                <th className="px-8 py-5">User Profile</th>
                <th className="px-8 py-5">Contact Information</th>
                <th className="px-8 py-5 text-center">System Role</th>
                <th className="px-8 py-5">Department</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-center">Reset Permission</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user.id} className="table-row group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-blue-600 font-black text-sm border border-slate-200 dark:border-slate-700 shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-base leading-none mb-1">{user.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                        <HiOutlineEnvelope className="w-4 h-4 text-slate-400" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                        <HiOutlinePhone className="w-4 h-4 text-slate-400" />
                        {user.phone || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <span className={`badge ${
                        user.role === 'admin' ? 'badge-red' : 
                        user.role === 'manager' ? 'badge-blue' : 
                        user.role === 'agent' ? 'badge-green' : 
                        'badge-slate'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-700 dark:text-slate-300">
                    {user.department}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${user.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                        <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-600 animate-pulse' : 'bg-red-600'}`}></span>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleTogglePermission(user.id, !user.canResetPassword)}
                        className={`p-2 rounded-lg border transition-all ${
                          user.canResetPassword 
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' 
                            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                        }`}
                      >
                        {user.canResetPassword ? <HiOutlineLockOpen className="w-5 h-5" /> : <HiOutlineLockClosed className="w-5 h-5" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(user)}
                        className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600 hover:border-blue-500 rounded-xl transition-all shadow-sm"
                        title="Edit User"
                      >
                        <HiOutlinePencilSquare className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setShowResetConfirm(user.id)}
                        className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-amber-600 hover:border-amber-500 rounded-xl transition-all shadow-sm"
                        title="Reset Password"
                      >
                        <HiOutlineKey className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-red-600 hover:border-red-500 rounded-xl transition-all shadow-sm"
                        title="Delete User"
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7">
                    <EmptyState title="No users found" message="Try broadening your search or filter criteria." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-700">
            <div className="p-8 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {showModal === 'edit' ? 'Edit User' : 'Provision New User'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  {showModal === 'edit' ? 'Update user information' : 'Create a new user account'}
                </p>
              </div>
              <button onClick={() => setShowModal(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
                <HiOutlineXMark className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            {success && (
              <div className="px-8 pt-6">
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-2xl text-green-700 dark:text-green-400">
                  <HiOutlineCheck className="w-5 h-5" />
                  <span className="font-semibold">{success}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input py-3"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input py-3"
                    placeholder="john@company.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input py-3"
                    placeholder="+1-555-0100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ml-1">Department</label>
                  <select 
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="input py-3"
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
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ml-1">System Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Employee', 'Agent', 'Manager', 'Admin'].map(role => (
                      <button 
                        key={role}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: role.toLowerCase() })}
                        className={`p-4 rounded-2xl border-2 transition-all text-left ${
                          formData.role === role.toLowerCase() 
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {editingUser && (
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-neutral-600 dark:text-slate-400 uppercase tracking-wider">Account Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'active', label: 'Active', color: 'border-green-600 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
                        { value: 'inactive', label: 'Inactive', color: 'border-red-600 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' }
                      ].map(statusOption => (
                        <button
                          key={statusOption.value}
                          type="button"
                          onClick={() => setNewUser({ ...newUser, status: statusOption.value })}
                          className={`py-2.5 px-3 rounded-xl border-2 text-center font-bold text-xs transition-all ${
                            newUser.status === statusOption.value 
                              ? statusOption.color
                              : 'border-neutral-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {statusOption.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(null)}
                  className="btn-secondary flex-1"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : (showModal === 'edit' ? 'Update User' : 'Provision User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Confirmation */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-700 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Reset Password</h2>
              <button onClick={() => setShowResetConfirm(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
                <HiOutlineXMark className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-8">
              Are you sure you want to reset this user's password? They will receive a temporary password.
            </p>
            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={() => setShowResetConfirm(null)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleResetPassword(showResetConfirm)}
                className="btn-primary flex-1"
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
