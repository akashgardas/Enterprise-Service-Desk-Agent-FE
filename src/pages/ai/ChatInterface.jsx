import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import aiService from '../../services/aiService';
import { 
  HiOutlinePaperAirplane, 
  HiOutlineSparkles, 
  HiOutlineUser, 
  HiOutlineQuestionMarkCircle,
  HiOutlineArrowRight,
  HiOutlineTrash,
  HiOutlineShieldCheck
} from 'react-icons/hi2';

const ChatInterface = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { 
      id: 'welcome', 
      role: 'ai', 
      text: `Good day, ${user?.name.split(' ')[0]}. I am your Enterprise Service Desk Assistant. How may I facilitate your technical requests today?`, 
      timestamp: new Date().toISOString() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const { data } = await aiService.getSuggestedQuestions();
        setSuggestedQuestions(data.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch suggestions', error);
      }
    };
    fetchSuggestions();
  }, []);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const { data } = await aiService.sendMessage(text, messages);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: data.text,
        timestamp: data.timestamp,
        suggestedActions: data.suggestedActions
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => [...prev, {
        id: 'error',
        role: 'ai',
        text: "System communication error. Please attempt your request again or escalate via a support ticket.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm('Clear current consultation history?')) {
      setMessages([messages[0]]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] animate-fade-in pb-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
            <HiOutlineSparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">AI Support Terminal</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active • Secure Encryption</span>
            </div>
          </div>
        </div>
        <button 
          onClick={clearHistory}
          className="btn-secondary py-2 px-4 text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 hover:text-red-600 hover:border-red-100 transition-all"
        >
          <HiOutlineTrash className="w-4 h-4" />
          Reset Session
        </button>
      </div>

      <div className="flex-grow card shadow-2xl shadow-slate-200/60 flex flex-col overflow-hidden border-none bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex-grow overflow-y-auto px-8 py-10 space-y-10 scroll-smooth">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex items-start gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : 'animate-slide-in'}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xl ${
                msg.role === 'ai' 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-blue-600 text-white'
              }`}>
                {msg.role === 'ai' ? <HiOutlineSparkles className="w-6 h-6" /> : <HiOutlineUser className="w-6 h-6" />}
              </div>
              
              <div className={`max-w-[70%] space-y-3 ${msg.role === 'user' ? 'items-end' : ''}`}>
                <div className={`p-6 rounded-[2rem] text-lg leading-relaxed shadow-xl ${
                  msg.role === 'ai' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none border border-slate-100 dark:border-slate-700' 
                    : 'bg-blue-600 text-white rounded-tr-none'
                }`}>
                  {msg.text}
                </div>
                
                {msg.suggestedActions && (
                  <div className="flex flex-wrap gap-3 mt-6">
                    {msg.suggestedActions.map((action, i) => (
                      <button 
                        key={i}
                        className="px-5 py-2.5 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-2xl text-sm font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center gap-2 shadow-sm"
                        onClick={() => window.location.href = action.action}
                      >
                        {action.label}
                        <HiOutlineArrowRight className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-2 px-2">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.role === 'ai' && (
                    <div className="flex items-center gap-1 text-[10px] text-green-600 font-black uppercase tracking-widest bg-green-50 dark:bg-green-900/10 px-2 py-0.5 rounded-lg">
                      <HiOutlineShieldCheck className="w-3 h-3" />
                      Verified
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start gap-5 animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xl">
                <HiOutlineSparkles className="w-6 h-6" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-[2rem] rounded-tl-none shadow-xl flex gap-1.5 items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-8 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
          {messages.length === 1 && (
            <div className="mb-8 animate-fade-in">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-5 flex items-center gap-2">
                <HiOutlineQuestionMarkCircle className="w-5 h-5 text-blue-500" />
                Common Inquiries
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="text-left p-5 bg-slate-50 dark:bg-slate-900/50 hover:bg-blue-600 dark:hover:bg-blue-600 border border-slate-200 dark:border-slate-700 hover:border-blue-600 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-white transition-all group flex items-center justify-between"
                  >
                    <span>{q}</span>
                    <HiOutlineArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative flex items-center gap-4"
          >
            <div className="relative flex-grow">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Submit your technical query (e.g., 'How do I authenticate via VPN?')"
                className="input pl-8 pr-20 py-5 text-lg shadow-xl shadow-slate-100/50 dark:shadow-none bg-slate-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <span className={`text-[10px] font-black uppercase tracking-widest ${input.length > 0 ? 'text-blue-600' : 'text-slate-300'}`}>
                  {input.length} chars
                </span>
              </div>
            </div>
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] transition-all shadow-2xl shadow-blue-600/40 disabled:opacity-50 disabled:shadow-none active:scale-95 shrink-0"
            >
              <HiOutlinePaperAirplane className="w-8 h-8 rotate-45" />
            </button>
          </form>
          <div className="mt-5 flex justify-center items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em]">
              Confidentiality Enforced • Corporate Policy Compliant
            </p>
            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
