import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ticketService from '../../services/ticketService';
import analyticsService from '../../services/analyticsService';
import Loading from '../../components/common/Loading';
import { HiOutlineTicket, HiOutlineClock, HiOutlineCheckBadge, HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AgentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ticketsRes, analyticsRes] = await Promise.all([
          ticketService.getTickets({ assignedTo: user?.id }),
          analyticsService.getDashboardStats()
        ]);
        setRecentTickets(ticketsRes.data.slice(0, 5));
        setStats(analyticsRes.data);
      } catch (error) {
        console.error('Failed to fetch agent dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchDashboardData();
  }, [user]);

  if (loading) return <Loading />;

  const agentPerformance = stats?.agentPerformance?.find(a => a.id === user?.id) || {
    ticketsResolved: 24,
    avgResolutionHours: 15.5,
    slaCompliance: 92,
    satisfaction: 4.8
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Agent Dashboard</h1>
        <p className="text-neutral-500 dark:text-slate-400">Welcome back, {user?.name}. Here's your performance overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Assigned Tickets" 
          value={recentTickets.length} 
          icon={HiOutlineTicket} 
          color="blue"
        />
        <StatCard 
          title="Resolved (MTD)" 
          value={agentPerformance.ticketsResolved} 
          icon={HiOutlineCheckBadge} 
          color="green"
        />
        <StatCard 
          title="Avg. Resolution" 
          value={`${agentPerformance.avgResolutionHours}h`} 
          icon={HiOutlineClock} 
          color="amber"
        />
        <StatCard 
          title="SLA Compliance" 
          value={`${agentPerformance.slaCompliance}%`} 
          icon={HiOutlineChatBadge} 
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Ticket Volume Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.ticketsByMonth}>
                <defs>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="created" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCreated)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {stats?.recentActivity?.slice(0, 6).map((activity, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{activity.action}</p>
                  <p className="text-xs text-neutral-500 dark:text-slate-400 mb-1">{activity.detail}</p>
                  <p className="text-[10px] text-neutral-500 dark:text-slate-400 uppercase font-bold">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="card p-6 flex items-center gap-4">
      <div className={`p-4 rounded-xl ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-neutral-500 dark:text-slate-400 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
};

const HiOutlineChatBadge = (props) => (
  <HiOutlineChatBubbleLeftRight {...props} />
);

export default AgentDashboard;
