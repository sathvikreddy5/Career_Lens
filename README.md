# 🛡️ Career Lens

### Build your career. Protect your opportunity.

Career Lens is a career-readiness and opportunity-safety platform designed for college students and early-career job seekers.

It helps students understand **what skills they need for their target role, what they are currently missing, what they should learn and practice next, and whether a job or internship opportunity contains potential warning signs.**

---

## 🚀 Overview

Many college students face two major challenges when preparing for their careers:

- They don't know exactly which skills are required for their target role.
- They struggle to identify suspicious jobs, internships, and recruitment messages.

Career Lens brings both problems into one platform.

### Career Lens Workflow

```text
Profile
   ↓
Target Role
   ↓
Skill Assessment
   ↓
Identify Skill Gaps
   ↓
Personalized Roadmap
   ↓
Learn
   ↓
Practice
   ↓
Track Progress
   ↓
Evaluate Career Opportunities
   ↓
CareerShield AI
```

---

## ✨ Key Features

### 🎯 Career Readiness

Students can create their career profile and select their target role.

CareerShield compares their current skills with the skills required for that role.

Skills are categorized into:

- ✅ Covered
- 🟡 Developing
- 🔴 Missing

This helps students understand where they should focus their preparation.

---

### 📚 Personalized Learning Roadmap

Based on identified skill gaps, CareerShield provides:

- Learning resources
- Skill-specific recommendations
- Learning sequence
- Practice suggestions
- Project ideas

Students can move from identifying a skill gap to actually working on it.

---

### 💻 Practice & Projects

Career Lens provides hands-on practice tasks for important technical skills.

Students can:

- Practice skill-specific tasks
- Track completed tasks
- View progress
- Work on project ideas
- Build practical experience

Practice progress is stored in the database so it remains available across sessions.

---

### 🛡️ Opportunity Safety

Career Lens helps students analyze job and internship opportunities for potential warning signs.

The safety engine checks for indicators such as:

- Payment or registration fee requests
- Training fee requests
- Requests for OTPs or passwords
- Bank-detail requests
- Guaranteed job claims
- Excessive urgency
- Unofficial communication channels
- Suspicious links
- Personal email addresses
- Cryptocurrency/payment requests

The system returns relevant warnings and a risk assessment.

> Career Lens provides safety signals and does not guarantee that an opportunity is legitimate or fraudulent.

---

### 🤖 Career Lens AI

Career Lens includes an AI assistant that acts as a career and learning companion.

It can help students with:

- Programming concepts
- Java
- JavaScript
- React
- Node.js
- Express
- MERN
- Python
- SQL
- DSA
- Debugging
- Coding questions
- Interview preparation
- Project guidance
- Career readiness
- Job/internship safety guidance

The AI can use Career Lens context such as:

- Target role
- Skill gaps
- Current page
- Practice progress
- Current task

This allows the assistant to provide more relevant guidance within the platform.

---

# 🏗️ System Architecture

```text
                         Career Lens
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
      Career Readiness                 Opportunity Safety
              │                               │
              ▼                               ▼
      Skill Assessment                  Safety Analysis
              │                               │
              ▼                               ▼
         Skill Gaps                     Risk Indicators
              │                               │
              ▼                               ▼
      Learning Roadmap                   Safety Result
              │
              ▼
      Practice & Projects
              │
              ▼
       Progress Tracking
              │
              └───────────────┬───────────────┘
                              ▼
                       Career Lens AI
```

---

# 🔄 Frontend & Backend Architecture

Career Lens uses a React frontend connected to a Node.js + Express backend through REST APIs.

```text
React Frontend
      │
      │ Axios / HTTP
      ▼
Node.js + Express
      │
      ├───────────────┐
      ▼               ▼
 PostgreSQL        Gemini AI
   + Prisma
```


# 🧑‍💻 Technology Stack

## Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router
- Lucide React
- Framer Motion

## Backend

- Node.js
- Express.js
- REST APIs
- JWT Authentication

## Database

- PostgreSQL
- Prisma ORM

## AI

- Google Gemini API

## Development Tools

- Git
- GitHub
- VS Code
- Postman

---

# 🔐 Authentication

Career Lens uses JWT-based authentication.

```text
User
 ↓
Login / Register
 ↓
Node + Express
 ↓
JWT Token
 ↓
Frontend
 ↓
Protected API Requests
 ↓
Backend verifies JWT
```

Protected features require authentication.

---

# 📊 Database Structure

Career Lens uses PostgreSQL because the application contains structured relationships between users, profiles, assessments, practice progress, and opportunities.

Prisma is used as the ORM for database access.

Major entities include:

```text
User
 │
 ├── CareerProfile
 │      │
 │      └── SkillAssessment
 │
 ├── PracticeProgress
 │
 └── OpportunityPosting
```

---

# 🔌 API Architecture

The React frontend communicates with the Node.js backend through REST APIs.

### Main API Modules

| Module | Endpoint | Purpose |
|---|---|---|
| Authentication | `/api/auth` | Login and registration |
| Profile | `/api/profile` | Career profile |
| Career | `/api/career` | Assessment, readiness and roadmap |
| Opportunity | `/api/opportunity` | Opportunity safety analysis |
| Practice | `/api/practice` | Practice tasks and progress |
| AI | `/api/ai` | Career Lens AI |

---

# 🛡️ Opportunity Safety Engine

The current prototype uses a **rule-based safety analysis engine** rather than claiming to train an ML model from scratch.

The system identifies known recruitment-risk indicators and produces explainable warnings.

```text
Job / Internship Information
            ↓
       Text Analysis
            ↓
    Warning Detection
            ↓
       Risk Signals
            ↓
    Risk Assessment
            ↓
  Warnings + Explanation
```

### Example

