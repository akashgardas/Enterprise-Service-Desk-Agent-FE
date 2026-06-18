import React, { useState, useEffect } from 'react';
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
  HiOutlineCheck
} from 'react-icons/hi2';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'employee',
    department: 'Engineering'
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

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

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                         user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All Roles' || user.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const handleProvision = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    
    try {
      await userService.createUser(newUser);
      setSuccess('User provisioned successfully!');
      setNewUser({
        name: '',
        email: '',
        phone: '',
        role: 'employee',
        department: 'Engineering'
      });
      fetchUsers();
      setTimeout(() => {
        setShowModal(false);
        setSuccess('');
      }, 2000);
    } catch (err) {
      console.error('Failed to provision user', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Administration</h1>
          <p className="text-slate-500 dark:text-slate-300 mt-1 text-lg font-medium">Manage user accounts, permissions, and departmental access.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 py-3 px-8 shadow-xl shadow-blue-600/30">
          <HiOutlineUserPlus className="w-6 h-6" />
          Provision New User
        </button>
      </div>

      <div className="card shadow-xl shadow-slate-200/50">
        <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between gap-6">
          <div className="relative flex-grow max-w-xl">
            <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
            <input 
              type="text" 
              placeholder="Search by name, email, or employee ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-12 py-3 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
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
                        {user.phone}
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
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600 hover:border-blue-500 rounded-xl transition-all shadow-sm">
                        <HiOutlinePencilSquare className="w-5 h-5" />
                      </button>
                      <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-red-600 hover:border-red-500 rounded-xl transition-all shadow-sm">
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6">
                    <EmptyState title="No users found" message="Try broadening your search or filter criteria." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision New User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full border border-neutral-200 dark:border-slate-700">
            <div className="p-8 border-b border-neutral-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Provision New User</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Create a new user account with appropriate permissions</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
                <HiOutlineXMark className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            {success && (
              <div className="px-8 pt-6">
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-2xl text-green-700">
                  <HiOutlineCheck className="w-5 h-5" />
                  <span className="font-bold">{success}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleProvision} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-600 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="input py-3"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-600 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="input py-3"
                    placeholder="john@company.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-600 dark:text-slate-400 uppercase tracking-wider">Phone Number</label>
                  <input 
                    type="tel" 
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className="input py-3"
                    placeholder="+1-555-0100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-600 dark:text-slate-400 uppercase tracking-wider">Department</label>
                  <select 
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
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
                  <label className="text-xs font-bold text-neutral-600 dark:text-slate-400 uppercase tracking-wider">System Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Employee', 'Agent', 'Manager', 'Admin'].map(role => (
                      <button 
                        key={role}
                        type="button"
                        onClick={() => setNewUser({ ...newUser, role: role.toLowerCase() })}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          newUser.role === role.toLowerCase() 
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                            : 'border-neutral-200 dark:border-slate-700'
                        }`}
                      >
                        <p className="font-bold">{role}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
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
                  {saving ? 'Provisioning...' : 'Provision User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
