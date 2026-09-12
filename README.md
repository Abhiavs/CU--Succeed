# CU-SUCCEED Assessment Platform

A comprehensive full-stack student assessment and development platform built for measuring competency growth through PRE and POST evaluations.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## Overview

CU-SUCCEED is a student assessment platform that tracks competency development through a complete evaluation journey. Students complete PRE assessments before training, then POST assessments afterward — enabling data-driven measurement of skill growth across multiple dimensions.

## Key Features

### Student Portal
- **PRE Assessment Stage**
  - Psychometric evaluation with situational judgment questions
  - 8-dimension competency wheel (self-rating across communication, leadership, teamwork, problem-solving, etc.)
  - Interactive SVG radar chart visualization
  
- **POST Assessment Stage**
  - POST competency wheel for measuring post-training growth
  - Side-by-side PRE vs POST comparison
  - Certificate generation upon completion

- **Progress Dashboard**
  - Real-time completion tracking
  - Module status indicators
  - Personal profile with roll number, branch, year

### Admin Portal
- **Assessment Management**
  - Create and configure psychometric assessments
  - Question bank with CRUD operations
  - Bulk question import and management
  
- **Wheel Dimensions**
  - Manage PRE and POST competency dimensions separately
  - Toggle dimension visibility and order
  - Publish/unpublish POST assessment access

- **Student Management**
  - View all student attempts and scores
  - Grant reattempt permissions
  - Track completion rates

- **Results & Analytics**
  - Compare PRE vs POST scores
  - Generate performance reports
  - Certificate management

## Tech Stack

**Frontend**
- Next.js 16 (App Router)
- React 19 with TypeScript
- TailwindCSS + shadcn/ui components
- Recharts for data visualization

**Backend**
- Next.js API Routes
- Prisma ORM
- PostgreSQL database
- NextAuth.js for authentication

**Architecture**
- Server-side rendering (SSR)
- REST API design
- Role-based access control (STUDENT, OFFICIAL)
- Database-driven state management

## Getting Started

### Local development vs Hosted

This project is designed to run in **both** environments at the same time — you keep
building features locally while a production copy is live. The code is identical; only
environment variables differ.

| Variable | Local dev (`.env`) | Hosted (Railway / Render / Fly) |
| --- | --- | --- |
| `DATABASE_URL` | Your **local** PostgreSQL | The platform's **hosted** PostgreSQL |
| `NEXTAUTH_URL` | `http://localhost:3000` | `https://<your-app>.onrender.com` (public URL) |
| `NEXTAUTH_SECRET` | Any dev random secret | A **separately generated** secret (`openssl rand -base64 32`) |

- **Develop locally:** follow *Installation* below → `npm run dev`.
- **Deploy to the cloud:** follow **[DEPLOYMENT.md](DEPLOYMENT.md)** — nothing in the code changes.

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL database (local for dev; a separate hosted one for production)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Abhiavs/CU--Succeed.git
cd CU--Succeed
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Copy the example file and configure your local credentials:
```bash
cp .env.example .env
```

Edit `.env` with your **local** values (this file is git-ignored — never committed):

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
NEXTAUTH_SECRET="generate-a-long-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

> For the **hosted / production** copy (Railway, Render, Fly), you do **not** use this
> file — you set the same variable names in the host dashboard, pointing at a **separate**
> hosted PostgreSQL. See **[DEPLOYMENT.md](DEPLOYMENT.md)**.

4. Set up the database
```bash
npx prisma generate
npx prisma db push
```

5. Seed initial data (admin account + assessments)
```bash
npm run seed
# or visit: http://localhost:3000/api/seed
```

Default admin credentials:
- Email: `admin@cusucceed.com`
- Password: `admin123`

6. Run the development server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── admin/          # Admin portal pages
│   ├── student/        # Student dashboard and assessments
│   ├── api/            # API routes
│   └── ...
├── components/
│   └── ui/             # Reusable UI components (shadcn/ui)
├── lib/
│   ├── auth.ts         # NextAuth configuration
│   ├── prisma.ts       # Prisma client
│   └── utils.ts        # Utility functions
└── types/              # TypeScript definitions

prisma/
└── schema.prisma       # Database schema
```

## Database Schema

Key models:
- `User` — Students and admins with role-based access
- `Assessment` — Psychometric assessments with questions
- `Attempt` — Student submission records
- `WheelScore` — PRE/POST competency wheel scores
- `WheelDimension` — Configurable competency dimensions
- `Certificate` — Generated certificates for completed students

## Security

- Passwords hashed with bcrypt
- NextAuth.js session management
- Role-based route protection
- Environment variables for sensitive data
- Database credentials never committed to git

## Development Workflow

1. PRE stage: Student completes psychometric assessment + competency wheel
2. Training/development period
3. POST stage: Student completes POST competency wheel
4. System compares PRE vs POST to show growth
5. Certificate generated upon completion

## License

Built for educational assessment and student development.

---

**Note:** Change default admin credentials immediately in production environments.
