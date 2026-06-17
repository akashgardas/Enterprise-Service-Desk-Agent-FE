import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import notificationService from '../../services/notificationService';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { HiOutlineBell, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi2';

const NotificationList = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await notificationService.getNotifications(user?.id);
      setNotifications(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setError(null);
    } catch (err) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(user?.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={fetchNotifications} />;
  if (notifications.length === 0) return <EmptyState title="All caught up!" message="You don't have any notifications right now." icon={HiOutlineBell} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Notifications</h1>
          <p className="text-text-secondary">Stay updated with your ticket activities</p>
        </div>
        <button 
          onClick={handleMarkAllAsRead}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          <HiOutlineCheckCircle className="w-5 h-5" />
          Mark all as read
        </button>
      </div>

      <div className="bg-bg-card rounded-2xl shadow-sm border border-border-color overflow-hidden">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`p-6 border-b border-border-color last:border-0 hover:bg-bg-secondary transition-colors cursor-pointer relative ${!notification.read ? 'bg-blue-50/20' : ''}`}
            onClick={() => !notification.read && handleMarkAsRead(notification.id)}
          >
            {!notification.read && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
            )}
            <div className="flex gap-4">
              <div className={`p-3 rounded-xl ${!notification.read ? 'bg-blue-100 text-blue-600' : 'bg-bg-secondary text-text-secondary'}`}>
                <HiOutlineBell className="w-6 h-6" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <p className={`text-sm ${!notification.read ? 'font-bold text-text-primary' : 'font-medium text-text-primary'}`}>
                    {notification.message}
                  </p>
                  <div className="flex items-center text-xs text-text-secondary gap-1 whitespace-nowrap">
                    <HiOutlineClock className="w-3 h-3" />
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>
                </div>
                <p className="text-xs text-text-secondary">
                  Related to Ticket: <span className="font-mono font-medium text-blue-600">{notification.ticketId}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationList;
