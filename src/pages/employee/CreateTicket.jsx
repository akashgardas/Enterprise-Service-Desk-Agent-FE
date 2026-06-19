import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
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
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    priority: 'Low',
  });
  const [charCount, setCharCount] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const MAX_CHARS = 2000;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'application/pdf', 'text/plain'];

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

  const handleFileSelect = (files) => {
    const newFiles = Array.from(files).filter(file => {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        alert(`File "${file.name}" is too large. Max size is 10MB.`);
        return false;
      }
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert(`File "${file.name}" is not an allowed type. Allowed types: PNG, JPG, PDF, TXT.`);
        return false;
      }
      return true;
    }).map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Here you would typically upload the files to a server first
      // For now, we'll just log them
      console.log('Uploaded files:', uploadedFiles);
      
      await ticketService.createTicket({
        ...formData,
        createdBy: user?.id,
        createdByName: user?.name,
        department: user?.department || 'General Support',
        // attachments: uploadedFiles.map(f => f.file), // You would need to handle FormData for actual upload
      });
      addToast('Ticket created successfully!', 'success');
      localStorage.removeItem('ticket_draft');
      navigate('/tickets');
    } catch (err) {
      console.error('Failed to create ticket', err);
      addToast('Failed to create ticket', 'error');
    } finally {
      setLoading(false);
    }
  };

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
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-widest bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full border border-green-100 dark:border-green-900/30">
          <HiOutlineShieldCheck className="w-4 h-4" />
          Draft Auto-saved
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Form Column */}
        <div className="flex-grow space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create Support Ticket</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg leading-relaxed">Please provide as much detail as possible to help our agents resolve your issue quickly.</p>
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

              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Attachments</label>
                <div 
                  className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer group ${
                    isDragging 
                      ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-900/10' 
                      : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 hover:bg-blue-50/30 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                  onClick={() => document.getElementById('file-upload').click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input 
                    id="file-upload" 
                    type="file" 
                    multiple 
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    accept=".png,.jpg,.jpeg,.pdf,.txt"
                  />
                  <div className={`w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border flex items-center justify-center mb-4 transition-transform ${
                    isDragging ? 'scale-110 border-blue-500' : 'border-slate-200 dark:border-slate-700 group-hover:scale-110'
                  }`}>
                    <HiOutlinePaperClip className="w-8 h-8 text-blue-500" />
                  </div>
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    Drag & drop files or <span className="text-blue-600 dark:text-blue-400">browse</span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 uppercase font-bold tracking-widest">
                    Max 10MB • PNG, JPG, PDF, TXT
                  </p>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-3">
                    {uploadedFiles.map((uploadedFile) => (
                      <div 
                        key={uploadedFile.id}
                        className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          {uploadedFile.preview ? (
                            <img 
                              src={uploadedFile.preview} 
                              alt={uploadedFile.file.name}
                              className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                              <HiOutlineDocumentText className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-xs">
                              {uploadedFile.file.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(uploadedFile.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 flex flex-col md:flex-row gap-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-grow text-lg py-4 shadow-xl shadow-blue-600/30"
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

export default CreateTicket;
