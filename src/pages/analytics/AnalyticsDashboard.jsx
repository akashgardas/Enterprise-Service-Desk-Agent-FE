import React, { useState, useEffect, useRef } from 'react';
import analyticsService from '../../services/analyticsService';
import Loading from '../../components/common/Loading';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';
import { HiOutlineArrowDownTray, HiOutlineCalendarDays } from 'react-icons/hi2';

const COLORS = ['#0e8ce9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const dashboardRef = useRef(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await analyticsService.getDashboardStats();
        setData(res.data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Helper function to download a file
  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExport = async (format) => {
    if (!data) return;

    if (format === 'CSV') {
      // Export ticket volume as CSV
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'Month,Created,Resolved,Closed\n';
      data.ticketsByMonth.forEach(row => {
        csvContent += `${row.month},${row.created},${row.resolved},${row.closed}\n`;
      });
      downloadFile(csvContent, 'ticket-analytics.csv', 'text/csv');
    } else if (format === 'Excel') {
      // For Excel, we'll use CSV (which Excel can open)
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'Category,Count,Percentage\n';
      data.ticketsByCategory.forEach(row => {
        csvContent += `${row.category},${row.count},${row.percentage}%\n`;
      });
      downloadFile(csvContent, 'ticket-analytics-by-category.csv', 'text/csv');
    } else if (format === 'PDF') {
      // Simple text-based PDF-like export
      let pdfContent = '=== Enterprise Service Desk Analytics Report ===\n\n';
      pdfContent += `Report generated on: ${new Date().toLocaleString()}\n`;
      pdfContent += `Time Range: ${timeRange}\n\n`;
      
      pdfContent += '--- Monthly Ticket Volume ---\n';
      data.ticketsByMonth.forEach(row => {
        pdfContent += `${row.month}: Created ${row.created}, Resolved ${row.resolved}, Closed ${row.closed}\n`;
      });
      
      pdfContent += '\n--- Category Distribution ---\n';
      data.ticketsByCategory.forEach(row => {
        pdfContent += `${row.category}: ${row.count} (${row.percentage}%)\n`;
      });
      
      pdfContent += '\n--- Priority Breakdown ---\n';
      data.ticketsByPriority.forEach(row => {
        pdfContent += `${row.priority}: ${row.count}\n`;
      });
      
      downloadFile(pdfContent, 'ticket-analytics-report.txt', 'text/plain');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Analytics & Insights</h1>
          <p className="text-neutral-500 dark:text-slate-400 mt-1 text-lg">Detailed performance metrics and service trends</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <HiOutlineCalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-slate-400 w-5 h-5" />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input pl-10 py-2.5 text-sm font-semibold pr-10 appearance-none"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>Year to Date</option>
            </select>
          </div>
          <div className="relative group">
            <button className="btn-primary flex items-center gap-2 whitespace-nowrap shadow-md">
              <HiOutlineArrowDownTray className="w-5 h-5" />
              Export Report
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-neutral-200 dark:border-slate-700 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 p-2">
              <button onClick={() => handleExport('PDF')} className="w-full text-left px-4 py-2 text-sm font-bold text-slate-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 rounded-xl transition-colors">Export as PDF</button>
              <button onClick={() => handleExport('Excel')} className="w-full text-left px-4 py-2 text-sm font-bold text-slate-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 rounded-xl transition-colors">Export as Excel (.xlsx)</button>
              <button onClick={() => handleExport('CSV')} className="w-full text-left px-4 py-2 text-sm font-bold text-slate-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 rounded-xl transition-colors">Export as CSV</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Tickets" value="1,284" change="+12.5%" isPositive />
        <MetricCard title="Avg. Resolution" value="14.2h" change="-1.5h" isPositive />
        <MetricCard title="SLA Compliance" value="94.2%" change="+2.1%" isPositive />
        <MetricCard title="Customer Satisfaction" value="4.8/5" change="-0.1" isPositive={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ticket Volume Over Time */}
        <div className="card p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Monthly Ticket Volume</h3>
            <span className="text-xs font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-widest">Trend Analysis</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.ticketsByMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} 
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ fontWeight: 700 }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" name="Created" dataKey="created" stroke="#0e8ce9" strokeWidth={4} dot={{r: 0}} activeDot={{r: 6, strokeWidth: 0}} />
                <Line type="monotone" name="Resolved" dataKey="resolved" stroke="#10b981" strokeWidth={4} dot={{r: 0}} activeDot={{r: 6, strokeWidth: 0}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tickets by Category */}
        <div className="card p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Category Distribution</h3>
            <span className="text-xs font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-widest">Volume by Team</span>
          </div>
          <div className="h-80 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.ticketsByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="count"
                  nameKey="category"
                  stroke="none"
                >
                  {data?.ticketsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tickets by Priority */}
        <div className="card p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Priority Breakdown</h3>
            <span className="text-xs font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-widest">Urgency Levels</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.ticketsByPriority}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="priority" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} 
                  dx={-10}
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc', radius: 8}}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="count" fill="#0e8ce9" radius={[8, 8, 0, 0]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SLA Compliance Summary */}
        <div className="card p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">SLA Compliance</h3>
            <span className="text-xs font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-widest">Target Monitoring</span>
          </div>
          <div className="space-y-10 py-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-1">Overall Compliance</p>
                <p className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tighter">{data?.slaCompliance.percentage}%</p>
              </div>
              <div className={`px-4 py-2 rounded-2xl text-xs font-bold ${data?.slaCompliance.trend > 0 ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                {data?.slaCompliance.trend > 0 ? '↑' : '↓'} {Math.abs(data?.slaCompliance.trend)}% vs last month
              </div>
            </div>
            
            <div className="space-y-6">
              <SLAProgressBar label="Resolution Time Target" percentage={87} color="bg-green-500" />
              <SLAProgressBar label="Initial Response Target" percentage={94} color="bg-blue-500" />
              <SLAProgressBar label="Critical Issue Target" percentage={100} color="bg-purple-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, change, isPositive }) => (
  <div className="card p-6 border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 transition-all group">
    <p className="text-xs font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-widest mb-2">{title}</p>
    <div className="flex items-end justify-between">
      <p className="text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{value}</p>
      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isPositive ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
        {change}
      </span>
    </div>
  </div>
);

const SLAProgressBar = ({ label, percentage, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">{label}</span>
      <span className="font-extrabold text-slate-900 dark:text-white">{percentage}%</span>
    </div>
    <div className="w-full bg-neutral-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden border border-neutral-200/50 dark:border-slate-700/50">
      <div className={`${color} h-3 rounded-full transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }}></div>
    </div>
  </div>
);

export default AnalyticsDashboard;
