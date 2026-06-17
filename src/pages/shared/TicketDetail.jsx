import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ticketService from '../../services/ticketService';
import Loading from '../../components/common/Loading';
import ErrorState from '../../components/common/ErrorState';
import { 
  HiOutlineArrowLeft, 
  HiOutlineChatBubbleLeftRight, 
  HiOutlinePaperClip, 
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineCheckCircle,
  HiOutlineArrowPath,
  HiOutlineUserGroup,
  HiOutlineHashtag,
  HiOutlineCalendar
} from 'react-icons/hi2';
import { STATUS_COLORS, PRIORITY_COLORS, ROLES } from '../../config/constants';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const { data } = await ticketService.getTicketById(id);
      if (!data) throw new Error('Ticket not found');
      setTicket(data);
    } catch (err) {
      setError(err.message || 'Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const newComment = {
        userId: user.id,
        userName: user.name,
        text: comment,
      };
      await ticketService.addComment(id, newComment);
      setTicket(prev => ({
        ...prev,
        comments: [...prev.comments, { ...newComment, id: Date.now(), createdAt: new Date().toISOString() }]
      }));
      setComment('');
    } catch (err) {
      console.error('Failed to add comment', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await ticketService.updateTicket(id, { status: newStatus });
      setTicket(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  if (loading) return <Loading fullPage />;
  if (error) return <ErrorState message={error} onRetry={fetchTicket} />;
  if (!ticket) return null;

  const isAgentOrManager = hasRole([ROLES.AGENT, ROLES.MANAGER, ROLES.ADMIN]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-all font-bold text-sm uppercase tracking-widest group"
        >
          <div className="p-2 bg-white rounded-xl border border-border-color group-hover:border-blue-500 group-hover:text-blue-600 transition-all">
            <HiOutlineArrowLeft className="w-5 h-5" />
          </div>
          Back to list
        </button>
        <div className="flex flex-wrap gap-3">
          {isAgentOrManager && ticket.status !== 'Resolved' && (
            <>
              <button 
                onClick={() => handleUpdateStatus('In Progress')}
                className="btn-secondary flex items-center gap-2 py-2 px-4 text-sm"
              >
                <HiOutlineArrowPath className="w-4 h-4" />
                In Progress
              </button>
              <button 
                onClick={() => handleUpdateStatus('Resolved')}
                className="btn-primary flex items-center gap-2 py-2 px-6 text-sm bg-green-600 hover:bg-green-700 shadow-green-600/20"
              >
                <HiOutlineCheckCircle className="w-5 h-5" />
                Resolve Ticket
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Ticket Info */}
          <div className="card shadow-xl shadow-slate-200/50">
            <div className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 uppercase tracking-widest">
                      {ticket.id}
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${STATUS_COLORS[ticket.status]?.bg} ${STATUS_COLORS[ticket.status]?.text} border border-current/10`}>
                      {ticket.status}
                    </span>
                  </div>
                  <h1 className="text-3xl font-black text-text-primary tracking-tight leading-tight">
                    {ticket.title}
                  </h1>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] ${PRIORITY_COLORS[ticket.priority]?.bg} ${PRIORITY_COLORS[ticket.priority]?.text} shadow-lg shadow-current/10`}>
                    {ticket.priority} Priority
                  </span>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none text-text-primary text-lg leading-relaxed mb-10">
                <p className="whitespace-pre-wrap">{ticket.description}</p>
              </div>

              {ticket.attachments?.length > 0 && (
                <div className="pt-8 border-t border-border-color">
                  <h4 className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] mb-4">Supporting Documents</h4>
                  <div className="flex flex-wrap gap-4">
                    {ticket.attachments.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-3 px-4 py-3 bg-bg-secondary border border-border-color rounded-2xl text-sm font-bold text-text-primary hover:border-blue-500 hover:text-blue-600 cursor-pointer transition-all group">
                        <HiOutlinePaperClip className="w-5 h-5 text-text-secondary group-hover:text-blue-500 transition-colors" />
                        {file}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity/Comments */}
          <div className="card shadow-xl shadow-slate-200/50">
            <div className="p-6 border-b border-border-color bg-bg-secondary/30 flex items-center justify-between">
              <h3 className="font-black text-text-primary uppercase tracking-widest text-xs flex items-center gap-2">
                <HiOutlineChatBubbleLeftRight className="w-5 h-5 text-blue-500" />
                Communication History
              </h3>
              <span className="text-[10px] font-bold text-text-secondary uppercase bg-white px-2 py-1 rounded-lg border border-border-color">
                {ticket.comments.length} Messages
              </span>
            </div>
            
            <div className="p-8 space-y-8 max-h-[600px] overflow-y-auto bg-slate-50/30">
              {ticket.comments.map((comment) => (
                <div key={comment.id} className={`flex gap-4 ${comment.userId === user.id ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black uppercase shrink-0 text-sm shadow-sm ${
                    comment.userId === user.id ? 'bg-blue-600 text-white' : 'bg-white border border-border-color text-blue-700'
                  }`}>
                    {comment.userName.charAt(0)}
                  </div>
                  <div className={`max-w-[80%] space-y-2 ${comment.userId === user.id ? 'items-end' : ''}`}>
                    <div className="flex items-center gap-3 px-1">
                      <span className="text-xs font-black text-text-primary">{comment.userName}</span>
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                        {new Date(comment.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className={`p-5 rounded-[2rem] text-base leading-relaxed shadow-sm ${
                      comment.userId === user.id 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white border border-border-color text-text-primary rounded-tl-none'
                    }`}>
                      {comment.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-border-color bg-white">
              <form onSubmit={handleAddComment} className="flex gap-4">
                <div className="flex-grow relative">
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Type your response here..."
                    className="input-field py-4 min-h-[100px] resize-none pr-12"
                  ></textarea>
                </div>
                <div className="flex flex-col justify-end">
                  <button 
                    type="submit"
                    disabled={isSubmitting || !comment.trim()}
                    className="btn-primary py-4 px-8 shadow-xl shadow-blue-600/30"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="card p-8 shadow-xl shadow-slate-200/50">
            <h3 className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] mb-8 border-b border-border-color pb-4">
              Ticket Overview
            </h3>
            <div className="space-y-6">
              <DetailRow icon={HiOutlineHashtag} label="Category" value={ticket.category} />
              <DetailRow icon={HiOutlineUserGroup} label="Department" value={ticket.department} />
              <DetailRow icon={HiOutlineCalendar} label="Created" value={new Date(ticket.createdAt).toLocaleDateString()} />
              <DetailRow icon={HiOutlineClock} label="SLA Deadline" value={new Date(ticket.slaDeadline).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })} />
              
              <div className="pt-6 border-t border-border-color">
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-4">Assigned Agent</p>
                <div className="flex items-center gap-4 p-4 bg-bg-secondary rounded-2xl border border-border-color/50">
                  <div className="w-10 h-10 rounded-xl bg-white border border-border-color flex items-center justify-center text-blue-600 font-black shadow-sm">
                    {ticket.assignedTo?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{ticket.assignedTo || 'Unassigned'}</p>
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Support Specialist</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isAgentOrManager && (
            <div className="card bg-slate-900 text-white border-none shadow-2xl shadow-slate-900/40 p-8 relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-600/20 rounded-full blur-[80px] group-hover:bg-blue-500/30 transition-all duration-700"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-blue-500/20 rounded-xl">
                    <HiOutlineSparkles className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="font-black uppercase tracking-widest text-xs">AI Copilot</h3>
                </div>
                <div className="space-y-3">
                  <AIActionButton label="Draft smart response" />
                  <AIActionButton label="Summarize history" />
                  <AIActionButton label="Suggest KB articles" />
                </div>
              </div>
            </div>
          )}

          <div className="card p-8 shadow-xl shadow-slate-200/50">
            <h3 className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] mb-8 border-b border-border-color pb-4">
              Audit Timeline
            </h3>
            <div className="space-y-8">
              {ticket.timeline.map((event, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  {idx !== ticket.timeline.length - 1 && (
                    <div className="absolute left-[9px] top-6 bottom-[-32px] w-0.5 bg-slate-100"></div>
                  )}
                  <div className="w-5 h-5 rounded-full bg-white border-4 border-blue-500 z-10 shrink-0 shadow-sm"></div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-text-primary leading-none">{event.action}</p>
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                      {event.by} • {new Date(event.at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
      <Icon className="w-4 h-4 text-slate-400" />
    </div>
    <div>
      <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-sm font-bold text-text-primary">{value}</p>
    </div>
  </div>
);

const AIActionButton = ({ label }) => (
  <button className="w-full py-3 px-5 bg-white/5 hover:bg-white/10 rounded-2xl text-sm font-bold text-left border border-white/10 transition-all active:scale-[0.98] flex items-center justify-between group">
    {label}
    <HiOutlineArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
  </button>
);

const HiOutlineArrowRight = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export default TicketDetail;
