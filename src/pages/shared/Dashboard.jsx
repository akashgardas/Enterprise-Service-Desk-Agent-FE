import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ticketService from '../../services/ticketService';
import analyticsService from '../../services/analyticsService';
import activityService from '../../services/activityService';
import Loading from '../../components/common/Loading';
import { 
  HiOutlineTicket, 
  HiOutlineCheckCircle, 
  HiOutlineClock, 
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlinePlus,
  HiOutlineShieldCheck
} from 'react-icons/hi2';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ticketsRes, analyticsRes, activitiesRes] = await Promise.all([
          ticketService.getTickets(user?.role === 'employee' ? { createdBy: user?.id } : {}),
          analyticsService.getDashboardStats(),
          activityService.getActivities(user)
        ]);
        setRecentTickets(ticketsRes.data.slice(0, 5));
        setStats(analyticsRes.data);
        setActivities(activitiesRes.data.slice(0, 8));
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchDashboardData();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome back, <span className="text-primary-600">{user?.name.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-300 mt-2 text-lg font-medium">
            Here's what's happening with your support tickets today.
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/ai')}
            className="btn-secondary flex items-center gap-2 px-6 shadow-sm"
          >
            <HiOutlineSparkles className="w-5 h-5 text-primary-500" />
            Quick AI Chat
          </button>
          <button 
            onClick={() => navigate('/tickets/new')}
            className="btn-primary flex items-center gap-2 px-6"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Create Ticket
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          title="Open Requests" 
          value={recentTickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length} 
          icon={HiOutlineTicket} 
          color="blue"
          description="Awaiting resolution"
        />
        <StatCard 
          title="Resolved" 
          value={recentTickets.filter(t => t.status === 'Resolved').length} 
          icon={HiOutlineCheckCircle} 
          color="green"
          description="Past 30 days"
        />
        <StatCard 
          title="Avg. Wait Time" 
          value="2.4h" 
          icon={HiOutlineClock} 
          color="amber"
          description="Current average"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* System Activity Monitor */}
        <div className="lg:col-span-2 card card-3d shadow-xl shadow-slate-200/50">
          <div className="card-header flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Live Activity Stream</h3>
            {user?.role === 'admin' && (
              <button 
                onClick={() => navigate('/audit-log')}
                className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                Full Audit Log <HiOutlineArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="p-0">
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {activities.length > 0 ? activities.map((act) => (
                <div key={act.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-sm border ${
                      act.type === 'security' ? 'bg-red-50 text-red-600 border-red-100' :
                      act.type === 'ticket' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      act.type === 'kb' ? 'bg-green-50 text-green-600 border-green-100' :
                      'bg-slate-50 text-slate-600 border-slate-100'
                    }`}>
                      {act.user.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
                        {act.action} <span className="text-slate-400 font-medium">by</span> {act.user}
                      </p>
                      <p className="text-xs font-medium text-slate-500 line-clamp-1">{act.detail}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] font-black uppercase text-green-600">
                      <HiOutlineShieldCheck className="w-3 h-3" />
                      {act.status}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="p-20 text-center text-slate-400 font-medium">No system activity monitored in this scope</div>
              )}
            </div>
          </div>
        </div>

        {/* AI Shortcut Card */}
        <div className="card card-3d bg-slate-900 text-white border-none shadow-2xl shadow-slate-900/30 p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary-500/20 rounded-full blur-[80px] group-hover:bg-primary-500/30 transition-all duration-700"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-primary-600/20 rounded-2xl flex items-center justify-center mb-6 border border-primary-600/30">
              <HiOutlineSparkles className="w-6 h-6 text-primary-400" />
            </div>
            <h3 className="text-2xl font-black tracking-tight mb-2">Need Instant Help?</h3>
            <p className="text-slate-400 font-medium leading-relaxed mb-8">
              Our AI Assistant can resolve 80% of common IT issues instantly without a ticket.
            </p>
            <div className="space-y-3">
              <button onClick={() => navigate('/ai')} className="w-full py-3.5 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-primary-600/20">
                Start AI Consultation
              </button>
              <button onClick={() => navigate('/kb')} className="w-full py-3.5 px-6 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10">
                Browse Solutions
              </button>
            </div>
          </div>
          <div className="relative z-10 mt-8 pt-6 border-t border-white/5 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] font-black">AI</div>
              ))}
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Powered by Enterprise AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, description }) => {
  const colors = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100 shadow-blue-600/5',
    green: 'text-green-600 bg-green-50 border-green-100 shadow-green-600/5',
    amber: 'text-amber-600 bg-amber-50 border-amber-100 shadow-amber-600/5',
  };

  return (
    <div className={`card card-3d p-8 border-transparent hover:border-slate-200 transition-all group ${colors[color]}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{description}</span>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-70">{title}</p>
      <p className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">{value}</p>
    </div>
  );
};

export default Dashboard;
