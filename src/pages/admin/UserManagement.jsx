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
  HiOutlineEllipsisVertical
} from 'react-icons/hi2';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');

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

  if (loading) return <Loading />;

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Administration</h1>
          <p className="text-slate-500 dark:text-slate-300 mt-1 text-lg font-medium">Manage user accounts, permissions, and departmental access.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 py-3 px-8 shadow-xl shadow-primary-600/30">
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
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary-600 font-black text-sm border border-slate-200 dark:border-slate-700 shadow-sm group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all">
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
                      <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-primary-600 hover:border-primary-500 rounded-xl transition-all shadow-sm">
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
    </div>
  );
};

export default UserManagement;
