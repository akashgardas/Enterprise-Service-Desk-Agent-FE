import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ticketService from '../../services/ticketService';
import analyticsService from '../../services/analyticsService';
import activityService from '../../services/activityService';
import userService from '../../services/userService';
import Loading from '../../components/common/Loading';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  HiOutlineTicket,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlinePlus,
  HiOutlineShieldCheck,
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineExclamationTriangle,
  HiOutlineChartBar,
  HiOutlineUserPlus,
  HiOutlineBolt
} from 'react-icons/hi2';

// ─── colour tokens for charts ────────────────────────
const DONUT_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
const AREA_GRADIENT_ID = 'ticketTrend';

// ─── Custom Tooltip ──────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-2xl text-xs">
        <p className="font-black text-white uppercase tracking-widest mb-2">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-bold">
            {p.name}: <span className="text-white">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [activities, setActivities] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ticketsRes, analyticsRes, activitiesRes, usersRes] = await Promise.all([
          ticketService.getTickets(user?.role === 'employee' ? { createdBy: user?.id } : {}),
          analyticsService.getDashboardStats(),
          activityService.getActivities(user),
          userService.getUsers()
        ]);
        setRecentTickets(ticketsRes.data.slice(0, 5));
        setStats(analyticsRes.data);
        setActivities(activitiesRes.data.slice(0, 8));
        setAllUsers(usersRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchDashboardData();
  }, [user]);

  if (loading) return <Loading />;

  // ── derived counts ──────────────────────────────────
  const openCount       = recentTickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length;
  const resolvedCount   = recentTickets.filter(t => t.status === 'Resolved').length;
  const escalatedCount  = recentTickets.filter(t => t.status === 'Escalated').length;
  const employeeCount   = allUsers.filter(u => u.role === 'employee').length;
  const agentCount      = allUsers.filter(u => u.role === 'agent').length;
  const totalUserCount  = allUsers.length;

  const ticketTrendData  = stats?.ticketsByMonth  || [];
  const categoryData     = stats?.ticketsByCategory || [];
  const priorityData     = stats?.ticketsByPriority || [];

  return (
    <div className="space-y-10 animate-fade-in pb-12">

      {/* ── Welcome Header ───────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome back, <span className="text-blue-600">{user?.name.split(' ')[0]}</span>
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
            <HiOutlineSparkles className="w-5 h-5 text-blue-500" />
            Quick AI Chat
          </button>

          {/* Admin → Create User | Others → Create Ticket */}
          {isAdmin ? (
            <button
              onClick={() => navigate('/settings', { state: { openProvisionModal: true } })}
              className="btn-primary flex items-center gap-2 px-6"
            >
              <HiOutlineUserPlus className="w-5 h-5" />
              Create User
            </button>
          ) : (
            <button
              onClick={() => navigate('/tickets/new')}
              className="btn-primary flex items-center gap-2 px-6"
            >
              <HiOutlinePlus className="w-5 h-5" />
              Create Ticket
            </button>
          )}
        </div>
      </div>

      {/* ── Stats Grid — Row 1 (original 3) ─────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Open Requests"
          value={openCount}
          icon={HiOutlineTicket}
          color="blue"
          description="Awaiting resolution"
        />
        <StatCard
          title="Resolved"
          value={resolvedCount}
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

      {/* ── Stats Grid — Row 2 (new cards) ───────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={employeeCount}
          icon={HiOutlineUsers}
          color="indigo"
          description="Active staff"
        />
        <StatCard
          title="Support Agents"
          value={agentCount}
          icon={HiOutlineUserGroup}
          color="purple"
          description="On duty"
        />
        <StatCard
          title="Escalated"
          value={escalatedCount}
          icon={HiOutlineExclamationTriangle}
          color="red"
          description="Needs attention"
        />
        <StatCard
          title="SLA Compliance"
          value={`${stats?.slaCompliance?.percentage ?? 87}%`}
          icon={HiOutlineBolt}
          color="teal"
          description={`${stats?.slaCompliance?.trend > 0 ? '+' : ''}${stats?.slaCompliance?.trend ?? 5}% vs last month`}
        />
      </div>

      {/* ── Charts Row ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Ticket Trend — Area Chart (spans 2 cols) */}
        <div className="lg:col-span-2 card shadow-xl shadow-slate-200/50 dark:shadow-slate-900/40 overflow-visible">
          <div className="card-header flex justify-between items-center">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Ticket Volume Trend</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Created vs Resolved — last 6 months</p>
            </div>
            <HiOutlineChartBar className="w-5 h-5 text-slate-400" />
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={ticketTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 700, paddingTop: 12 }} />
                <Area type="monotone" dataKey="created" name="Created" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gradCreated)" dot={false} activeDot={{ r: 5 }} />
                <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#22c55e" strokeWidth={2.5} fill="url(#gradResolved)" dot={false} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Donut */}
        <div className="card shadow-xl shadow-slate-200/50 dark:shadow-slate-900/40 overflow-visible">
          <div className="card-header">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">By Priority</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">Ticket distribution</p>
          </div>
          <div className="p-6 flex flex-col items-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  dataKey="count"
                  nameKey="priority"
                  paddingAngle={3}
                >
                  {priorityData.map((_, i) => (
                    <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="w-full space-y-2 mt-2">
              {priorityData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                    <span className="font-bold text-slate-600 dark:text-slate-300">{item.priority}</span>
                  </div>
                  <span className="font-black text-slate-800 dark:text-white">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Category Bar Chart ───────────────────────── */}
      <div className="card shadow-xl shadow-slate-200/50 dark:shadow-slate-900/40 overflow-visible">
        <div className="card-header flex justify-between items-center">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Tickets by Category</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">Volume across all service categories</p>
          </div>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Tickets" radius={[6, 6, 0, 0]} maxBarSize={52}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={['#3b82f6', '#8b5cf6', '#f97316', '#22c55e', '#06b6d4'][i % 5]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Activity + AI Card Row ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Activity */}
        <div className="lg:col-span-2 card card-3d shadow-xl shadow-slate-200/50">
          <div className="card-header flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Live Activity Stream</h3>
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/audit-log')}
                className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1"
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
                      act.type === 'security' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30' :
                      act.type === 'ticket'   ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30' :
                      act.type === 'kb'       ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30' :
                      'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700'
                    }`}>
                      {act.user.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
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
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[80px] group-hover:bg-blue-500/30 transition-all duration-700"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-600/30">
              <HiOutlineSparkles className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-black tracking-tight mb-2">Need Instant Help?</h3>
            <p className="text-slate-400 font-medium leading-relaxed mb-8">
              Our AI Assistant can resolve 80% of common IT issues instantly without a ticket.
            </p>
            <div className="space-y-3">
              <button onClick={() => navigate('/ai')} className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20">
                Start AI Consultation
              </button>
              <button onClick={() => navigate('/kb')} className="w-full py-3.5 px-6 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10">
                Browse Solutions
              </button>
            </div>
          </div>
          <div className="relative z-10 mt-8 pt-6 border-t border-white/5 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
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

// ── Stat Card Component ──────────────────────────────
const StatCard = ({ title, value, icon: Icon, color, description }) => {
  const colors = {
    blue:   'text-blue-600   dark:text-blue-400   bg-blue-50   dark:bg-blue-900/20   border-blue-100   dark:border-blue-900/30',
    green:  'text-green-600  dark:text-green-400  bg-green-50  dark:bg-green-900/20  border-green-100  dark:border-green-900/30',
    amber:  'text-amber-600  dark:text-amber-400  bg-amber-50  dark:bg-amber-900/20  border-amber-100  dark:border-amber-900/30',
    indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/30',
    red:    'text-red-600    dark:text-red-400    bg-red-50    dark:bg-red-900/20    border-red-100    dark:border-red-900/30',
    teal:   'text-teal-600   dark:text-teal-400   bg-teal-50   dark:bg-teal-900/20   border-teal-100   dark:border-teal-900/30',
  };

  return (
    <div className={`card card-3d p-6 border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all group ${colors[color]}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-right leading-tight max-w-[80px]">{description}</span>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-slate-600 dark:text-slate-400">{title}</p>
      <p className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">{value}</p>
    </div>
  );
};

export default Dashboard;
