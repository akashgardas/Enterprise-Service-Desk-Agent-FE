import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import { ROLES } from './config/constants';

// Pages
import LoginPage from './pages/auth/LoginPage';
import PasswordReset from './pages/auth/PasswordReset';
import Dashboard from './pages/shared/Dashboard';
import EmployeeTicketList from './pages/employee/TicketList';
import CreateTicket from './pages/employee/CreateTicket';
import TicketEditor from './pages/employee/TicketEditor';
import AgentDashboard from './pages/agent/AgentDashboard';
import AgentTicketQueue from './pages/agent/AgentTicketQueue';
import TeamOverview from './pages/manager/TeamOverview';
import UserManagement from './pages/admin/UserManagement';
import AuditLog from './pages/admin/AuditLog';
import NotificationList from './pages/notifications/NotificationList';
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard';
import TicketDetail from './pages/shared/TicketDetail';
import ArticleList from './pages/kb/ArticleList';
import ArticleDetail from './pages/kb/ArticleDetail';
import ArticleEditor from './pages/kb/ArticleEditor';
import ChatInterface from './pages/ai/ChatInterface';
import AccountSettings from './pages/shared/AccountSettings';
import HelpCenter from './pages/shared/HelpCenter';

const AppRoutes = () => {
  const { user, hasRole } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
      <Route path="/password-reset" element={<PasswordReset />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        {/* Universal Dashboard */}
        <Route index element={<Dashboard />} />

        {/* Tickets */}
        <Route path="tickets" element={
          hasRole([ROLES.AGENT, ROLES.MANAGER, ROLES.ADMIN]) ? <AgentTicketQueue /> : <EmployeeTicketList />
        } />
        <Route path="tickets/new" element={<CreateTicket />} />
        <Route path="tickets/:id" element={<TicketDetail />} />
        <Route path="tickets/:id/edit" element={<TicketEditor />} />

        {/* Knowledge Base */}
        <Route path="kb" element={<ArticleList />} />
        <Route path="kb/:id" element={<ArticleDetail />} />
        <Route path="kb/new" element={
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.AGENT]}>
            <ArticleEditor />
          </ProtectedRoute>
        } />
        <Route path="kb/:id/edit" element={
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.AGENT]}>
            <ArticleEditor />
          </ProtectedRoute>
        } />

        {/* AI Assistant */}
        <Route path="ai" element={<ChatInterface />} />

        {/* Account Settings */}
        <Route path="account" element={<AccountSettings />} />

        {/* Help Center */}
        <Route path="help" element={<HelpCenter />} />

        {/* Notifications */}
        <Route path="notifications" element={<NotificationList />} />

        {/* Manager/Admin only */}
        <Route path="analytics" element={
          <ProtectedRoute roles={[ROLES.MANAGER, ROLES.ADMIN]}>
            <AnalyticsDashboard />
          </ProtectedRoute>
        } />
        <Route path="team" element={
          <ProtectedRoute roles={[ROLES.MANAGER, ROLES.ADMIN]}>
            <TeamOverview />
          </ProtectedRoute>
        } />

        {/* Admin only */}
        <Route path="settings" element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
            <UserManagement />
          </ProtectedRoute>
        } />
        <Route path="audit-log" element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
            <AuditLog />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="/unauthorized" element={<div className="flex items-center justify-center h-screen bg-slate-50 font-black uppercase tracking-widest text-slate-400">Unauthorized Access</div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
