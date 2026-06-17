import api, { mockResponse } from './api';
import { suggestedQuestions } from '../mock/mockData';
import { USE_MOCK } from '../config/constants';

const aiService = {
  sendMessage: async (message, history = []) => {
    if (USE_MOCK) {
      // Simple mock AI logic
      let response = "";
      const query = message.toLowerCase();

      if (query.includes('vpn')) {
        response = "To connect to the VPN, ensure you have the GlobalProtect client installed. Open the client, enter 'vpn.company.com', and use your corporate credentials. If you experience drops, try switching to a wired connection.";
      } else if (query.includes('password')) {
        response = "You can reset your password at https://password.company.com. Requirements: minimum 12 characters, including uppercase, numbers, and special characters. Your account will lock after 5 failed attempts.";
      } else if (query.includes('laptop') || query.includes('hardware')) {
        response = "For new hardware requests, please create a support ticket in the 'Hardware' category. Standard laptops are Dell XPS 15 or MacBook Pro 14\". Manager approval is required for items over $500.";
      } else if (query.includes('outlook') || query.includes('email')) {
        response = "If Outlook isn't syncing, try clearing your offline cache by deleting the .ost file in %localappdata%\\Microsoft\\Outlook. Ensure you're connected to the corporate network or VPN.";
      } else {
        response = "I'm your AI Support Assistant. I can help with VPN setup, password resets, hardware requests, and software issues. Based on your question, I recommend checking our Knowledge Base or creating a support ticket if you need immediate human assistance.";
      }

      return mockResponse({
        text: response,
        timestamp: new Date().toISOString(),
        suggestedActions: [
          { label: 'Create Ticket', action: '/tickets/new' },
          { label: 'View KB Articles', action: '/kb' }
        ]
      }, 1500); // Longer delay for AI "thinking" effect
    }
    return api.post('/ai/chat', { message, history });
  },

  getSuggestedQuestions: async () => {
    if (USE_MOCK) return mockResponse(suggestedQuestions);
    return api.get('/ai/suggested-questions');
  }
};

export default aiService;
