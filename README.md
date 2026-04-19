# SmartMed — AI-Powered Health Report & Prescription Management System

> **SESD Full-Stack Project — Final Submission**

## 🌐 Live Deployment

| | URL |
|---|---|
| **Frontend (Vercel)** | https://ai-powered-smart-health-report-mana-orcin.vercel.app |
| **Backend API (Render)** | https://ai-powered-smart-health-report.onrender.com |

---

## Overview

SmartMed is a full-stack healthcare management platform that centralizes medical reports, prescriptions, and patient-doctor workflows using a scalable backend architecture and AI-powered summarization.

Healthcare data is often fragmented and difficult to manage. Patients struggle to interpret medical reports, while doctors lack structured longitudinal patient records across visits.

SmartMed solves this by providing:

- Centralized medical report storage (Supabase Storage)
- AI-generated simplified summaries (Groq — Llama 3.3 70B + Llama 4 Scout Vision)
- JPEG/PNG medical image report processing via vision AI
- Digital prescription management
- Medication tracking
- Role-based dashboards (Patient / Doctor / Admin)
- Audit logging for transparency

---

## Architecture

SmartMed follows a layered backend architecture:

- **Controller Layer** — Handles HTTP requests & responses
- **Service Layer** — Business logic implementation
- **Repository Layer** — Database abstraction (Supabase)
- **Middleware Layer** — JWT Authentication & RBAC
- **Utility Layer** — Shared helpers
- **Configuration Layer** — Environment & DB setup

Design principles used:

- MVC Architecture
- Repository Pattern
- Service Layer Pattern
- Role-Based Access Control (RBAC)
- Singleton Pattern (Database connection)
- Separation of Concerns

---

## Tech Stack

### Backend (75% Focus)
- Node.js + Express.js
- Supabase (PostgreSQL) — database & file storage
- JWT Authentication
- RESTful API Design

### Frontend (25%)
- React.js (Vite)
- Tailwind CSS
- Axios

### AI Integration
- **Groq API** — `llama-3.3-70b-versatile` for text report summarization
- **Groq Vision** — `meta-llama/llama-4-scout-17b-16e-instruct` for JPEG/PNG medical image reports

---

## Features

### Authentication & Authorization
- Secure user registration & login
- Role-based access: `ADMIN | DOCTOR | PATIENT`
- JWT-based authentication with bcrypt password hashing

### Medical Report Management
- Upload medical reports (PDF, TXT, JPEG, PNG)
- **Vision AI** — reads and summarizes photo/scanned reports
- AI-generated patient-friendly summaries stored in Supabase
- Files stored in Supabase Storage (persistent cloud storage)

### Prescription Workflow
- Doctor views all patient reports in tabulated format with AI summaries
- One-click "Write Rx" auto-fills patient info into prescription form
- Add multiple medications with dosage, frequency, duration
- Maintain full treatment history

### Notification System
- Report completion alerts
- Medication reminders
- System notifications with read/unread tracking

### Audit Logging
- Track sensitive system actions (login, report upload, prescription creation)
- Viewable by Admin with full audit trail

---

## Database Design

Normalized relational schema on Supabase (PostgreSQL):

| Table | Description |
|---|---|
| `users` | All platform users with role enum |
| `doctor_profiles` | Doctor specialization & license |
| `patient_profiles` | Patient demographics & medical history |
| `reports` | Uploaded reports + AI summaries |
| `prescriptions` | Doctor-issued prescriptions |
| `medications` | Medications under each prescription |
| `notifications` | Alerts and reminders |
| `audit_logs` | System activity log |

Refer to: `ErDiagram.md`, `classDiagram.md`, `sequenceDiagram.md`, `useCaseDiagram.md`

---

## Project Structure

```
SmartMed/
├── backend/
│   ├── server.js
│   ├── render.yaml
│   └── src/
│       ├── config/         # Supabase singleton client
│       ├── repositories/   # Data access layer
│       ├── services/       # Business logic + AI + Storage
│       ├── controllers/    # Thin HTTP handlers
│       ├── routes/         # auth, reports, prescriptions, notifications, admin
│       └── middleware/     # JWT auth, RBAC, multer
│
├── frontend/
│   ├── vercel.json
│   └── src/
│       ├── api/            # Axios with JWT interceptor
│       ├── context/        # Auth context
│       ├── components/     # Navbar, PrivateRoute
│       └── pages/          # Login, Register, Dashboards, Reports, Prescriptions
│
├── ErDiagram.md
├── classDiagram.md
├── sequenceDiagram.md
└── useCaseDiagram.md
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- Supabase project (free tier)
- Groq API key (free tier)

### Backend

```bash
cd backend
cp .env.example .env   # fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GROQ_API_KEY, JWT_SECRET
npm install
node server.js         # runs on :4000
```

### Frontend

```bash
cd frontend
npm install
npm run dev            # runs on :5173, proxies /api → :4000
```

### Database
Run `backend/src/models/schema.sql` in your **Supabase → SQL Editor**.

---

## Security

- Passwords hashed with bcryptjs (salt rounds: 12)
- JWT tokens validated on every protected route
- Role-based route protection (RBAC middleware)
- Supabase service role key used server-side only (never exposed to frontend)
- Medical files stored in Supabase Storage (cloud-persistent, not local disk)

---

## Academic Context

Developed for the **SESD Full-Stack Project Milestone**.

| Focus Area | Weight |
|---|---|
| Backend Design & Architecture | 75% |
| Frontend Implementation | 25% |

Key evaluation areas: OOP Principles · Clean Architecture · System Design · Git Workflow
