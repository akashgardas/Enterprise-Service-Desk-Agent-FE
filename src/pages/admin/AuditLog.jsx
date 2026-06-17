import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import activityService from '../../services/activityService';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { 
  HiOutlineShieldCheck, 
  HiOutlineUser, 
  HiOutlineClock, 
  HiOutlineFunnel,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowPath
} from 'react-icons/hi2';

const AuditLog = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const { data } = await activityService.getActivities(user);
      setActivities(data);
    } catch (err) {
      console.error('Failed to fetch audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filteredActivities = activities.filter(act => {
    const matchesFilter = filter === 'all' || act.type === filter;
    const matchesSearch = act.action.toLowerCase().includes(search.toLowerCase()) || 
                         act.user.toLowerCase().includes(search.toLowerCase()) ||
                         act.detail.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeColor = (type) => {
    switch (type) {
      case 'security': return 'text-red-600 bg-red-50 border-red-100';
      case 'admin': return 'text-purple-600 bg-purple-50 border-purple-100';
      case 'ticket': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'kb': return 'text-green-600 bg-green-50 border-green-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Audit Log</h1>
          <p className="text-slate-500 dark:text-slate-300 mt-1 text-lg font-medium">Global oversight of all platform operations and background activities.</p>
        </div>
        <button 
          onClick={fetchActivities}
          className="btn-secondary flex items-center gap-2"
        >
          <HiOutlineArrowPath className="w-5 h-5" />
          Refresh Logs
        </button>
      </div>

      <div className="card shadow-xl shadow-slate-200/50">
        <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between gap-6">
          <div className="relative flex-grow max-w-xl">
            <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
            <input 
              type="text" 
              placeholder="Search by user, action, or details..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-12 py-3"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <HiOutlineFunnel className="w-5 h-5" />
              Event Category
            </div>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input py-2.5 text-sm font-bold min-w-[180px] bg-white dark:bg-slate-900"
            >
              <option value="all">All Events</option>
              <option value="security">Security</option>
              <option value="admin">Administration</option>
              <option value="ticket">Ticket Ops</option>
              <option value="kb">Knowledge Base</option>
              <option value="ai">AI Interactions</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="table-head">
              <tr>
                <th className="px-8 py-5">Timestamp</th>
                <th className="px-8 py-5">Event Type</th>
                <th className="px-8 py-5">Initiated By</th>
                <th className="px-8 py-5">Action & Detail</th>
                <th className="px-8 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredActivities.length > 0 ? filteredActivities.map((act) => (
                <tr key={act.id} className="table-row group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        {new Date(act.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`badge ${getTypeColor(act.type)}`}>
                      {act.type}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 font-black text-[10px] border border-slate-200">
                        {act.user.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{act.user}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{act.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <p className="text-sm font-black text-slate-900 dark:text-white">{act.action}</p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">{act.detail}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-2.5 py-1 rounded-lg border border-green-100">
                      <HiOutlineShieldCheck className="w-3 h-3" />
                      {act.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5">
                    <EmptyState title="No activity found" message="Try adjusting your filters to see more events." />
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

export default AuditLog;
