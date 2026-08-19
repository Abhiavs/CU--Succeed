# SucceedAcademy

> Enterprise-grade digital ecosystem for student employability diagnostics, psychometric assessment, aptitude benchmarking, and competency verification.

**SucceedAcademy** is a full-stack assessment platform built with Next.js 16, TypeScript, Tailwind CSS, and Shadcn UI. It empowers institutions to evaluate students across three comprehensive pillars: **Psychometric Matrix**, **Aptitude Precision**, and an interactive **Wheel of Competencies**, generating verified scorecards and credentials.

---

## 🗺️ Standard Assessment Flow

```
HOME
  ↓
SELECT TYPE (Pre / Post)
  ↓
SELECT YEAR (1st / 2nd / 3rd / 4th)
  ↓
REGISTER (Name / Roll / Branch / College)
  ↓
STUDENT DASHBOARD
  ↓
┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
│   PSYCHOMETRIC MATRIX   │    APTITUDE PRECISION   │  WHEEL OF COMPETENCIES  │
│  • Situational Judgment │  • 15-Min Timed Exam    │  • 8-Dimension Radar    │
│  • 5-Point Likert Scale │  • Question Navigator   │  • Live Polygon Morph   │
│  • Trait Classification │  • Sectional Accuracy   │  • Benchmark Comparison │
└────────────┬────────────┴────────────┬────────────┴────────────┬────────────┘
             └─────────────────────────┼─────────────────────────┘
                                       ↓
                           RESULTS & CERTIFICATE
                             • Composite Readiness Score & Percentile
                             • Psychometric Archetype Analysis
                             • Aptitude Sectional Breakdown
                             • Radar Chart vs Target Benchmark
                             • Actionable Growth Roadmap
                             • Official Digital Certificate (Print/PDF)
```

---

## ✨ Key Features

### 🎓 Student Assessment Ecosystem
- **6-Step Progressive Workflow** — Frictionless journey from initial onboarding to verified accreditation.
- **Pre & Post Diagnostics** — Measure baseline skill levels before training and evaluate growth post-course.
- **Pillar 1: Psychometric Matrix** — Scenario-based psychological evaluation (Emotional Resilience, Teamwork, Leadership, Ethics).
- **Pillar 2: Aptitude Precision** — Timed quantitative, logical reasoning, and verbal communication examination with real-time question navigator palette.
- **Pillar 3: Wheel of Competencies** — Interactive 8-dimension rating radar with dynamic SVG polygon morphing comparing student ratings against industry benchmarks.
- **Executive Results Hub** — Composite Readiness Index, percentile ranking, competency archetype, and actionable growth plan.
- **Verified Digital Certificate** — Official credential with unique verification code (`SUC-EMP-2026-XXXX`) and Print/Save PDF support.
- **Theme Switcher** — Seamless Light & Dark mode toggle in the navigation bar with instant persistence.

### 🛡️ Official (Admin) Portal
- **Management Dashboard** — Real-time tracking of student completion metrics, batch analytics, and test distributions.
- **Question Bank** — Manage questions with category tagging and weighting.
- **Assessment Builder** — Configure Pre/Post tests for specific academic programs.
- **Certificate Verification** — View, issue, and inspect student certification records.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router + Turbopack) |
| **UI & Components** | Shadcn UI, Radix UI Primitives, Lucide Icons |
| **Styling** | Tailwind CSS v4 (Light & Dark Theme Switcher) |
| **Language** | TypeScript 5 |
| **Database** | MySQL (with In-Memory & Local Storage Fallback) |
| **ORM** | Prisma ORM 6 |
| **Auth** | NextAuth.js (JWT Credentials Provider) |
| **Data Viz** | Custom SVG Radar Visualizer, Recharts, Progress Components |

---

## 🗄️ Database Management (Prisma)

The application uses Prisma ORM with MySQL. Follow these commands to manage your database schema and client:

### 1. Update Prisma Schema
Edit [`prisma/schema.prisma`](prisma/schema.prisma) to add or modify models, relations, or fields.

### 2. Generate Prisma Client
Whenever you update `schema.prisma`, regenerate the TypeScript Prisma Client:

```bash
npm run db:generate
# or: npx prisma generate
```

