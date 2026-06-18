import React, { useState } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineQuestionMarkCircle, HiOutlineDocumentText, HiOutlineChatBubbleOvalLeftEllipsis, HiOutlineShieldCheck } from 'react-icons/hi2';

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const helpTopics = [
    {
      id: 1,
      title: 'How to create a support ticket',
      description: 'Step-by-step guide to submitting a new ticket',
      icon: HiOutlineDocumentText,
      category: 'Tickets'
    },
    {
      id: 2,
      title: 'Password reset guide',
      description: 'Resetting your account password made easy',
      icon: HiOutlineShieldCheck,
      category: 'Account'
    },
    {
      id: 3,
      title: 'Using the AI assistant',
      description: 'Get help from our AI support agent',
      icon: HiOutlineChatBubbleOvalLeftEllipsis,
      category: 'AI'
    },
    {
      id: 4,
      title: 'Knowledge base usage',
      description: 'Searching and using our knowledge articles',
      icon: HiOutlineQuestionMarkCircle,
      category: 'Knowledge Base'
    }
  ];

  const filteredTopics = helpTopics.filter(topic => 
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    topic.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="text-center">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Help Center</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">Find answers to common questions</p>
      </div>

      <div className="card card-3d shadow-xl shadow-slate-200/50">
        <div className="p-8">
          <div className="relative">
            <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search for help topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-14 py-5 text-lg"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTopics.map((topic) => (
          <div key={topic.id} className="card card-3d p-6 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <topic.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 block">
                  {topic.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{topic.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{topic.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card card-3d bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-xl shadow-blue-500/30 p-8 text-center">
        <h2 className="text-2xl font-black mb-3">Still need help?</h2>
        <p className="text-white/90 mb-6">Contact our support team or use our AI assistant for instant help.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-sm">
            Contact Support
          </button>
          <button className="px-6 py-3 bg-white/20 border border-white/30 font-bold rounded-xl hover:bg-white/30 transition-all">
            Open AI Assistant
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
