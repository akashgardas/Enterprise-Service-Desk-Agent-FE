import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HiOutlineBell, 
  HiOutlineMagnifyingGlass, 
  HiOutlineUserCircle, 
  HiOutlineSun, 
  HiOutlineMoon,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineQuestionMarkCircle,
  HiOutlineKey,
  HiOutlineXMark,
  HiOutlineCog6Tooth,
  HiOutlineBars3,
  HiOutlineTicket,
  HiOutlineDocumentText,
  HiOutlineArrowUpRight
} from 'react-icons/hi2';
import notificationService from '../../services/notificationService';
import userService from '../../services/userService';
import ticketService from '../../services/ticketService';
import kbService from '../../services/kbService';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../components/common/Toast';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [lastShownUnreadCount, setLastShownUnreadCount] = useState(0);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  
  // Password Change State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ old: '', new: '', confirm: '' });
  const [passwordStatus, setPasswordStatus] = useState({ loading: false, error: '', success: '' });

  // Refs for closing dropdowns when clicking outside
  const searchRef = useRef(null);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await notificationService.getNotifications(user?.id);
        setNotifications(data);
        const unread = data.filter(n => !n.read).length;
        setUnreadCount(unread);
        // If there are unread notifications and it's higher than last shown, show toast!
        if (unread > 0 && unread > lastShownUnreadCount) {
          addToast(`You have ${unread} new notification${unread === 1 ? '' : 's'}!`, 'info');
          setLastShownUnreadCount(unread);
        }
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };

    if (user?.id) fetchNotifications();
  }, [user, addToast, lastShownUnreadCount]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setIsSearchOpen(false);
        return;
      }

      setSearching(true);
      try {
        // Fetch tickets and articles in parallel
        const [ticketsRes, articlesRes] = await Promise.all([
          ticketService.getTickets(),
          kbService.getArticles()
        ]);

        const q = searchQuery.toLowerCase();
        
        // Filter tickets
        const tickets = ticketsRes.data.filter(t => 
          t.title.toLowerCase().includes(q) || 
          t.description.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
        ).map(t => ({ ...t, type: 'ticket' }));

        // Filter articles
        const articles = articlesRes.data.filter(a => 
          a.title.toLowerCase().includes(q) || 
          a.content.toLowerCase().includes(q)
        ).map(a => ({ ...a, type: 'article' }));

        // Combine and limit to 8 results
        setSearchResults([...tickets, ...articles].slice(0, 8));
        setIsSearchOpen(true);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setSearching(false);
      }
    };

    const timer = setTimeout(() => fetchSearchResults(), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      setPasswordStatus({ ...passwordStatus, error: 'New passwords do not match' });
      return;
    }
    
    setPasswordStatus({ ...passwordStatus, loading: true, error: '', success: '' });
    try {
      await userService.changePassword(passwordData.old, passwordData.new);
      setPasswordStatus({ loading: false, error: '', success: 'Password updated successfully!' });
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordStatus({ loading: false, error: '', success: '' });
        setPasswordData({ old: '', new: '', confirm: '' });
      }, 2000);
    } catch (err) {
      setPasswordStatus({ loading: false, error: 'Failed to update password', success: '' });
    }
  };

  // Get current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'System Dashboard';
    if (path.startsWith('/tickets')) return 'Ticket Management';
    if (path.startsWith('/kb')) return 'Knowledge Base';
    if (path.startsWith('/ai')) return 'AI Support Assistant';
    if (path.startsWith('/analytics')) return 'Performance Analytics';
    if (path.startsWith('/team')) return 'Team Performance';
    if (path.startsWith('/settings')) return 'System Administration';
    return 'Enterprise Portal';
  };

  return (
    <>
      <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 fixed top-0 right-0 left-72 z-30 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{getPageTitle()}</h2>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
          <div ref={searchRef} className="relative">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 w-80 shadow-inner group transition-all focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500">
              <HiOutlineMagnifyingGlass className="text-slate-400 w-5 h-5 mr-3 group-focus-within:text-blue-500" />
              <input 
                type="text" 
                placeholder="Search tickets, articles..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length >= 2 && setIsSearchOpen(true)}
                className="bg-transparent border-none outline-none text-sm w-full text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
              />
              {searching && (
                <div className="w-4 h-4 border-2 border-slate-400/30 border-t-blue-500 rounded-full animate-spin"></div>
              )}
              {searchQuery && !searching && (
                <button onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setIsSearchOpen(false);
                }} className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <HiOutlineXMark className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 mt-3 w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-[999] overflow-hidden animate-fade-in">
                <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                  <h3 className="font-black text-xs uppercase tracking-widest text-slate-500">Search Results</h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {searchResults.map(result => (
                  <div
                    key={result.id}
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                      setIsSearchOpen(false);
                      if (result.type === 'ticket') {
                        navigate(`/tickets/${result.id}`);
                      } else {
                        navigate(`/kb/${result.id}`);
                      }
                    }}
                    className="p-4 border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        result.type === 'ticket' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                        'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      }`}>
                        {result.type === 'ticket' ? (
                          <HiOutlineTicket className="w-5 h-5" />
                        ) : (
                          <HiOutlineDocumentText className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                          {result.title}
                        </p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                          {result.type === 'ticket' ? `Ticket • ${result.status} • ${result.category}` : `Article • ${result.category}`}
                        </p>
                      </div>
                      <HiOutlineArrowUpRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ))}
                </div>
              </div>
            )}

            {isSearchOpen && searchResults.length === 0 && !searching && searchQuery.trim().length >=2 && (
              <div className="absolute top-full left-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-[999] overflow-hidden animate-fade-in p-8 text-center">
                <p className="text-sm text-slate-500 font-medium">No results found</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button 
              onClick={onToggleSidebar}
              className="lg:hidden p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95"
              title="Toggle Menu"
            >
              <HiOutlineBars3 className="w-6 h-6" />
            </button>
            
          <button 
              onClick={toggleTheme}
              className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
            </button>

          <div className="relative" ref={notificationsRef}>
            <button 
              className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all relative active:scale-95"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <HiOutlineBell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-red-600 text-white text-[10px] flex items-center justify-center rounded-full font-black border-2 border-white dark:border-slate-900 shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-3 w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-[10001] overflow-hidden animate-fade-in">
                <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                  <h3 className="font-black text-xs uppercase tracking-widest text-slate-900 dark:text-white">Recent Alerts</h3>
                  <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Clear All</button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 5).map(n => (
                      <div 
                        key={n.id} 
                        className={`p-4 border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors ${!n.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                        onClick={() => {
                          // Navigate based on notification type
                          if (n.ticketId) {
                            navigate(`/tickets/${n.ticketId}`);
                          } else if (n.articleId) {
                            navigate(`/kb/${n.articleId}`);
                          }
                          setIsNotificationsOpen(false);
                          // Mark as read
                          notificationService.markAsRead(n.id);
                          setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, read: true } : notif));
                          setUnreadCount(prev => Math.max(0, prev - 1));
                        }}
                      >
                        <p className="text-sm text-slate-800 dark:text-slate-200 font-bold mb-1 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center text-slate-400 text-sm font-medium">No new alerts</div>
                  )}
                </div>
                <div className="p-4 text-center bg-slate-50/50 dark:bg-slate-900/50">
                  <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline" onClick={() => {
                    navigate('/notifications');
                    setIsNotificationsOpen(false);
                  }}>View All Alerts</button>
                </div>
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 pr-4 rounded-xl transition-all active:scale-95 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-600/20">
                {user?.name?.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{user?.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user?.role}</p>
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-[10002] p-2 animate-fade-in">
                <button 
                  onClick={() => {
                    navigate('/account');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-all text-left">
                  <HiOutlineCog6Tooth className="w-5 h-5 text-slate-400" />
                  Account Settings
                </button>
                <button 
                  onClick={() => {
                    setIsPasswordModalOpen(true);
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-all text-left"
                >
                  <HiOutlineKey className="w-5 h-5 text-slate-400" />
                  Change Password
                </button>
                <button 
                  onClick={() => {
                    navigate('/help');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-all text-left">
                  <HiOutlineQuestionMarkCircle className="w-5 h-5 text-slate-400" />
                  Help Center
                </button>
                <div className="h-px bg-slate-100 dark:bg-slate-700 my-2 mx-2"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all text-left"
                >
                  <HiOutlineArrowLeftOnRectangle className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-slide-in">
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center">
                    <HiOutlineKey className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Security Credentials</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Update Account Password</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <HiOutlineXMark className="w-6 h-6" />
                </button>
              </div>

              {passwordStatus.error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-xs font-bold rounded-2xl border border-red-100 dark:border-red-900/20">
                  {passwordStatus.error}
                </div>
              )}

              {passwordStatus.success && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 text-xs font-bold rounded-2xl border border-green-100 dark:border-green-900/20">
                  {passwordStatus.success}
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Current Password</label>
                  <input 
                    type="password" 
                    value={passwordData.old}
                    onChange={(e) => setPasswordData({ ...passwordData, old: e.target.value })}
                    className="input py-3.5"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">New Secure Password</label>
                  <input 
                    type="password" 
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                    className="input py-3.5"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                    className="input py-3.5"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="btn-secondary flex-grow py-3.5"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={passwordStatus.loading}
                    className="btn-primary flex-grow py-3.5"
                  >
                    {passwordStatus.loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
