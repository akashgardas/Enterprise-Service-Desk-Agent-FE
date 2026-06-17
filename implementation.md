# Enterprise Service Desk Agent — Frontend Architecture Plan (v2) 
 
 > **Aligned with:** BA Document (Team J – Enterprise Service Desk Agent) 
 > **Tech Stack:** React 19 + Vite · JavaScript · Tailwind CSS v4 · React Router DOM v6 · Axios · Context API · React Hook Form · React Toastify · Recharts · React Icons 
 
 --- 
 
 ## Confirmed Decisions 
 
 | Decision | Choice | 
 |----------|--------| 
 | Tailwind CSS | **v4** (theme-based, `@theme` block) | 
 | State Management | **Context API** (Auth, Theme, Notifications) | 
 | Authentication | **JWT** with role-based routing + `Remember Me` via `localStorage` | 
 | Real-time | **Polling/Mock** architecture (upgradeable to WebSocket) | 
 | Backend | **Mock-first strategy** with centralized Axios interceptors | 
 | MFA | **UI placeholder** (OTP input component) — backend-dependent | 
 
 --- 
 
 ## BA Alignment: Functional Requirement → Component Traceability 
 
 ### Authentication Module (FR-001 → FR-007) 
 
 | FR ID | Requirement | Frontend Component | User Story | 
 |-------|------------|-------------------|------------| 
 | FR-001 | User Login | `LoginPage.jsx` | US-001 | 
 | FR-002 | User Logout | `Navbar.jsx` (logout function) | — | 
 | FR-003 | Password Reset | `PasswordReset.jsx` | US-002 | 
 | FR-004 | Session Timeout | `AuthContext.jsx` logic | — | 
 | FR-005 | JWT Authentication | `api.js` interceptors | — | 
 | FR-006 | Multi-Factor Authentication | `MFAInput.jsx` (Placeholder) | — | 
 | FR-007 | Role-Based Access Control | `ProtectedRoute.jsx` + `AuthContext.js` | US-003 | 
 
 ### AI Assistant Module (FR-008 → FR-013) 
 
 | FR ID | Requirement | Frontend Component | User Story | 
 |-------|------------|-------------------|------------| 
 | FR-008 | Natural Language Chat | `ChatInterface.jsx` | US-004 | 
 | FR-009 | Context-Aware Conversations | `aiService.js` (history management) | US-004 | 
 | FR-010 | Knowledge Base Search | `kbService.js` + AI integration | US-005 | 
 | FR-011 | Suggested Solutions | `ChatInterface.jsx` (chips) | US-004 | 
 | FR-012 | Escalation Support | Ticket creation from Chat | US-007 | 
 | FR-013 | Conversation History | `ChatInterface.jsx` history state | US-006 | 
 
 ### Ticket Management Module (FR-014 → FR-024) 
 
 | FR ID | Requirement | Frontend Component | User Story | 
 |-------|------------|-------------------|------------| 
 | FR-014 | Create Ticket | `CreateTicket.jsx` | US-008 | 
 | FR-015 | Auto Ticket ID Generation | `mockData.js` utility | US-008 | 
 | FR-016 | Upload Attachments | `CreateTicket.jsx` (Dropzone) | US-009 | 
 | FR-017 | View Ticket Status | `TicketList.jsx` + `StatusBadge` | US-010 | 
 | FR-018 | Update Ticket | `TicketDetail.jsx` (Comments) | US-011 | 
 | FR-019 | Close Ticket | `TicketDetail.jsx` actions | US-012 | 
 | FR-020 | Auto Category Detection | AI Suggestion Logic | — | 
 | FR-021 | Auto Priority Assignment | Business Rules in Service | — | 
 | FR-022 | Auto Routing | Department Mapping Logic | — | 
 | FR-023 | Ticket Assignment | `AgentTicketQueue.jsx` | US-015 | 
 | FR-024 | Resolution Tracking | `TicketDetail.jsx` Timeline | — | 
 
 ### Knowledge Base Module (FR-025 → FR-031) 
 
 | FR ID | Requirement | Frontend Component | User Story | 
 |-------|------------|-------------------|------------| 
 | FR-025 | Search Articles | `ArticleList.jsx` | US-017 | 
 | FR-026 | View Articles | `ArticleDetail.jsx` | US-017 | 
 | FR-027 | Categorized Documents | `ArticleList.jsx` Sidebar | US-017 | 
 | FR-028 | AI Retrieval | Integrated in AI Chat | US-005 | 
 | FR-029 | Create Article | Admin KB Management | US-018 | 
 | FR-030 | Edit Article | Admin KB Management | US-019 | 
 | FR-031 | Delete Article | Admin KB Management | US-020 | 
 
 ### Notification Module (FR-032 → FR-036) 
 
 | FR ID | Requirement | Frontend Component | User Story | 
 |-------|------------|-------------------|------------| 
 | FR-032 | Ticket Created | `NotificationList.jsx` | US-021 | 
 | FR-033 | Ticket Assigned | `NotificationList.jsx` | US-022 | 
 | FR-034 | Ticket Updated | `NotificationList.jsx` | US-022 | 
 | FR-035 | Ticket Resolved | `NotificationList.jsx` | US-023 | 
 | FR-036 | Ticket Closed | `NotificationList.jsx` | US-023 | 
 
 ### Analytics Module (FR-037 → FR-042) 
 
 | FR ID | Requirement | Frontend Component | User Story | 
 |-------|------------|-------------------|------------| 
 | FR-037 | Open Ticket Count | `AnalyticsDashboard.jsx` (Cards) | US-024 | 
 | FR-038 | Closed Ticket Count | `AnalyticsDashboard.jsx` (Cards) | US-024 | 
 | FR-039 | Avg Resolution Time | `AnalyticsDashboard.jsx` (Charts) | US-024 | 
 | FR-040 | SLA Compliance | `AnalyticsDashboard.jsx` (Gauge) | US-026 | 
 | FR-041 | Agent Performance | `TeamOverview.jsx` | US-024 | 
 | FR-042 | Export Reports | `AnalyticsDashboard.jsx` (Export Btn) | US-025 | 
 
 --- 
 
 ## 1. Complete Folder Structure 
 
 ``` 
 enterprise-service-desk-agent/ 
 ├── public/ 
 │   ├── favicon.svg 
 │   └── icons.svg 
 │ 
 ├── src/ 
 │   ├── components/ 
 │   │   ├── auth/ 
 │   │   │   └── ProtectedRoute.jsx 
 │   │   ├── common/ 
 │   │   │   ├── EmptyState.jsx 
 │   │   │   ├── ErrorState.jsx 
 │   │   │   └── Loading.jsx 
 │   │   └── layout/ 
 │   │       ├── MainLayout.jsx 
 │   │       ├── Navbar.jsx 
 │   │       └── Sidebar.jsx 
 │   ├── config/ 
 │   │   └── constants.js 
 │   ├── context/ 
 │   │   └── AuthContext.jsx 
 │   ├── mock/ 
 │   │   └── mockData.js 
 │   ├── pages/ 
 │   │   ├── admin/ 
 │   │   │   ├── AuditLog.jsx 
 │   │   │   └── UserManagement.jsx 
 │   │   ├── agent/ 
 │   │   │   ├── AgentDashboard.jsx 
 │   │   │   └── AgentTicketQueue.jsx 
 │   │   ├── ai/ 
 │   │   │   └── ChatInterface.jsx 
 │   │   ├── analytics/ 
 │   │   │   └── AnalyticsDashboard.jsx 
 │   │   ├── auth/ 
 │   │   │   ├── LoginPage.jsx 
 │   │   │   └── PasswordReset.jsx 
 │   │   ├── employee/ 
 │   │   │   ├── CreateTicket.jsx 
 │   │   │   └── TicketList.jsx 
 │   │   ├── kb/ 
 │   │   │   ├── ArticleDetail.jsx 
 │   │   │   └── ArticleList.jsx 
 │   │   ├── manager/ 
 │   │   │   └── TeamOverview.jsx 
 │   │   ├── notifications/ 
 │   │   │   └── NotificationList.jsx 
 │   │   └── shared/ 
 │   │       ├── Dashboard.jsx 
 │   │       └── TicketDetail.jsx 
 │   ├── services/ 
 │   │   ├── activityService.js 
 │   │   ├── aiService.js 
 │   │   ├── analyticsService.js 
 │   │   ├── api.js 
 │   │   ├── kbService.js 
 │   │   ├── notificationService.js 
 │   │   ├── ticketService.js 
 │   │   └── userService.js 
 │   ├── App.css 
 │   ├── App.jsx 
 │   ├── index.css 
 │   └── main.jsx 
 └── ... config files 
 ``` 
