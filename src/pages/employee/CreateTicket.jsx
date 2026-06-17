import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ticketService from '../../services/ticketService';
import { TICKET_CATEGORIES, TICKET_PRIORITIES } from '../../config/constants';
import { 
  HiOutlineArrowLeft, 
  HiOutlinePaperClip, 
  HiOutlineQuestionMarkCircle,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlineExclamationCircle
} from 'react-icons/hi2';

const CreateTicket = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    priority: 'Low',
  });
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 2000;

  // Simulate auto-save draft
  useEffect(() => {
    const savedDraft = localStorage.getItem('ticket_draft');
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      setFormData(draft);
      setCharCount(draft.description.length);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('ticket_draft', JSON.stringify(formData));
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'description' && value.length > MAX_CHARS) return;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'description') setCharCount(value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await ticketService.createTicket({
        ...formData,
        createdBy: user?.id,
        createdByName: user?.name,
        department: user?.department || 'General Support',
      });
      localStorage.removeItem('ticket_draft');
      navigate('/tickets');
    } catch (err) {
      console.error('Failed to create ticket', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate('/tickets')}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors font-medium"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
          Back to Tickets
        </button>
        <div className="flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-100">
          <HiOutlineShieldCheck className="w-4 h-4" />
          Draft Auto-saved
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Form Column */}
        <div className="flex-grow space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Create Support Ticket</h1>
            <p className="text-text-secondary mt-2 text-lg leading-relaxed">Please provide as much detail as possible to help our agents resolve your issue quickly.</p>
          </div>

          <div className="card shadow-xl shadow-slate-200/50">
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                  <HiOutlineDocumentText className="w-4 h-4 text-primary-500" />
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
                  <label className="text-sm font-bold text-text-primary uppercase tracking-wider">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input py-4 dark:bg-slate-900"
                  >
                    {Object.values(TICKET_CATEGORIES).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-primary uppercase tracking-wider">Priority</label>
                  <select 
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="input py-4 dark:bg-slate-900"
                  >
                    {Object.values(TICKET_PRIORITIES).map(prio => (
                      <option key={prio} value={prio}>{prio}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-text-primary uppercase tracking-wider">Detailed Description</label>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${charCount > MAX_CHARS * 0.9 ? 'text-red-500' : 'text-text-secondary'}`}>
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

              <div className="space-y-2">
                <label className="text-sm font-bold text-text-primary uppercase tracking-wider">Attachments</label>
                <div className="border-2 border-dashed border-border-color rounded-2xl p-10 flex flex-col items-center justify-center bg-bg-secondary dark:bg-slate-900/50 hover:bg-primary-50/30 hover:border-primary-300 transition-all cursor-pointer group">
                  <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-border-color flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <HiOutlinePaperClip className="w-8 h-8 text-primary-500" />
                  </div>
                  <p className="text-base font-bold text-text-primary">Drag & drop files or <span className="text-primary-600">browse</span></p>
                  <p className="text-xs text-text-secondary mt-2 uppercase font-bold tracking-widest">Max 10MB • PNG, JPG, PDF, TXT</p>
                </div>
              </div>

              <div className="pt-4 flex flex-col md:flex-row gap-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-grow text-lg py-4 shadow-xl shadow-primary-600/30"
                >
                  {loading ? 'Submitting...' : 'Submit Support Request'}
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
          <div className="card p-6 bg-slate-900 text-white border-none shadow-xl shadow-slate-900/20">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <HiOutlineExclamationCircle className="w-5 h-5 text-amber-400" />
              Before you submit
            </h3>
            <div className="space-y-4 text-sm text-slate-300">
              <p>Have you tried searching the <a href="/kb" className="text-primary-400 hover:underline">Knowledge Base</a>? 80% of issues are resolved there instantly.</p>
              <div className="h-px bg-slate-800"></div>
              <p>Our AI Assistant can often fix connection and password issues in real-time. <a href="/ai" className="text-primary-400 hover:underline">Try Chat</a></p>
            </div>
          </div>

          <div className="card p-6 border-dashed border-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-4">Priority Guide</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-red-600 uppercase">Critical</p>
                <p className="text-xs text-text-secondary">Entire department or business operation is stopped.</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-orange-500 uppercase">High</p>
                <p className="text-xs text-text-secondary">Work is severely impacted for you or a small group.</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-primary-600 uppercase">Medium</p>
                <p className="text-xs text-text-secondary">Individual productivity is impacted but work can continue.</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase">Low</p>
                <p className="text-xs text-text-secondary">General questions or requests for information.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
