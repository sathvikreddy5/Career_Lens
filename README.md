# 🛡️ Career Lens

### Build your career. Protect your opportunity.

Career Lens is a career-readiness and opportunity-safety platform designed for college students and early-career job seekers.

It helps students understand **what skills they need for their target role, what they are currently missing, what they should learn and practice next, and whether a job or internship opportunity contains potential warning signs.**

---

## -> Overview

Many college students face two major problems when preparing for their careers:

- They don't know exactly which skills are required for their target role.
- They struggle to identify suspicious jobs, internships, and recruitment messages.

 Career Lens brings both problems into one platform.

### Career Lens Workflow

```text
Profile
   ↓
Choose Target Role
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
 Career Lens AI

```

-> Key Features
 Career Readiness

Students can create their career profile and select their target role.

 Career Lens compares their current skills with the skills required for that role.

It categorizes skills into:

✅ Covered
🟡 Developing
🔴 Missing

This helps students understand where they should focus.

📚 Personalized Learning Roadmap

Based on identified skill gaps, CareerShield provides:

Learning resources
Skill-specific recommendations
Learning sequence
Practice suggestions
Project ideas

Students can move from identifying a gap to actually working on it.

💻 Practice & Projects

CareerShield provides hands-on practice tasks for important technical skills.

Students can:

Practice skill-specific tasks
Track completed tasks
View progress
Work on project ideas
Build practical experience

Practice progress is stored in the database so it remains available across sessions.

🛡️ Opportunity Safety

CareerShield helps students analyze job and internship opportunities for potential warning signs.

The safety engine checks for indicators such as:

Payment or registration fee requests
Training fee requests
Requests for OTPs or passwords
Bank-detail requests
Guaranteed job claims
Excessive urgency
Unofficial communication channels
Suspicious links
Personal email addresses
Cryptocurrency/payment requests

The system returns relevant warnings and a risk assessment.

CareerShield provides safety signals and does not guarantee that an opportunity is legitimate or fraudulent.

🤖 CareerShield AI

CareerShield includes an AI assistant that acts as a career and learning companion.

It can help students with:

Programming concepts
Java
JavaScript
React
Node.js
Express
MERN
Python
SQL
DSA
Debugging
Coding questions
Interview preparation
Project guidance
Career readiness
Job/internship safety

The AI can use CareerShield context such as:

Target role
Skill gaps
Current page
Practice progress
Current task

This allows the assistant to provide more relevant guidance within the platform.

🏗️ System Architecture
                    CareerShield
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
   Career Readiness              Opportunity Safety
          │                             │
          ▼                             ▼
   Skill Assessment              Safety Analysis
          │                             │
          ▼                             ▼
     Skill Gaps                  Risk Indicators
          │                             │
          ▼                             ▼
  Learning Roadmap                Safety Result
          │
          ▼
   Practice & Projects
          │
          ▼
    Progress Tracking
          │
          └──────────────┬──────────────┘
                         ▼
                  CareerShield AI
🧑‍💻 Technology Stack
Frontend
React
Vite
Tailwind CSS
Axios
React Router
Lucide React
Framer Motion
Backend
Node.js
Express.js
REST APIs
JWT Authentication
Database
PostgreSQL
Prisma ORM
AI
Google Gemini API
Development Tools
Git
GitHub
VS Code
Postman
🔐 Authentication

CareerShield uses JWT-based authentication.

The authentication flow is:

User
 ↓
Login / Register
 ↓
Node + Express
 ↓
JWT Token
 ↓
Frontend stores authentication token
 ↓
Token sent with protected API requests
 ↓
Backend verifies token

Protected features require authentication.

📊 Database Structure

CareerShield uses PostgreSQL because the application contains structured relationships between users, profiles, assessments, practice progress, and opportunities.

Prisma is used as the ORM for database access.

Major entities include:

User
 │
 ├── CareerProfile
 │      │
 │      └── SkillAssessment
 │
 ├── PracticeProgress
 │
 └── OpportunityPosting
🔌 API Architecture

The React frontend communicates with the Node.js backend through REST APIs.

Example:

React
  ↓
Axios
  ↓
Express API
  ↓
Controller
  ↓
Service
  ↓
PostgreSQL / External AI Service
  ↓
JSON Response
  ↓
React UI
