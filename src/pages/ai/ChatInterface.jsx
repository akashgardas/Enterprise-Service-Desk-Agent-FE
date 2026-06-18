import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import aiService from '../../services/aiService';
import { 
  HiOutlinePaperAirplane, 
  HiOutlineSparkles, 
  HiOutlineUser, 
  HiOutlineTrash,
  HiOutlineCheckCircle
} from 'react-icons/hi2';

const ChatInterface = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { 
      id: 'welcome', 
      role: 'ai', 
      text: `Hi ${user?.name.split(' ')[0]}, I'm your Service Desk Assistant. How can I help?`, 
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
        setSuggestedQuestions(data.slice(0, 3));
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
        text: "Sorry, I encountered an error. Please try again or create a ticket.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm('Clear chat history?')) {
      setMessages([messages[0]]);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-sm">
            <HiOutlineSparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Service Desk Assistant</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Online</span>
            </div>
          </div>
        </div>
        <button 
          onClick={clearHistory}
          className="text-xs text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1"
        >
          <HiOutlineTrash className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex-grow card shadow-sm flex flex-col overflow-hidden">
        {/* Messages Area */}
        <div className="flex-grow overflow-y-auto px-4 py-5 space-y-4 scroll-smooth bg-slate-50 dark:bg-slate-900/50">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'ai' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
              }`}>
                {msg.role === 'ai' ? <HiOutlineSparkles className="w-4 h-4" /> : <HiOutlineUser className="w-4 h-4" />}
              </div>
              
              <div className={`max-w-[75%] space-y-1 ${msg.role === 'user' ? 'items-end' : ''}`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'ai' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none border border-slate-100 dark:border-slate-700' 
                    : 'bg-blue-600 text-white rounded-tr-none'
                }`}>
                  {msg.text}
                </div>
                
                {msg.suggestedActions && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.suggestedActions.map((action, i) => (
                    <button 
                      key={i}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                      onClick={() => window.location.href = action.action}
                    >
                      {action.label}
                    </button>
                  ))}
                  </div>
                )}
                
                <div className="flex items-center gap-2 px-1">
                  <span className="text-[10px] text-slate-400">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.role === 'ai' && (
                    <HiOutlineCheckCircle className="w-3 h-3 text-blue-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                <HiOutlineSparkles className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
          {messages.length === 1 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="text-left px-3 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="input flex-grow py-2.5 px-4 text-sm shadow-sm"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-50 active:scale-95"
            >
              <HiOutlinePaperAirplane className="w-4 h-4 rotate-45" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
