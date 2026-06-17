import api, { mockResponse } from './api';
import { mockAnalytics } from '../mock/mockData';
import { USE_MOCK } from '../config/constants';

const analyticsService = {
  getDashboardStats: async () => {
    if (USE_MOCK) return mockResponse(mockAnalytics);
    return api.get('/analytics/dashboard');
  },

  getTicketVolume: async (period = 'month') => {
    if (USE_MOCK) return mockResponse(mockAnalytics.ticketsByMonth);
    return api.get('/analytics/volume', { params: { period } });
  },

  getCategoryDistribution: async () => {
    if (USE_MOCK) return mockResponse(mockAnalytics.ticketsByCategory);
    return api.get('/analytics/categories');
  },

  getAgentPerformance: async () => {
    if (USE_MOCK) return mockResponse(mockAnalytics.agentPerformance);
    return api.get('/analytics/performance');
  }
};

export default analyticsService;
