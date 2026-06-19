import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ticketService from '../../services/ticketService';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { HiOutlinePlus, HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlineTicket, HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi2';
import { STATUS_COLORS, PRIORITY_COLORS } from '../../config/constants';

const EmployeeTicketList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data } = await ticketService.getTickets({ createdBy: user?.id });
      setTickets(data);
      setError(null);
    } catch (err) {
      setError('Failed to load your tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ticketId) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await ticketService.deleteTicket(ticketId);
        setTickets(prev => prev.filter(t => t.id !== ticketId));
      } catch (err) {
        console.error('Failed to delete ticket', err);
      }
    }
  };

  useEffect(() => {
    if (user?.id) fetchTickets();
  }, [user]);

  const filteredTickets = tickets.filter(t => {
    const matchesFilter = filter === 'all' || t.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={fetchTickets} />;

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Support Requests</h1>
          <p className="text-neutral-500 dark:text-slate-400 mt-1 text-lg">Track and manage your ongoing support tickets</p>
        </div>
        <button 
          onClick={() => navigate('/tickets/new')}
          className="btn-primary flex items-center gap-2 text-lg py-3 px-8 shadow-md"
        >
          <HiOutlinePlus className="w-6 h-6" />
          Create New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatusSummaryCard title="Total" count={tickets.length} color="slate" />
        <StatusSummaryCard title="Open" count={tickets.filter(t => t.status === 'Open').length} color="blue" />
        <StatusSummaryCard title="In Progress" count={tickets.filter(t => t.status === 'In Progress').length} color="amber" />
        <StatusSummaryCard title="Resolved" count={tickets.filter(t => t.status === 'Resolved').length} color="green" />
      </div>

      <div className="card shadow-md">
        <div className="p-6 border-b border-neutral-200 dark:border-slate-700 bg-neutral-50/30 dark:bg-slate-900/20 flex flex-col md:flex-row justify-between gap-6">
          <div className="relative flex-grow max-w-xl">
            <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-slate-400 w-6 h-6" />
            <input 
              type="text" 
              placeholder="Search by ID or subject..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-12 py-3"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-widest">
              <HiOutlineFunnel className="w-5 h-5" />
              Filter
            </div>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input py-2.5 text-sm font-semibold min-w-[160px]"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
              <option value="escalated">Escalated</option>
            </select>
          </div>
        </div>

        {filteredTickets.length === 0 ? (
          <EmptyState 
            title="No tickets found" 
            message={search || filter !== 'all' ? "Try adjusting your filters or search query." : "You haven't submitted any support requests yet."}
            icon={HiOutlineTicket}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 dark:bg-slate-900 text-neutral-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-8 py-5">Ticket ID</th>
                  <th className="px-8 py-5">Subject & Category</th>
                  <th className="px-8 py-5 text-center">Priority</th>
                  <th className="px-8 py-5 text-center">Status</th>
                  <th className="px-8 py-5">Created On</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-slate-700">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                    <td className="px-8 py-6">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md border border-blue-100 dark:border-blue-900/30 uppercase">
                        {ticket.id}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{ticket.title}</div>
                      <div className="text-[10px] font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-widest mt-1">{ticket.category}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest ${PRIORITY_COLORS[ticket.priority]?.bg} ${PRIORITY_COLORS[ticket.priority]?.text} shadow-sm`}>
                          {ticket.priority}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest ${STATUS_COLORS[ticket.status]?.bg} ${STATUS_COLORS[ticket.status]?.text} border border-current/10`}>
                          {ticket.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">
                        {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/tickets/${ticket.id}`)}
                          className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                          title="View Details"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
                          className="p-2 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all"
                          title="Edit Ticket"
                        >
                          <HiOutlinePencil className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(ticket.id)}
                          className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                          title="Delete Ticket"
                        >
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusSummaryCard = ({ title, count, color }) => {
  const colors = {
    slate: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30',
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30',
    green: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30',
  };

  return (
    <div className={`card p-6 border-transparent hover:border-current transition-all group border ${colors[color]}`}>
      <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] mb-2 opacity-70">{title}</p>
      <p className="text-4xl font-black tracking-tighter">{count}</p>
    </div>
  );
};

export default EmployeeTicketList;
