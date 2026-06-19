
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ticketService from '../../services/ticketService';
import Loading from '../../components/common/Loading';
import { TICKET_CATEGORIES, TICKET_PRIORITIES } from '../../config/constants';
import { 
  HiOutlineArrowLeft, 
  HiOutlinePaperClip, 
  HiOutlineQuestionMarkCircle,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlineExclamationCircle,
  HiOutlineTrash
} from 'react-icons/hi2';

const TicketEditor = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    priority: 'Low',
  });
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 2000;

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const { data } = await ticketService.getTicketById(id);
        setFormData({
          title: data.title,
          description: data.description,
          category: data.category,
          priority: data.priority
        });
        setCharCount(data.description.length);
      } catch (err) {
        console.error('Failed to load ticket', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTicket();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'description' && value.length > MAX_CHARS) return;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'description') setCharCount(value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await ticketService.updateTicket(id, formData);
      navigate('/tickets');
    } catch (err) {
      console.error('Failed to update ticket', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await ticketService.deleteTicket(id);
        navigate('/tickets');
      } catch (err) {
        console.error('Failed to delete ticket', err);
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate('/tickets')}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
          Back to Tickets
        </button>
        <button 
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all font-semibold text-sm border border-red-100 dark:border-red-900/30"
        >
          <HiOutlineTrash className="w-4 h-4" />
          Delete Ticket
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Form Column */}
        <div className="flex-grow space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Edit Ticket</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg leading-relaxed">Update the details of your support ticket.</p>
          </div>

          <div className="card card-3d shadow-xl shadow-slate-200/50">
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <HiOutlineDocumentText className="w-4 h-4 text-blue-500" />
                  Issue Summary
                </label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., VPN connection fails after 10 minutes"
                  className="input text-lg py-4"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input py-4"
                  >
                    {Object.values(TICKET_CATEGORIES).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Priority</label>
                  <select 
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="input py-4"
                  >
                    {Object.values(TICKET_PRIORITIES).map(prio => (
                      <option key={prio} value={prio}>{prio}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Detailed Description</label>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${charCount > MAX_CHARS * 0.9 ? 'text-red-500 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {charCount} / {MAX_CHARS} Characters
                  </span>
                </div>
                <div className="relative">
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="8"
                    placeholder="Describe what happened, any error messages you saw, and steps you've already tried..."
                    className="input py-4 resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="pt-4 flex flex-col md:flex-row gap-4">
                <button 
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-grow text-lg py-4 shadow-xl shadow-blue-600/30"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button"
                  onClick={() => navigate('/tickets')}
                  className="btn-secondary text-lg py-4"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Column */}
        <div className="md:w-80 shrink-0 space-y-6">
          <div className="card card-3d p-6 bg-slate-900 text-white border-none shadow-xl shadow-slate-900/20">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <HiOutlineExclamationCircle className="w-5 h-5 text-amber-400" />
              Before you submit
            </h3>
            <div className="space-y-4 text-sm text-slate-300">
              <p>Have you tried searching the <a href="/kb" className="text-blue-400 hover:underline">Knowledge Base</a>? 80% of issues are resolved there instantly.</p>
              <div className="h-px bg-slate-800"></div>
              <p>Our AI Assistant can often fix connection and password issues in real-time. <a href="/ai" className="text-blue-400 hover:underline">Try Chat</a></p>
            </div>
          </div>

          <div className="card card-3d p-6 border-dashed border-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">Priority Guide</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase">Critical</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Entire department or business operation is stopped.</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-orange-500 dark:text-orange-400 uppercase">High</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Work is severely impacted for you or a small group.</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Medium</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Individual productivity is impacted but work can continue.</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Low</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">General questions or requests for information.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketEditor;
