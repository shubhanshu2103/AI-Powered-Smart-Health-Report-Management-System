**ER Diagram — SmartMed**


**Overview**

This Entity-Relationship diagram represents the database schema for SmartMed, an AI-powered health report management platform designed to support patients, doctors, and administrators through structured medical data workflows.

The schema models:

• Role-based authentication
• Doctor & patient profile separation
• Medical report storage
• AI summary generation
• Prescription workflow
• Medication tracking
• Payment support (optional future extension)
• Notification system
• Audit logging


The system is designed following real-world healthcare workflow modeling and scalable backend design principles.
```mermaid
erDiagram


    USERS {
        uuid id PK
        varchar email UK
        varchar password_hash
        varchar full_name
        enum role "ADMIN | DOCTOR | PATIENT"
        boolean is_active
        boolean is_verified
        timestamp created_at
        timestamp updated_at
    }

    DOCTOR_PROFILES {
        uuid id PK
        uuid user_id FK, UK
        varchar specialization
        varchar license_number
        text bio
        timestamp created_at
    }

    PATIENT_PROFILES {
        uuid id PK
        uuid user_id FK, UK
        date date_of_birth
        varchar gender
        text medical_history
        timestamp created_at
    }

    REPORTS {
        uuid id PK
        uuid patient_id FK
        uuid uploaded_by FK
        varchar file_url
        text extracted_text
        text ai_summary
        enum status "PROCESSING | COMPLETED | FAILED"
        timestamp created_at
        timestamp updated_at
    }

    PRESCRIPTIONS {
        uuid id PK
        uuid patient_id FK
        uuid doctor_id FK
        text diagnosis
        timestamp prescribed_at
        timestamp created_at
    }

    MEDICATIONS {
        uuid id PK
        uuid prescription_id FK
        varchar medicine_name
        varchar dosage
        varchar frequency
        integer duration_days
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        enum type "REPORT_READY | MEDICATION_REMINDER | SYSTEM_ALERT"
        varchar title
        text message
        boolean is_read
        timestamp created_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid user_id FK
        varchar action
        varchar entity_type
        uuid entity_id
        json details
        timestamp created_at
    }

    %% ===== RELATIONSHIPS =====

    USERS ||--o| DOCTOR_PROFILES : "has"
    USERS ||--o| PATIENT_PROFILES : "has"

    PATIENT_PROFILES ||--o{ REPORTS : "owns"
    USERS ||--o{ REPORTS : "uploads"

    PATIENT_PROFILES ||--o{ PRESCRIPTIONS : "receives"
    DOCTOR_PROFILES ||--o{ PRESCRIPTIONS : "creates"

    PRESCRIPTIONS ||--o{ MEDICATIONS : "contains"

    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ AUDIT_LOGS : "generates"
```

**Table Summary**

| Table              | Description                                 | Key Relationships                  |
| ------------------ | ------------------------------------------- | ---------------------------------- |
| `USERS`            | All platform users (admin, doctor, patient) | → Profiles, Reports, Notifications |
| `DOCTOR_PROFILES`  | Doctor-specific professional details        | ← User (1:1), → Prescriptions      |
| `PATIENT_PROFILES` | Patient demographic + health metadata       | ← User (1:1), → Reports            |
| `REPORTS`          | Uploaded medical reports + AI summaries     | ← Patient                          |
| `PRESCRIPTIONS`    | Doctor-issued treatment records             | ← Doctor, Patient                  |
| `MEDICATIONS`      | Medication details under prescriptions      | ← Prescription                     |
| `NOTIFICATIONS`    | Alerts and reminders                        | ← User                             |
| `AUDIT_LOGS`       | System activity logging                     | ← User                             |

**Key Indexes**

| Table           | Index                      | Purpose                    |
| --------------- | -------------------------- | -------------------------- |
| `USERS`         | `(email)`                  | Fast authentication lookup |
| `REPORTS`       | `(patient_id, status)`     | Fetch patient reports      |
| `PRESCRIPTIONS` | `(patient_id, doctor_id)`  | Treatment history          |
| `MEDICATIONS`   | `(prescription_id)`        | Medication lookup          |
| `NOTIFICATIONS` | `(user_id, is_read)`       | Unread notifications       |
| `AUDIT_LOGS`    | `(entity_type, entity_id)` | Audit tracing              |

