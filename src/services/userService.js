import api, { mockResponse } from './api';
import { mockUsers } from '../mock/mockData';
import { USE_MOCK } from '../config/constants';

const userService = {
  getUsers: async () => {
    if (USE_MOCK) return mockResponse(mockUsers);
    return api.get('/users');
  },

  getUserById: async (id) => {
    if (USE_MOCK) {
      const user = mockUsers.find(u => u.id === id);
      return mockResponse(user);
    }
    return api.get(`/users/${id}`);
  },

  getCurrentUser: async () => {
    if (USE_MOCK) {
      // Return a default mock user (e.g., John Carter - employee)
      return mockResponse(mockUsers[0]);
    }
    return api.get('/users/me');
  },

  login: async (credentials) => {
    if (USE_MOCK) {
      // Find a user by role if provided, otherwise by email
      let user;
      if (credentials.role) {
        user = mockUsers.find(u => u.role === credentials.role.toLowerCase());
      } else {
        user = mockUsers.find(u => u.email === credentials.email) || mockUsers[0];
      }
      
      const response = { user, token: 'mock-jwt-token' };
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(user));
      return mockResponse(response);
    }
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response;
  },

  changePassword: async (oldPassword, newPassword) => {
    if (USE_MOCK) {
      return mockResponse({ success: true, message: 'Password updated successfully' });
    }
    return api.post('/auth/change-password', { oldPassword, newPassword });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (!USE_MOCK) api.post('/auth/logout');
  }
};

export default userService;
