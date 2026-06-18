import api, { mockResponse } from './api';
import { mockUsers } from '../mock/mockData';
import { USE_MOCK } from '../config/constants';
import { v4 as uuidv4 } from 'uuid';

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

  createUser: async (userData) => {
    if (USE_MOCK) {
      const newUser = {
        id: `u${mockUsers.length + 1}`,
        name: userData.name,
        email: userData.email,
        role: userData.role.toLowerCase(),
        department: userData.department,
        avatar: null,
        status: 'active',
        phone: userData.phone || '',
        createdAt: new Date().toISOString(),
        canResetPassword: true
      };
      mockUsers.unshift(newUser);
      return mockResponse(newUser);
    }
    return api.post('/users', userData);
  },

  updateUser: async (userId, userData) => {
    if (USE_MOCK) {
      const index = mockUsers.findIndex(u => u.id === userId);
      if (index !== -1) {
        mockUsers[index] = { ...mockUsers[index], ...userData };
        return mockResponse(mockUsers[index]);
      }
      return mockResponse(null, 404);
    }
    return api.put(`/users/${userId}`, userData);
  },

  deleteUser: async (userId) => {
    if (USE_MOCK) {
      const index = mockUsers.findIndex(u => u.id === userId);
      if (index !== -1) {
        mockUsers.splice(index, 1);
        return mockResponse({ success: true });
      }
      return mockResponse(null, 404);
    }
    return api.delete(`/users/${userId}`);
  },

  resetUserPassword: async (userId) => {
    if (USE_MOCK) {
      return mockResponse({ success: true, tempPassword: 'TempPass123!' });
    }
    return api.post(`/users/${userId}/reset-password`);
  },

  toggleResetPermission: async (userId, canReset) => {
    if (USE_MOCK) {
      const index = mockUsers.findIndex(u => u.id === userId);
      if (index !== -1) {
        mockUsers[index].canResetPassword = canReset;
        return mockResponse(mockUsers[index]);
      }
      return mockResponse(null, 404);
    }
    return api.patch(`/users/${userId}/reset-permission`, { canReset });
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
