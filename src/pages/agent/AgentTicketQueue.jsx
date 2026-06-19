import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ticketService from '../../services/ticketService';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlineAdjustmentsHorizontal, HiOutlineUserCircle, HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi2';
import { STATUS_COLORS, PRIORITY_COLORS, TICKET_CATEGORIES } from '../../config/constants';

const AgentTicketQueue = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    search: ''
  });

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
    const fetchAllTickets = async () => {
      setLoading(true);
      try {
        const { data } = await ticketService.getTickets();
        setTickets(data);
      } catch (error) {
        console.error('Failed to fetch ticket queue', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTickets();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = !filters.status || ticket.status === filters.status;
    const matchesPriority = !filters.priority || ticket.priority === filters.priority;
    const matchesCategory = !filters.category || ticket.category === filters.category;
    const matchesSearch = !filters.search || 
      ticket.title.toLowerCase().includes(filters.search.toLowerCase()) || 
      ticket.id.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesCategory && matchesSearch;
  });

  if (loading) return <Loading />;

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Agent Ticket Queue</h1>
        <p className="text-neutral-500 dark:text-slate-400 mt-1 text-lg">Manage all incoming support requests across the organization</p>
      </div>

      <div className="card shadow-md">
        <div className="p-8 bg-neutral-50 dark:bg-slate-900/50 border-b border-neutral-200 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 relative">
              <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-6 h-6" />
              <input 
                type="text" 
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search ID, title, or user..." 
                className="input pl-12 py-3"
              />
            </div>
            
            <select 
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="input py-3 text-sm font-semibold"
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Escalated">Escalated</option>
            </select>

            <select 
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="input py-3 text-sm font-semibold"
            >
              <option value="">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select 
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="input py-3 text-sm font-semibold"
            >
              <option value="">All Categories</option>
              {Object.values(TICKET_CATEGORIES).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredTickets.length === 0 ? (
          <EmptyState title="No matches found" message="Try adjusting your filters or search query to find tickets." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="table-head">
                <tr>
                  <th className="px-8 py-5">Ticket Info</th>
                  <th className="px-8 py-5 text-center">Priority</th>
                  <th className="px-8 py-5 text-center">Status</th>
                  <th className="px-8 py-5">Assignee</th>
                  <th className="px-8 py-5">SLA Remaining</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-slate-700">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="table-row">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/30 uppercase w-fit mb-2">
                          {ticket.id}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-base line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{ticket.title}</span>
                        <span className="text-[10px] font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                          By {ticket.createdBy} • {ticket.category}
                        </span>
                      </div>
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
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-xs font-extrabold text-blue-700 dark:text-blue-400 shadow-sm border border-blue-200 dark:border-blue-900/30">
                          {ticket.assignedTo?.charAt(0) || '?'}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{ticket.assignedTo || 'Unassigned'}</span>
                          <span className="text-[10px] font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-widest">Support Agent</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {new Date(ticket.slaDeadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                          <span className="text-[10px] text-red-600 dark:text-red-400 font-extrabold uppercase tracking-widest">2h 15m remaining</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/tickets/${ticket.id}`)}
                          className="p-2 bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-xl hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md shadow-sm transition-all"
                          title="View Details"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
                          className="p-2 bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-xl hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 hover:shadow-md shadow-sm transition-all"
                          title="Edit Ticket"
                        >
                          <HiOutlinePencil className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(ticket.id)}
                          className="p-2 bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-xl hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 hover:shadow-md shadow-sm transition-all"
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

export default AgentTicketQueue;
