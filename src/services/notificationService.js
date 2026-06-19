import api, { mockResponse } from './api';
import { mockNotifications } from '../mock/mockData';
import { USE_MOCK } from '../config/constants';

const notificationService = {
  getNotifications: async (userId) => {
    if (USE_MOCK) {
      const filtered = mockNotifications.filter(n => n.userId === userId || !userId);
      return mockResponse(filtered);
    }
    return api.get('/notifications');
  },

  markAsRead: async (id) => {
    if (USE_MOCK) {
      const index = mockNotifications.findIndex(n => n.id === id);
      if (index !== -1) {
        mockNotifications[index].read = true;
        return mockResponse(mockNotifications[index]);
      }
      throw new Error('Notification not found');
    }
    return api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (userId) => {
    if (USE_MOCK) {
      mockNotifications.forEach(n => {
        if (n.userId === userId) n.read = true;
      });
      return mockResponse({ success: true });
    }
    return api.post('/notifications/read-all');
  },

  createNotification: async (notification) => {
    if (USE_MOCK) {
      const newNotification = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        read: false,
        createdAt: new Date().toISOString(),
        ...notification
      };
      mockNotifications.unshift(newNotification);
      return mockResponse(newNotification);
    }
    return api.post('/notifications', notification);
  }
};

export default notificationService;
