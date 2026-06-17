export const ROLES = {
  EMPLOYEE: 'employee',
  AGENT: 'agent',
  MANAGER: 'manager',
  ADMIN: 'admin',
};

export const TICKET_STATUSES = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  ESCALATED: 'Escalated',
};

export const TICKET_PRIORITIES = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

export const TICKET_CATEGORIES = {
  NETWORK: 'Network',
  MESSAGING: 'Messaging',
  HARDWARE: 'Hardware',
  APPLICATION: 'Application',
  ACCESS_MANAGEMENT: 'Access Management',
  OTHER: 'Other',
};

export const DEPARTMENTS = {
  NETWORK: 'Network Team',
  MESSAGING: 'Messaging Team',
  HARDWARE: 'Hardware Team',
  APPLICATION: 'Application Team',
  SECURITY: 'Security Team',
  GENERAL: 'General Support',
};

export const NOTIFICATION_TYPES = {
  TICKET_CREATED: 'ticket_created',
  TICKET_ASSIGNED: 'ticket_assigned',
  TICKET_UPDATED: 'ticket_updated',
  TICKET_RESOLVED: 'ticket_resolved',
  TICKET_CLOSED: 'ticket_closed',
  COMMENT_ADDED: 'comment_added',
  ESCALATION: 'escalation',
};

export const SLA_RULES = {
  Critical: { responseTime: 15, resolutionTime: 120 },
  High: { responseTime: 60, resolutionTime: 480 },
  Medium: { responseTime: 240, resolutionTime: 1440 },
  Low: { responseTime: 480, resolutionTime: 4320 },
};

export const STATUS_COLORS = {
  Open: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
  'In Progress': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300' },
  Resolved: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
  Closed: { bg: 'bg-slate-100 dark:bg-slate-700/30', text: 'text-slate-600 dark:text-slate-300' },
  Escalated: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
};

export const PRIORITY_COLORS = {
  Critical: { bg: 'bg-red-600', text: 'text-white' },
  High: { bg: 'bg-orange-500', text: 'text-white' },
  Medium: { bg: 'bg-yellow-400', text: 'text-yellow-900' },
  Low: { bg: 'bg-green-500', text: 'text-white' },
};

export const USE_MOCK = true;

export const APP_NAME = 'ServiceDesk AI';

export const ITEMS_PER_PAGE = 10;
