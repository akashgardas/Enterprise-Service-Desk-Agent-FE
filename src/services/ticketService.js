import api, { mockResponse } from './api';
import { mockTickets, getNextTicketId } from '../mock/mockData';
import { USE_MOCK } from '../config/constants';

const ticketService = {
  getTickets: async (filters = {}) => {
    if (USE_MOCK) {
      let filtered = [...mockTickets];
      if (filters.status) filtered = filtered.filter(t => t.status === filters.status);
      if (filters.priority) filtered = filtered.filter(t => t.priority === filters.priority);
      if (filters.createdBy) filtered = filtered.filter(t => t.createdBy === filters.createdBy);
      if (filters.assignedTo) filtered = filtered.filter(t => t.assignedTo === filters.assignedTo);
      return mockResponse(filtered);
    }
    return api.get('/tickets', { params: filters });
  },

  getTicketById: async (id) => {
    if (USE_MOCK) {
      const ticket = mockTickets.find(t => t.id === id);
      return mockResponse(ticket);
    }
    return api.get(`/tickets/${id}`);
  },

  createTicket: async (ticketData) => {
    if (USE_MOCK) {
      // Auto Category & Routing Detection
      const title = ticketData.title.toLowerCase();
      let category = ticketData.category;
      let department = 'General Support';
      let assignedTo = 'u11'; // Default Manager

      if (title.includes('vpn') || title.includes('network')) {
        category = 'Network';
        department = 'Network Team';
        assignedTo = 'u6'; // Sarah Mitchell
      } else if (title.includes('email') || title.includes('outlook') || title.includes('messaging')) {
        category = 'Messaging';
        department = 'Messaging Team';
        assignedTo = 'u9'; // Ahmed Hassan
      } else if (title.includes('laptop') || title.includes('hardware') || title.includes('printer')) {
        category = 'Hardware';
        department = 'Hardware Team';
        assignedTo = 'u7'; // James Cooper
      } else if (title.includes('software') || title.includes('application') || title.includes('install')) {
        category = 'Application';
        department = 'Application Team';
        assignedTo = 'u8'; // Lisa Park
      }

      // Auto Priority Assignment
      let priority = ticketData.priority;
      if (title.includes('entire system') || title.includes('outage') || title.includes('everyone')) {
        priority = 'Critical';
      } else if (title.includes('department') || title.includes('team')) {
        priority = 'High';
      }

      const newTicket = {
        ...ticketData,
        id: getNextTicketId(),
        category,
        priority,
        department,
        assignedTo,
        status: 'Open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
        timeline: [
          { action: 'Ticket Created (Auto-categorized)', by: ticketData.createdByName || 'User', at: new Date().toISOString() },
          { action: `Auto-routed to ${department}`, by: 'System', at: new Date().toISOString() }
        ],
        slaDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Default 24h SLA
      };
      mockTickets.unshift(newTicket);
      return mockResponse(newTicket);
    }
    return api.post('/tickets', ticketData);
  },

  updateTicket: async (id, updateData) => {
    if (USE_MOCK) {
      const index = mockTickets.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTickets[index] = { ...mockTickets[index], ...updateData, updatedAt: new Date().toISOString() };
        return mockResponse(mockTickets[index]);
      }
      throw new Error('Ticket not found');
    }
    return api.patch(`/tickets/${id}`, updateData);
  },

  addComment: async (id, comment) => {
    if (USE_MOCK) {
      const index = mockTickets.findIndex(t => t.id === id);
      if (index !== -1) {
        const newComment = {
          id: `c${Date.now()}`,
          ...comment,
          createdAt: new Date().toISOString()
        };
        mockTickets[index].comments.push(newComment);
        mockTickets[index].updatedAt = new Date().toISOString();
        return mockResponse(newComment);
      }
      throw new Error('Ticket not found');
    }
    return api.post(`/tickets/${id}/comments`, comment);
  }
};

export default ticketService;
