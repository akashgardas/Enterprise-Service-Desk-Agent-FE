import api, { mockResponse } from './api';
import { mockTickets, getNextTicketId, mockUsers } from '../mock/mockData';
import { USE_MOCK } from '../config/constants';
import notificationService from './notificationService';

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

      // Create notification for agents/admins about new ticket!
      // Find all agent/admin users
      mockUsers.forEach(user => {
        if (['admin', 'agent', 'manager'].includes(user.role.toLowerCase())) {
          notificationService.createNotification({
            userId: user.id,
            message: `New ticket created: ${newTicket.title} (${newTicket.id})`,
            type: 'ticket',
            ticketId: newTicket.id
          });
        }
      });

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
        const ticket = mockTickets[index];
        const newComment = {
          id: `c${Date.now()}`,
          ...comment,
          createdAt: new Date().toISOString()
        };
        ticket.comments.push(newComment);
        ticket.updatedAt = new Date().toISOString();

        // Create notifications for other people involved in the ticket!
        // Notify ticket creator and agents!
        // First, get all users who need to know!
        const notifiedUsers = new Set();
        if (ticket.createdBy) notifiedUsers.add(ticket.createdBy);
        if (ticket.assignedTo) notifiedUsers.add(ticket.assignedTo);
        notifiedUsers.delete(comment.userId); // Don't notify the sender!
        // Also notify all admins/agents/managers just in case!
        mockUsers.forEach(user => {
          if (['admin', 'agent', 'manager'].includes(user.role.toLowerCase())) {
            notifiedUsers.add(user.id);
          }
        });

        notifiedUsers.forEach(userId => {
          notificationService.createNotification({
            userId,
            message: `New message on ticket ${ticket.id}: ${comment.text.substring(0, 50)}...`,
            type: 'comment',
            ticketId: ticket.id
          });
        });

        return mockResponse(newComment);
      }
      throw new Error('Ticket not found');
    }
    return api.post(`/tickets/${id}/comments`, comment);
  },

  deleteTicket: async (id) => {
    if (USE_MOCK) {
      const index = mockTickets.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTickets.splice(index, 1);
        return mockResponse({ success: true });
      }
      throw new Error('Ticket not found');
    }
    return api.delete(`/tickets/${id}`);
  }
};

export default ticketService;
