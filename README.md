# SmartMed — AI-Powered Health Report & Prescription Management System

SmartMed is a full-stack healthcare management platform designed to centralize medical reports, prescriptions, and patient-doctor workflows using a scalable backend architecture and AI-powered summarization.

The system focuses heavily on backend engineering principles, structured data modeling, and real-world healthcare workflow simulation.

---

## Overview

Healthcare data is often fragmented and difficult to manage. Patients struggle to interpret medical reports, while doctors lack structured longitudinal patient records across visits.

SmartMed solves this by providing:

- Centralized medical report storage
- AI-generated simplified summaries
- Digital prescription management
- Medication tracking
- Role-based dashboards
- Audit logging for transparency

This project is built as part of a Software Engineering & System Design (SESD) full-stack milestone, with a backend-first architecture focus.

---

## Architecture

SmartMed follows a layered backend architecture:

- Controller Layer — Handles HTTP requests & responses
- Service Layer — Business logic implementation
- Repository Layer — Database abstraction
- Middleware Layer — Authentication & validation
- Utility Layer — Shared helpers
- Configuration Layer — Environment & DB setup

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
- Node.js
- Express.js
- PostgreSQL / MySQL
- JWT Authentication
- RESTful API Design

### Frontend (25%)
- React.js
- Tailwind CSS
- Axios

### AI Integration
- OpenAI API (Medical report summarization)

---

## Features

### Authentication & Authorization
- Secure user registration & login
- Role-based access (ADMIN | DOCTOR | PATIENT)
- JWT-based authentication
- Password hashing

### Medical Report Management
- Upload medical reports
- Store structured report data
- Extract text content
- Generate AI-based summaries

### Prescription Workflow
- Doctor creates prescription
- Add multiple medications
- Track dosage and duration
- Maintain treatment history

### Notification System
- Report completion alerts
- Medication reminders
- System notifications

### Audit Logging
- Track sensitive system actions
- Maintain transparency
- Enable traceability

---

## Database Design

The system uses a normalized relational schema with:

- UUID-based primary keys
- ENUM constraints
- Strict foreign key relationships
- Indexed lookup fields
- Audit log tracking

Refer to:
- `ErDiagram.md`
- `classDiagram.md`
- `sequenceDiagram.md`
- `useCaseDiagram.md`

---

## Project Structure

```
SmartMed/
│
├── idea.md
├── ErDiagram.md
├── classDiagram.md
├── sequenceDiagram.md
├── useCaseDiagram.md
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── config/
│   └── server.js
│
├── frontend/
│   ├── src/
│   └── public/
│
└── README.md
```

---

## Setup Instructions

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## Security Considerations

- Passwords are hashed before storage
- JWT tokens are validated via middleware
- Role-based route protection
- Foreign key constraints enforce relational integrity
- Audit logs track sensitive operations

---

## Future Enhancements

- Cloud file storage integration (AWS S3)
- Real-time medication reminders
- Doctor analytics dashboard
- Appointment scheduling
- Multi-hospital support

---

## Academic Context

This project is developed for the SESD Full-Stack Project Milestone.

Evaluation Focus:
- Backend Design (75%)
- Frontend Implementation (25%)
- OOP Principles
- Clean Architecture
- System Design Practices
- Proper Git Workflow

---

