# SchoolFlow — Sprint Plan (Phase 0 + Phase 1 Launch)

**Goal:** Get a school registered, verified, onboarded, and collecting student data online.  
**Duration:** 5 sprints × 2 weeks = 10 weeks  
**Stack:** Java (Backend) · Next.js (Frontend) · PostgreSQL · AWS S3 · WhatsApp Business API  
**Covers:** Phase 0 (School Registration & Onboarding) + Phase 1 (Data Collection)

---

## Sprint Overview

| Sprint   | Focus                                      | Weeks |
| -------- | ------------------------------------------ | ----- |
| Sprint 1 | Foundation — Database, Auth, Project Setup | 1–2   |
| Sprint 2 | School Registration & Email Verification   | 3–4   |
| Sprint 3 | KYC Submission & Platform Admin Review     | 5–6   |
| Sprint 4 | Onboarding Wizard & Admin Dashboard        | 7–8   |
| Sprint 5 | Student Data Collection (Phase 1)          | 9–10  |

---

## Sprint 1 — Foundation (Weeks 1–2)

**Goal:** Project is set up, database is live, authentication works, and both teams can start building on top of it.

### Backend

- [ ] Initialize Java project (Spring Boot) with folder structure: `controllers`, `services`, `repositories`, `models`, `config`
- [ ] Set up PostgreSQL — master DB and one test school DB
- [ ] Write SQL migrations for all Phase 0 tables:
  - `schools` (with `kyc_status`, `status`, `visibility`, `payments_enabled`, `subdomain`)
  - `users` (role enum: `super_admin | school_admin | teacher | parent | bursar`)
  - `staff`
  - `kyc_submissions`
  - `kyc_documents`
  - `school_onboarding`
  - `academic_years`
  - `terms`
  - `classes`
  - `students`
  - `enrollments`
  - `student_parents`
- [ ] Enable Row Level Security (RLS) on all tables — every query must be scoped by `school_id`
- [ ] Implement JWT authentication (access token + refresh token)
- [ ] Build auth middleware — validates JWT on all protected routes
- [ ] Set up AWS S3 bucket + upload service (used later for KYC docs and logos)
- [ ] Set up email service (SMTP or SendGrid) — needed for verification and KYC notifications
- [ ] Write a health-check endpoint `GET /api/health`
- [ ] Set up environment config (`.env`) for dev, staging, production

### Frontend

- [ ] Initialize Next.js project with TypeScript
- [ ] Set up subdomain routing — `[subdomain].schoolflow.com` resolves to the school's dashboard; `www.schoolflow.com` is the public site
- [ ] Set up component library shadcn/ui and global design tokens (colours, fonts, spacing)
- [ ] Build reusable components: `Button`, `Input`, `Select`, `FileUpload`, `StepIndicator`, `Modal`, `Toast`
- [ ] Set up Axios (or fetch wrapper) with JWT interceptor — auto-attaches token to every request, handles 401 refresh
- [ ] Build the public landing page for schools (`/for-schools`) — hero section, feature list, CTA button "Register Your School"
- [ ] Set up routing structure:
  - `/register` — school registration
  - `/verify-email` — email verification
  - `/login` — school admin login
  - `/[school]/dashboard` — admin dashboard (protected)
  - `/[school]/kyc` — KYC form (protected)
  - `/[school]/onboarding` — setup wizard (protected)
  - `/admin` — platform super-admin panel (protected, separate role)

**Definition of Done:** Database is running with all tables. A test school record can be inserted and queried with RLS enforced. JWT auth works (login returns token, protected route rejects without token). Landing page is live at localhost.

---

## Sprint 2 — School Registration & Email Verification (Weeks 3–4)

**Goal:** A school can register, receive a verification email, and log in for the first time.

### Backend

