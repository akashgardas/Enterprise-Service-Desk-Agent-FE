import api, { mockResponse } from './api';
import { suggestedQuestions, mockArticles, mockTickets } from '../mock/mockData';
import { USE_MOCK } from '../config/constants';

const aiService = {
  sendMessage: async (message, history = []) => {
    if (USE_MOCK) {
      // Smarter mock AI logic
      let response = "";
      const query = message.toLowerCase();
      let suggestedActions = [
        { label: 'Create Ticket', action: '/tickets/new' },
        { label: 'View KB Articles', action: '/kb' }
      ];

      // Check for knowledge base queries
      let relevantArticle = mockArticles.find(article => 
        query.includes(article.title.toLowerCase()) || 
        article.content.toLowerCase().includes(query) ||
        query.includes(article.category.toLowerCase())
      );

      if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
        response = "Hello! I'm your Enterprise Service Desk Assistant. How can I assist you today? I can help with VPN, password resets, hardware, software, and more!";
      } else if (query.includes('vpn')) {
        response = "To connect to the VPN, ensure you have the GlobalProtect client installed. Open the client, enter 'vpn.company.com', and use your corporate credentials. If you experience drops, try switching to a wired connection. Check KB article 'How to Connect to Corporate VPN' for more details.";
      } else if (query.includes('password')) {
        response = "You can reset your password at https://password.company.com. Requirements: minimum 12 characters, including uppercase, numbers, and special characters. Your account will lock after 5 failed attempts. Check KB article 'Password Reset Procedure' for more details.";
      } else if (query.includes('laptop') || query.includes('hardware')) {
        response = "For new hardware requests, please create a support ticket in the 'Hardware' category. Standard laptops are Dell XPS 15 or MacBook Pro 14\". Manager approval is required for items over $500. Check KB article 'Requesting New Hardware' for more details.";
      } else if (query.includes('outlook') || query.includes('email')) {
        response = "If Outlook isn't syncing, try clearing your offline cache by deleting the .ost file in %localappdata%\\Microsoft\\Outlook. Ensure you're connected to the corporate network or VPN. Check KB article 'Setting Up Outlook Email on Desktop' for more details.";
      } else if (query.includes('wifi') || query.includes('wi-fi')) {
        response = "Check KB article 'Wi-Fi Troubleshooting Guide' for troubleshooting steps. Quick fixes: toggle Wi-Fi off/on, forget and reconnect, restart device, move closer to access point.";
      } else if (query.includes('software') || query.includes('install')) {
        response = "Check KB article 'Software Installation Guide' for instructions. Use Software Center for self-service installation. Request new software via support ticket with business justification.";
      } else if (query.includes('mfa') || query.includes('multi-factor') || query.includes('authenticator')) {
        response = "Check KB article 'MFA Setup Instructions' for setup guide. Supported apps: Microsoft Authenticator (recommended), Google Authenticator, Authy.";
      } else if (query.includes('teams') || query.includes('slack') || query.includes('zoom')) {
        response = "Check KB article 'Microsoft Teams Best Practices' for Teams tips. For Zoom issues, try reinstalling the browser plugin. Create a ticket if issues persist.";
      } else if (query.includes('knowledge base') || query.includes('kb')) {
        response = "You can view all knowledge base articles at /kb. We have articles on VPN, email, password reset, hardware, software, MFA, Wi-Fi, and more!";
        suggestedActions = [{ label: 'View KB Articles', action: '/kb' }];
      } else if (query.includes('ticket') || query.includes('support')) {
        response = "You can create a new support ticket at /tickets/new, or view your existing tickets at /tickets. Need help with a specific issue? Let me know!";
        suggestedActions = [
          { label: 'Create Ticket', action: '/tickets/new' },
          { label: 'View My Tickets', action: '/tickets' }
        ];
      } else if (relevantArticle) {
        response = `I found a relevant knowledge base article: "${relevantArticle.title}" (${relevantArticle.category}). Here's a summary: ${relevantArticle.content.split('\n')[0].replace('## ', '')}\n\nView the full article at /kb/${relevantArticle.id}`;
        suggestedActions = [
          { label: `View ${relevantArticle.title}`, action: `/kb/${relevantArticle.id}` },
          { label: 'Create Ticket', action: '/tickets/new' }
        ];
      } else {
        response = "I'm your AI Support Assistant! I can help with:\n- VPN setup and issues\n- Password resets and account security\n- Hardware requests and laptop care\n- Software installation and updates\n- Email and collaboration tools (Outlook, Teams, Slack, Zoom)\n- Wi-Fi and network issues\n- MFA setup\n\nBased on your question, I recommend checking our Knowledge Base or creating a support ticket if you need immediate human assistance. How can I help?";
      }

      return mockResponse({
        text: response,
        timestamp: new Date().toISOString(),
        suggestedActions
      }, 1000); // Shorter delay for better UX
    }
    return api.post('/ai/chat', { message, history });
  },

  getSuggestedQuestions: async () => {
    if (USE_MOCK) return mockResponse(suggestedQuestions);
    return api.get('/ai/suggested-questions');
  }
};

export default aiService;
