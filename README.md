# SucceedAcademy

> The complete digital platform for student assessment, training, and employability development.

**SucceedAcademy** is a full-stack web application. It provides a premium, modern interface for managing student assessments across multiple courses, with role-based access for Students and Officials (Admins).

---

## ✨ Features

### 🎓 Student Portal

- **Course-wise Dashboard** — Students see only the courses they are enrolled in, with per-course assessment cards showing completion status.
- **Take Assessments** — Dynamic, timed assessments loaded from the database with polished radio-button UI.
- **Automated Grading** — Answers are graded server-side against the question bank, and scores are saved instantly.
- **Reports & Certificates** — View detailed score reports and earn certificates for passing assessments.

### 🛡️ Admin (Official) Portal

- **Live Dashboard** — Real-time stats: student count, active assessments, question bank size, and completion rate.
- **Question Bank** — Create, view, and manage multiple-choice questions with category tagging.
- **Assessment Builder** — Create new assessments, assign them to a course, and pick exactly which questions to include.
- **Recent Activity Feed** — See the latest student completions with scores in real-time.

### 🔐 Authentication

- Separate Student and Admin login portals.
- Role-based access control (RBAC) — students can't access admin routes and vice versa.
- Auto-enrollment: new students are automatically enrolled in the default course.

---

## 🛠️ Tech Stack

| Layer         | Technology                |
| ------------- | ------------------------- |
| **Framework** | Next.js 16 (App Router)   |
| **Language**  | TypeScript                |
| **Styling**   | Tailwind CSS 4            |
| **Database**  | MySQL (local)             |
| **ORM**       | Prisma 6                  |
| **Auth**      | NextAuth.js (Credentials) |
| **Icons**     | Lucide React              |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or later
- **MySQL** server running locally (e.g., XAMPP, WAMP, or standalone MySQL)
- **npm** (comes with Node.js)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd succeed
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root (or edit the existing one):

```env
DATABASE_URL="mysql://root:your_password@localhost:3306/succeed_academy"
NEXTAUTH_SECRET="your_super_secret_key_here"
NEXTAUTH_URL="http://localhost:3000"
```

> **Note:** Replace `your_password` with your MySQL root password. If you have no password, use `mysql://root:@localhost:3306/succeed_academy`.

### 4. Create the database

Open your MySQL client (phpMyAdmin, MySQL Workbench, or CLI) and create the database:

```sql
CREATE DATABASE succeed_academy;
```

### 5. Push the schema & seed data (one command)

```bash
npm run setup
```

This single command will:

1. Push the Prisma schema to your MySQL database (create all tables).
2. Create a default Admin account.
3. Seed sample questions and an assessment.
4. Enroll existing students in the default course.

> **Or run each step individually:**
>
> ```bash
> npm run db:push        # Create tables
> npm run seed:admin     # Create admin account
> npm run seed:data      # Seed questions & assessment
> npm run seed:enroll    # Enroll students in default course
> ```

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Credentials

| Role    | Email                 | Password   |
| ------- | --------------------- | ---------- |
| Admin   | `admin@succeed.com`   | `admin123` |
| Student | Sign up via `/signup` | (your own) |

---

## 📁 Project Structure

```
succeed/
├── prisma/
│   └── schema.prisma         # Database schema
├── scripts/
│   ├── seedAdmin.mjs         # Create default admin
│   ├── seedData.mjs          # Seed questions & assessments
│   └── enrollStudents.mjs    # Enroll students in courses
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── login/                # Student login
│   │   ├── signup/               # Student registration
│   │   ├── admin-login/          # Admin login
│   │   ├── admin/                # Admin portal (layout + pages)
│   │   │   ├── layout.tsx        # Sidebar layout
│   │   │   ├── page.tsx          # Dashboard
│   │   │   ├── assessments/      # Assessment management
│   │   │   ├── questions/        # Question bank
│   │   │   ├── results/          # Result generation
│   │   │   ├── certificates/     # Certificate management
│   │   │   └── matrix/           # Training matrix
│   │   ├── student/              # Student portal
│   │   │   ├── page.tsx          # Student dashboard
│   │   │   ├── assessment/[id]/  # Take assessment (dynamic)
│   │   │   └── reports/          # View reports
│   │   └── api/                  # API routes
│   │       ├── auth/             # Auth (signup, NextAuth)
│   │       ├── assessments/      # Assessment CRUD & grading
│   │       └── questions/        # Question CRUD
│   ├── components/               # Shared components
│   └── lib/                      # Prisma client, auth config
├── package.json
└── README.md
```

---

## 📜 Available Scripts

| Script                | Description                                  |
| --------------------- | -------------------------------------------- |
| `npm run dev`         | Start the development server                 |
| `npm run build`       | Create a production build                    |
| `npm run start`       | Start the production server                  |
| `npm run setup`       | Full setup: push DB + seed admin + seed data |
| `npm run db:push`     | Push Prisma schema to MySQL                  |
| `npm run seed:admin`  | Create the default admin account             |
| `npm run seed:data`   | Seed sample questions and assessment         |
| `npm run seed:enroll` | Enroll existing students in default course   |

---

## 🎨 Design

The UI follows a **Premium Dark Theme** with:

- Glassmorphism card effects
- Neon accent glows (emerald green for primary, blue for secondary)
- Smooth micro-animations and hover transitions
- Responsive design that works on mobile and desktop

---

## 📄 License

This project is private and built for the CU-SUCCEED initiative.