- [ ] `POST /api/schools/check-subdomain` — returns `{ available: true/false }` (called in real time as admin types)
- [ ] `POST /api/schools/register` — validates all fields, creates:
  - Tenant record in master DB (`status: pending_kyc`, `kyc_status: not_submitted`, `visibility: hidden`, `payments_enabled: false`)
  - School-specific database (run migration scripts programmatically)
  - Admin staff record with full permissions
  - Sends verification email with a signed token link (expires in 24 hours)
- [ ] `GET /api/schools/verify-email?token=xxx` — validates token, sets `email_verified: true` on the user record
- [ ] `POST /api/auth/resend-verification` — resends the verification email
- [ ] `POST /api/auth/login` — validates credentials, returns JWT access + refresh tokens; rejects unverified emails
- [ ] `POST /api/auth/refresh` — exchanges refresh token for a new access token
- [ ] `POST /api/auth/logout` — invalidates refresh token

### Frontend

- [ ] Build 3-step school registration form:
  - **Step 1:** School name, school type (multi-select checkboxes: Nursery / Primary / Secondary), address, city/LGA, state (dropdown of all 36 states + FCT), phone, email
  - **Step 2:** Admin full name, position (dropdown), email, phone, password + confirm password
  - **Step 3:** Subdomain input with real-time availability check (debounced call to `/api/schools/check-subdomain`), Terms + Privacy Policy checkboxes
  - Progress indicator showing steps 1 / 2 / 3
  - "Back" and "Continue" navigation; form state preserved when going back
- [ ] Build email verification page — shows "check your inbox" message, has "Resend" button
- [ ] Build email verified success page — auto-redirects to login after 3 seconds
- [ ] Build login page — email + password, "Forgot password" link (placeholder for now)
- [ ] On login, store JWT in `httpOnly` cookie (not localStorage)
- [ ] Redirect to `/[school]/onboarding` on first login, `/[school]/dashboard` on subsequent logins

**Definition of Done:** A school can complete registration, receive and click the verification email, log in, and land on the dashboard. Subdomain check works in real time. Duplicate subdomains are rejected.

---

## Sprint 3 — KYC Submission & Platform Admin Review (Weeks 5–6)

**Goal:** School can submit KYC documents. Platform admin can review, approve, or reject them.

### Backend

- [ ] `POST /api/kyc/upload-document` — accepts a file upload, stores it in S3, returns the S3 URL; validates file type (PDF/JPG/PNG) and size (max 5MB)
- [ ] `POST /api/kyc/submit` — saves the full KYC submission record:
  - Links uploaded S3 URLs to `kyc_documents` rows
  - Creates a `kyc_submissions` record with `status: under_review`
  - Updates `schools.kyc_status` to `under_review`
  - Sends "submission received" email to school admin
