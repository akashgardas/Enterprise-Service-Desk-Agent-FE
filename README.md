# Enterprise Service Desk Agent - Frontend

AI-powered support portal built with React and Vite for intelligent ticket management, knowledge base access, analytics, and real-time support.

---

## Overview

Enterprise Service Desk Agent is a modern support management platform that enables employees to receive instant AI-powered assistance, create and track support tickets, access knowledge base articles, and monitor issue resolution.

The frontend provides dashboards and interfaces for Employees, Service Desk Agents, Managers, and Administrators.

---

## Features

### Authentication

* JWT Authentication
* Role-Based Access Control (RBAC)
* Multi-Factor Authentication Support
* Password Reset
* Protected Routes

### AI Support Assistant

* Natural Language Conversations
* Context-Aware Responses
* Suggested Questions
* Knowledge Base Integration
* Session Management

### Ticket Management

* Create Tickets
* Search and Filter Tickets
* Track Ticket Status
* Ticket Prioritization
* View Ticket Details
* Resolution Tracking

### Knowledge Base

* Search Articles
* Browse Categories
* Self-Service Troubleshooting

### Analytics Dashboard

* Open Ticket Metrics
* Resolved Tickets
* Average Resolution Time
* SLA Monitoring
* Agent Performance Insights

### Notifications

* Toast Notifications
* Real-Time Updates
* Loading Indicators

---

## Tech Stack

| Category           | Technology       |
| ------------------ | ---------------- |
| Frontend Framework | React            |
| Build Tool         | Vite             |
| Language           | JavaScript       |
| Styling            | Tailwind CSS     |
| Routing            | React Router DOM |
| API Client         | Axios            |
| Form Handling      | React Hook Form  |
| Icons              | React Icons      |
| Charts             | Recharts         |
| Notifications      | React Toastify   |
| Loaders            | React Spinners   |
| Authentication     | JWT              |
| Version Control    | Git + GitHub     |

---

## Architecture

User

↓

React Frontend

↓

FastAPI Backend

↓

MongoDB Atlas

↓

Gemini AI

---

## Project Structure

```text
src/
│
├── assets/
├── components/
├── pages/
├── layouts/
├── routes/
├── hooks/
├── context/
├── services/
├── utils/
├── constants/
├── styles/
│
├── App.jsx
└── main.jsx
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd frontend
```

### Install Dependencies

```bash
npm install
```

---

## Environment Variables

Create:

```text
.env
```

Add:

```env
VITE_API_BASE_URL=https://your-backend.onrender.com

VITE_WS_BASE_URL=wss://your-backend.onrender.com

VITE_APP_NAME=Enterprise Service Desk

VITE_ENV=production
```

---

## Run Development Server

```bash
npm run dev
```

Application runs at:

```text
http://localhost:5173
```

---

## Build Production

```bash
npm run build
```

---

## Preview Production Build

```bash
npm run preview
```

---

## Available Scripts

### Start Development Server

```bash
npm run dev
```

### Build Application

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

---

## Deployment

Frontend is deployed on Vercel.

CI/CD Workflow:

Developer

↓

Push to dev

↓

Pull Request

↓

GitHub Actions

* Install Dependencies
* Lint
* Build

↓

Merge to main

↓

Vercel Auto Deployment

---

## Screens

### Login Page

* Role Selection
* Email Authentication
* Password Visibility Toggle
* Forgot Password

### Employee Dashboard

* Ticket Summary
* Recent Activities
* AI Assistant Shortcut

### AI Support Assistant

* Context-Aware Conversations
* Suggested Queries
* Knowledge Base Integration

### Ticket Dashboard

* Search and Filter Tickets
* Status Monitoring
* Priority Indicators

### Create Ticket

* Category Selection
* Priority Assignment
* Description Validation
* Draft Auto-Save

---

## Future Enhancements

* Voice-Based AI Support
* Mobile Applications
* Predictive Analytics
* Multi-Language Support
* Real-Time Collaboration
* WebSocket Notifications
* Advanced LLM Integration
* Cloud-Native Architecture

---

## Deployment Platforms

| Component      | Platform       |
| -------------- | -------------- |
| Frontend       | Vercel         |
| Backend        | Render         |
| Database       | MongoDB Atlas  |
| AI             | Gemini         |
| Source Control | GitHub         |
| CI/CD          | GitHub Actions |

---

## Contributors

* Frontend Team
* Backend Team
* AI Team

---

## License

MIT License

---

Built with React, Vite, FastAPI, MongoDB Atlas, and Google Gemini.
