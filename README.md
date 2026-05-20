# SchoolFlow — Frontend

SchoolFlow is a multi-tenant school management SaaS platform built for Nigerian schools. It connects schools, parents, and platform administrators in one secure product — handling everything from student enrollment and fee payments to academic results, attendance, and parent-school communication.

---

## What We Are Building

### The Problem
Nigerian schools still rely heavily on paper, manual fee collection, and WhatsApp groups with no structure. Parents have no single place to track their child's fees, results, or school communications. Schools have no modern tool to manage admissions, student data, and finances together.

### The Solution
SchoolFlow gives every school its own branded portal (`schoolname.schoolflow.com`) and every parent a mobile-friendly dashboard — all powered by a shared platform that handles payments via OPay, automated notifications via WhatsApp, PDF report cards, and more.

---

## Three Portals

| Portal | URL Pattern | Users |
|--------|-------------|-------|
| **School Portal** | `[subdomain].schoolflow.com` | Principals, teachers, bursars, admin staff |
| **Parent Portal** | `app.schoolflow.com` | Parents and guardians |
| **Platform Admin** | `admin.schoolflow.com` | SchoolFlow internal team (separate repo: `cms-frontend`) |

---

## Tech Stack

- **Framework** — Next.js 16 (App Router)
- **Styling** — Tailwind CSS v4 with `@theme inline` design tokens
- **UI Components** — shadcn/ui
- **Forms** — react-hook-form + Zod validation
- **State** — Zustand (auth), TanStack Query (server state)
- **Font** — Bricolage Grotesque (Google Fonts)
- **API** — Fully mocked (mock client with 600ms simulated delay — backend not yet connected)
- **Language** — TypeScript

---

## What Has Been Built

### Homepage (`/`)
- Navbar with Login/Register CTA
- **Hero section** — split layout with heading, subtext, CTA and mother+child image
- **Portal Cards** — "As a School" and "As a Parent" entry points
- **How It Works** — 4-step guide with graduation photo and step cards
- **Why Choose Us** — 4 feature cards with custom icons
- **Bottom CTA** — split panel with payfee image and dark green call-to-action

### School Auth
- **Register** (`/school/register`) — 3-step form: school info → admin account → subdomain selection with live availability check
- **Login** (`/school/login`) — email + password with mock auth and redirect to dashboard

### Parent Auth
- **Register / Login** (`/parent/register`) — full-page split layout (green photo panel + white form panel) with:
  - Sign up form: name, email, phone, password, terms checkbox
  - Login form: email + password + forgot password
  - Tab switching between Sign up and Login
  - Email OTP verification: 6-digit code boxes, 60-second resend countdown, verify button

### Design System
- All colors as CSS custom properties in `globals.css` (single source of truth)
- Key tokens: `brand-green`, `brand-green-dark`, `brand-mint`, `brand-orange`, `text-heading`, `text-body`, `surface-card`, `border-default`
- All Figma measurements implemented in Tailwind v4 canonical spacing units

### Mock API Layer (`src/lib/api/`)
- `auth.ts`, `parents.ts`, `students.ts`, `grades.ts`, `fees.ts`, `applications.ts`, `notifications.ts`, `pta.ts`, `attendance.ts`
- All return typed mock data with 600ms simulated network delay

---

## What Is Coming Next

### School Portal Pages
- Dashboard with stats (students, fees collected, pending applications)
- Students list and student detail
- Staff management
- Admissions — receive, review, schedule, admit/reject applications
- Attendance recording
- Grades — CA entry, exam scores, publish results
- Fees — fee types, invoice generation, bursar dashboard
- Announcements and audit log
- Settings — onboarding wizard, grading system, admissions config

### Parent Portal Pages
- Dashboard — linked children, quick stats
- School search and discovery
- Child detail — fees, results, attendance, messages
- Application submission and tracking
- Notification centre with preferences
- Fee payment flow (OPay checkout)
- Performance trend graph (term-over-term)

### School KYC & Onboarding
- 4-step KYC form (documents, proprietor info, bank account)
- Onboarding wizard (logo, classes, academic year, invite proprietor)
- Getting-started checklist on first login

---

## Running Locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

---

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    page.tsx              # Homepage
    school/               # School auth pages
    parent/               # Parent auth & dashboard pages
  components/
    home/                 # Homepage section components
    school/auth/          # School register & login forms
    parent/auth/          # Parent sign up, login, OTP verify
    ui/                   # shadcn primitives
  lib/
    api/                  # Mock API functions + data
    validations/          # Zod schemas
  context/                # AuthContext (user, role, school_id)
  layout/                 # Shared layouts (auth, dashboard, sidebar)
  shared/                 # Reusable components (table, card, modals)
  types/                  # TypeScript interfaces
```

---

## Design Reference

All sections are implemented pixel-by-pixel from the SchoolFlow Figma file using exact measurements (position, dimensions, auto-layout gap, padding, corner radius, typography) converted to Tailwind v4 spacing units (`px ÷ 4`).