- [ ] `GET /api/kyc/status` — returns current KYC status for the logged-in school
- [ ] Bank account name-enquiry — call a Nigerian bank verification API (e.g. Paystack's `/bank/resolve` endpoint) to verify account name matches before submission
- [ ] **Platform Admin endpoints (role: `super_admin` only):**
  - `GET /api/admin/kyc/pending` — list all schools with `kyc_status: under_review`
  - `GET /api/admin/kyc/:school_id` — full KYC detail for one school (all documents, proprietor info, bank details)
  - `POST /api/admin/kyc/:school_id/approve` — flips school to `status: active`, `kyc_status: approved`, `visibility: public`, `payments_enabled: true`; sends approval email
  - `POST /api/admin/kyc/:school_id/reject` — stores rejection reason; sends rejection email; school can resubmit
  - `POST /api/admin/kyc/:school_id/request-info` — sends a message to the school asking for more information

### Frontend

- [ ] Build KYC status banner — shown on dashboard until KYC is approved; displays current status (not submitted / under review / approved / rejected) with colour coding
- [ ] Build 4-step KYC form:
  - **Step 1 — School documents:** three file upload fields (registration cert, operating licence, proof of address); each shows upload progress and preview thumbnail after upload
  - **Step 2 — Proprietor info:** name, ID type dropdown, ID number, ID front photo upload, ID back photo upload, phone, email
  - **Step 3 — Bank account:** bank name dropdown (all Nigerian banks), account number input, "Verify" button that calls name-enquiry API and auto-fills account name, account type radio
  - **Step 4 — Review:** summary of all submitted info; two confirmation checkboxes; "Submit" button
- [ ] Build KYC rejection screen — shows the rejection reason message from the platform admin; "Update and Resubmit" button takes school back to the KYC form with existing data pre-filled
- [ ] **Platform Admin panel (`/admin` — separate login):**
  - KYC queue page: table of pending schools (name, location, submitted date, proprietor name)
  - KYC review page per school: shows all document previews (inline PDF viewer / image viewer), proprietor details, bank account; per-document approve/reject radio with notes field; overall decision section (Approve / Reject / Request More Info); internal notes field; message-to-school field

**Definition of Done:** A school can submit KYC documents. The platform admin can log in, view submissions, open documents, and approve or reject. On approval, the school's dashboard banner changes to "KYC Approved." On rejection, the school sees the reason and can resubmit.

---

## Sprint 4 — Onboarding Wizard & Admin Dashboard (Weeks 7–8)

**Goal:** Admin completes the guided setup. Dashboard is functional with classes, academic year, and stats.

### Backend

- [ ] `POST /api/onboarding/logo` — uploads school logo to S3, updates `schools.logo_url`
- [ ] `POST /api/onboarding/classes` — saves selected class list for the school to `classes` table
- [ ] `POST /api/onboarding/academic-year` — creates `academic_years` and `terms` records for the school
- [ ] `POST /api/onboarding/invite-proprietor` — creates a `pending` user record for the proprietor; sends invitation email with a link to set their password
- [ ] `GET /api/onboarding/progress` — returns which wizard steps are complete (from `school_onboarding` table)
- [ ] `POST /api/onboarding/complete` — marks onboarding as finished
- [ ] `GET /api/dashboard/stats` — returns: total students, total staff, total fee balance outstanding, total pending applications
- [ ] `GET /api/classes` — list all classes for the school
- [ ] `POST /api/classes` — create a class
- [ ] `PUT /api/classes/:id` — rename a class
- [ ] `DELETE /api/classes/:id` — soft-delete a class (only if no students are enrolled)
- [ ] Staff invitation:
  - `POST /api/staff/invite` — sends invitation email, creates `pending` staff record
  - `POST /api/auth/accept-invite` — staff sets password, account becomes active

### Frontend

- [ ] Build 5-step onboarding wizard:
  - **Step 1 — Logo:** drag-and-drop or click to upload; image preview; crop tool (optional); "Skip" link
  - **Step 2 — Classes:** grouped checkboxes (Nursery / Primary / Secondary / JSS / SSS); "Select All" per group; preview of selected classes
  - **Step 3 — Academic calendar:** academic year input (e.g. 2024/2025), current term radio (1st / 2nd / 3rd), term start date, term end date
  - **Step 4 — Invite proprietor:** name, email, phone fields; "Send Invitation" button; success confirmation; "Skip" link
  - **Step 5 — Summary:** getting-started checklist with completion status; 30-day free trial notice; "Go to Dashboard" button
- [ ] Build admin dashboard layout:
  - Sidebar navigation: Dashboard, Students, Classes, Staff, Fees, Results, Announcements, Settings
  - Top header: school logo, school name, logged-in admin name, notifications bell, logout
  - Responsive (collapses to bottom nav on mobile)
- [ ] Build dashboard home page:
  - Quick stats cards: Total Students, Total Staff, Outstanding Fees, Pending Applications
  - Getting-started checklist (checks off as admin completes each step)
  - KYC status banner (shown until approved)
- [ ] Build classes management page: list classes, add class, rename class, delete class (with confirmation modal)
- [ ] Build staff management page: list staff, invite staff (modal form), view invited/pending/active status

**Definition of Done:** Admin can complete all 5 wizard steps. Dashboard loads with stats. Classes can be created and listed. Staff can be invited and they can accept the invitation and log in.

---

## Sprint 5 — Student Data Collection (Weeks 9–10)

**Goal:** Teachers can submit student data via Google Form. Admin can review and approve imports. Student roster is visible on the dashboard.

### Backend

- [ ] `POST /api/google/webhook` — receives `onFormSubmit` POST from Apps Script; validates `school_id` and `api_key` in the payload; inserts row into `student_imports` (staging table)
- [ ] `GET /api/student-imports` — list all pending imports for review (paginated, filterable by class)
- [ ] `POST /api/student-imports/:id/approve` — validates the import row, creates records in `students` and `student_parents` (with deduplication: if parent phone already exists, link existing parent; otherwise create new `pending` parent account)
- [ ] `POST /api/student-imports/:id/reject` — marks the import as rejected with a reason
- [ ] `POST /api/student-imports/bulk-approve` — approve all pending imports for a class at once
- [ ] `GET /api/students` — list students (paginated, filterable by class)
- [ ] `GET /api/students/:id` — individual student profile
- [ ] `POST /api/google/form-config` — saves a school's Google Form ID and Sheet ID to `google_form_configs`
- [ ] `GET /api/google/form-config` — returns the school's form config (so frontend can show the form link)
- [ ] Parent invite on import approval:
  - When a new parent is created, send a WhatsApp message (via WhatsApp Business API) with a link to set up their account
  - If WhatsApp fails, fall back to SMS

### Frontend

- [ ] Build Google Form setup page (in Settings):
  - Instructions for the admin: how to create the Google Form, how to install the Apps Script, how to copy the webhook URL
  - Input field for the Form ID and Sheet ID
  - "Test Connection" button that checks the webhook is working
  - Copyable webhook URL and `school_id` / `api_key` values for the Apps Script
- [ ] Build student import review page:
  - Table of pending imports: student name, class, parent name, parent phone
  - Per-row: "Approve" and "Reject" buttons
  - Bulk actions: "Approve All for Class X" dropdown
  - Filter by class
  - Rejected imports shown in a separate tab with the reason
- [ ] Build student roster page:
  - List of students per class (class filter dropdown)
  - Student card: photo (placeholder if none), name, class, parent name, parent phone, parent WhatsApp status
  - Search by student name
  - Click student → student profile page
- [ ] Build student profile page:
  - Photo, name, admission number, class, date of birth, gender
  - Parents/guardians section (name, phone, relationship, account status: pending / active)
  - "Resend Parent Invite" button per parent

**Definition of Done:** Admin can set up the Google Form link. A teacher submits a student via the form. The import appears in the review queue. Admin approves it. The student appears in the roster. The parent receives a WhatsApp invitation to create their account.

---

## Cross-Sprint Notes

### Environments

- **Local:** each developer runs their own PostgreSQL instance
- **Staging:** shared staging server — deployed automatically on merge to `main`
- **Production:** deployed manually after staging sign-off

### API conventions

- All responses: `{ success: true, data: {} }` or `{ success: false, error: "message" }`
- All list endpoints: paginated with `{ data: [], total, page, limit }`
- All timestamps: ISO 8601 UTC
- Errors: standard HTTP status codes (400 validation, 401 auth, 403 permission, 404 not found, 500 server)

### Branch strategy

- `main` — production-ready
- `develop` — integration branch
- Feature branches: `feat/school-registration`, `feat/kyc-form`, etc.
- Hotfix branches: `fix/subdomain-check`

### What is NOT in these sprints (next phases)

- Parent portal (Phase 2)
- PTA WhatsApp group tracking (Phase 3)
- Teacher-parent messaging (Phase 4)
- Report cards and grades (Phase 5)
- Fee payments and reminders (Phase 6)
- AI features (Phase 7)

---

_Last updated: 2026-05-08_
