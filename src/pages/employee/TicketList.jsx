import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ticketService from '../../services/ticketService';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { HiOutlinePlus, HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlineTicket } from 'react-icons/hi2';
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
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Support Requests</h1>
          <p className="text-text-secondary mt-1 text-lg">Track and manage your ongoing support tickets</p>
        </div>
        <button 
          onClick={() => navigate('/tickets/new')}
          className="btn-primary flex items-center gap-2 text-lg py-3 px-8 shadow-xl shadow-blue-600/30"
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

      <div className="card shadow-xl shadow-slate-200/50">
        <div className="p-6 border-b border-border-color bg-bg-secondary/30 flex flex-col md:flex-row justify-between gap-6">
          <div className="relative flex-grow max-w-xl">
            <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-6 h-6" />
            <input 
              type="text" 
              placeholder="Search by ID or subject..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-12 py-3"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-bold text-text-secondary uppercase tracking-widest">
              <HiOutlineFunnel className="w-5 h-5" />
              Filter
            </div>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input py-2.5 text-sm font-semibold min-w-[160px] bg-white dark:bg-slate-900"
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
              <thead className="bg-bg-secondary/50 text-text-secondary text-[10px] uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-8 py-5">Ticket ID</th>
                  <th className="px-8 py-5">Subject & Category</th>
                  <th className="px-8 py-5 text-center">Priority</th>
                  <th className="px-8 py-5 text-center">Status</th>
                  <th className="px-8 py-5">Created On</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 uppercase">
                        {ticket.id}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-bold text-text-primary text-base group-hover:text-blue-600 transition-colors line-clamp-1">{ticket.title}</div>
                      <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-1">{ticket.category}</div>
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
                      <div className="text-sm font-semibold text-text-primary">
                        {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1">
                        {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                        className="text-blue-600 font-bold hover:text-blue-700 text-sm hover:underline transition-all"
                      >
                        View Details
                      </button>
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
    slate: 'text-slate-600 bg-slate-50 border-slate-100',
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
    green: 'text-green-600 bg-green-50 border-green-100',
  };

  return (
    <div className={`card p-6 border-transparent hover:border-current transition-all group border ${colors[color]}`}>
      <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] mb-2 opacity-70">{title}</p>
      <p className="text-4xl font-black tracking-tighter">{count}</p>
    </div>
  );
};

export default EmployeeTicketList;