### 3. Push Schema Changes to Database
Push schema updates directly to your MySQL database without manual migrations:

```bash
npm run db:push
# or: npx prisma db push
```

### 4. Create Migrations (Production)
```bash
npm run db:migrate
# or: npx prisma migrate dev
```

### 5. Open Prisma Studio (Database GUI)
Explore and manage database records visually in your browser:

```bash
npm run db:studio
# or: npx prisma studio
```

---

## 🚀 Quick Setup & Installation

### Prerequisites
- **Node.js** v18+ 
- **MySQL** running locally (e.g. XAMPP, WAMP, MySQL Server on port `3306`)
- **npm**

### 1. Clone & Install
```bash
git clone <repository-url>
cd succeed
npm install
```

### 2. Configure Environment Variables
Create or verify `.env`:
```env
DATABASE_URL="mysql://root:root@localhost:3306/cusucceed"
NEXTAUTH_SECRET="your_secret_key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Initialize Database & Seed (One Command)
```bash
npm run setup
```
*This executes `prisma generate`, `prisma db push`, and seeds admin and assessment question data.*

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `next dev` | Start development server on `localhost:3000` |
| `npm run build` | `next build` | Compile optimized production build |
| `npm run start` | `next start` | Launch production server |
| `npm run db:generate` | `prisma generate` | Generate Prisma Client |
| `npm run db:push` | `prisma db push` | Push Prisma schema to MySQL |
| `npm run db:migrate` | `prisma migrate dev` | Run Prisma migration workflow |
| `npm run db:studio` | `prisma studio` | Open web-based DB visualizer |
| `npm run seed:admin` | `node scripts/seedAdmin.mjs` | Create default admin account |
| `npm run seed:data` | `node scripts/seedData.mjs` | Seed mock assessment questions |
| `npm run setup` | `...` | Full automated DB generation, push & seeding |

---

## 🔑 Default Credentials

| Role | Email | Password |
|---|---|---|
| **Admin (Official)** | `admin@succeed.com` | `admin123` |
| **Student** | Any email via `/start` | Your registered password |

---

## 📁 Directory Structure

```
succeed/
├── prisma/
│   └── schema.prisma             # Prisma Database schema models
├── scripts/
│   ├── seedAdmin.mjs             # Admin user seeder
│   ├── seedData.mjs              # Assessment & Question bank seeder
│   └── enrollStudents.mjs        # Student enrollment script
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home landing page with workflow figure
│   │   ├── start/page.tsx        # 3-Step Wizard (Type -> Year -> Register)
│   │   ├── login/page.tsx        # Student login
│   │   ├── signup/page.tsx       # Student registration
│   │   ├── admin-login/          # Official admin login
│   │   ├── student/
│   │   │   ├── page.tsx          # Student Dashboard (3 assessment tracks)
│   │   │   ├── assessment/
│   │   │   │   ├── psychometric/ # Psychometric matrix module
│   │   │   │   └── aptitude/     # Timed aptitude examination
│   │   │   ├── wheel/page.tsx    # Interactive Wheel of Competencies
│   │   │   ├── results/page.tsx  # Composite results & digital certificate
│   │   │   └── reports/page.tsx  # Reports hub
│   │   ├── admin/                # Official management portal
│   │   └── api/                  # Backend REST API routes
│   │       ├── auth/             # NextAuth & registration
│   │       ├── assessments/      # Scoring and attempt evaluation
│   │       ├── wheel/            # WheelScore persistence
│   │       └── student/          # Aggregate student state
│   ├── components/
│   │   ├── ui/                   # Shadcn UI primitives (Button, Card, Badge, Slider, etc.)
│   │   ├── Navbar.tsx            # Navigation header with ThemeToggle
│   │   └── ThemeToggle.tsx       # Light / Dark mode switcher
│   └── lib/
│       ├── assessmentData.ts     # Questions, 8-wheel dimensions & scoring logic
│       ├── store.ts              # In-memory resilient state store
│       ├── prisma.ts             # Prisma client singleton
│       └── utils.ts              # Tailwind CSS class merge helper
├── package.json
└── README.md
```

---

## 📄 License
Private & Proprietary • Built for SucceedAcademy Employability Initiative.
