import api, { mockResponse } from './api';
import { mockActivities } from '../mock/mockData';
import { USE_MOCK, ROLES } from '../config/constants';

const activityService = {
  /**
   * Fetches system activities with RBAC enforcement
   * @param {Object} user - The current logged in user
   * @returns {Promise}
   */
  getActivities: async (user) => {
    if (USE_MOCK) {
      let filtered = [...mockActivities];
      
      // RBAC Logic for activity visibility
      if (user.role === ROLES.ADMIN) {
        // Admin sees EVERYTHING
        return mockResponse(filtered);
      } else if (user.role === ROLES.MANAGER) {
        // Manager sees their activities + all ticket/KB/analytics activities
        filtered = filtered.filter(a => 
          a.role === ROLES.MANAGER || 
          ['ticket', 'kb', 'analytics'].includes(a.type)
        );
      } else if (user.role === ROLES.AGENT) {
        // Agents see ticket and KB related activities
        filtered = filtered.filter(a => 
          ['ticket', 'kb'].includes(a.type) || 
          a.user === user.name
        );
      } else {
        // Employees only see their own activities
        filtered = filtered.filter(a => a.user === user.name);
      }
      
      // Sort by latest first
      filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      return mockResponse(filtered);
    }
    
    return api.get('/activities');
  },

  logActivity: async (activity) => {
    if (USE_MOCK) {
      const newActivity = {
        id: `act${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'success',
        ...activity
      };
      mockActivities.unshift(newActivity);
      return mockResponse(newActivity);
    }
    return api.post('/activities', activity);
  }
};

export default activityService;