A message such as:

```text
Congratulations!
You have been selected for the internship.
Pay ₹2,999 as a registration fee within 2 hours.
```

may trigger indicators such as:

```text
Payment Request
      +
Urgency
      +
Selection/Job Claim
      ↓
Multiple Risk Signals
```

The system then presents the relevant warnings to the student.

---

# 🤖 Future ML Enhancement

The current version uses explainable rule-based detection.

A future version can use a labeled dataset containing legitimate and fraudulent job/internship postings to train an NLP classification model.

A hybrid system could combine:

```text
ML Classification
       +
Rule-Based Detection
       ↓
Explainable Safety Assessment
```

This could improve detection while keeping individual warning signals understandable to students.

---

# 🎯 Career Readiness Engine

Career Lens maintains role-specific skill requirements.

The student selects a target role and assesses their current skill level.

The platform then compares:

```text
Required Skills
      +
Student Skill Assessment
      ↓
Skill Comparison
      ↓
Covered / Developing / Missing
      ↓
Skill Gaps
      ↓
Learning Roadmap
```

This creates a personalized preparation path for the selected role.

---

# 📚 Learning System

Each identified skill gap can be connected to learning resources.

```text
Skill Gap
   ↓
Learning Resources
   ↓
Learn Skill
   ↓
Practice
   ↓
Project
   ↓
Progress Tracking
```

This allows students to move beyond simply knowing what they are missing and actually work on those skills.

---

# 💻 Practice & Progress Tracking

Career Lens stores practice progress in PostgreSQL.

Students can mark individual practice tasks as completed.

```text
Practice Task
     ↓
Student Completes Task
     ↓
POST /api/practice/progress
     ↓
PostgreSQL
     ↓
Progress Saved
```

When the student returns later, their previous progress can be retrieved.

---

# 🤖 AI Context

Career Lens AI can receive relevant platform context such as:

```text
Current Page
Target Role
Current Skill
Current Task
Skill Gaps
Practice Progress
```

For example:

```text
Target Role:
Frontend Developer

Skill Gaps:
React, TypeScript, APIs

Practice Progress:
6 tasks completed
```

This allows the AI assistant to provide responses that are more relevant to the student's current CareerShield journey.

---

# 🧑‍🎓 Target Users

Career Lens is primarily designed for:

- College students
- Fresh graduates
- Early-career developers
- Students from colleges with limited personalized career guidance
- Students searching for internships and entry-level opportunities

---

# 💡 What Makes Career Lens Different?

Career Lens does not try to replace existing learning platforms, coding platforms, job portals, or general AI assistants.

Instead, it connects different parts of the student's career journey.

```text
Career Preparation
        +
Learning
        +
Practice
        +
Progress Tracking
        +
Opportunity Safety
        +
AI Guidance
```

The goal is to provide one structured workflow from:

> **"What should I learn?"**

to:

> **"Am I ready?"**

to:

> **"How do I practice?"**

to:

> **"Is this opportunity safe to pursue?"**

---

# 🔄 Example User Journey

```text
1. Student creates an account
             ↓
2. Creates career profile
             ↓
3. Selects target role
             ↓
4. Assesses current skills
             ↓
5. CareerShield identifies skill gaps
             ↓
6. Student receives a learning roadmap
             ↓
7. Student learns missing skills
             ↓
8. Student completes practice tasks
             ↓
9. Progress is saved
             ↓
10. Student evaluates job/internship opportunities
             ↓
11. CareerShield identifies potential warning signs
             ↓
12. CareerShield AI provides additional guidance
```

---

# 📱 Application Modules

## Dashboard

Provides an overview of:

- Target role
- Skills assessed
- Covered skills
- Skill gaps
- Practice progress
- Safety checks

## Career Readiness

- Target role selection
- Skill assessment
- Skill coverage
- Skill gap identification
- Personalized roadmap

## Job Ready

- Pending skills
- Skills needing improvement
- Covered skills
- Learning resources
- Practice and project recommendations

## Learn Skill

- Skill-specific learning resources
- Learning checklist
- Suggested learning flow

## Practice

- Skill-based tasks
- Difficulty levels
- Completion tracking
- Project suggestions

## Opportunity Safety

- Job/internship analysis
- Risk indicators
- Safety warnings
- Analysis history

## Career Lens AI

- Career guidance
- Coding assistance
- Interview preparation
- Learning support
- Opportunity safety guidance

---

# 🔒 Security Considerations

Career Lens follows basic security practices including:

- JWT authentication
- Protected API routes
- Environment variables for secrets
- Password hashing
- Input validation
- Database relationships and constraints
- Explainable safety rules

For a future online coding workspace, arbitrary code execution should be isolated using a sandbox/container with:

- CPU limits
- Memory limits
- Execution timeouts
- Restricted network access
- Restricted filesystem access

---


# 📁 Project Structure

```text
Career Lens/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   └── ...
│   │   │
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── data/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   │
│   ├── prisma7.config.ts
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# 🔮 Future Scope

Future versions of Career Lens can include:

- AI-powered skill assessment
- ML/NLP-based job scam classification
- Resume analysis
- ATS compatibility analysis
- AI mock interviews
- Coding workspace with sandboxed execution
- Real-time interview practice
- Verified employer profiles
- Opportunity verification
- Personalized job recommendations
- College/institution dashboards
- Advanced career analytics
- Mobile application

---

# 🌱 Vision

Career Lens aims to help students move through their career journey with more clarity, preparation, and awareness.

### Prepare. Practice. Protect.

## 🛡️ Career Lens

**Build your career. Protect your opportunity.**

---

## 👨‍💻 Built With

React • Vite • Tailwind CSS • Node.js • Express.js • PostgreSQL • Prisma • Google Gemini • JWT
