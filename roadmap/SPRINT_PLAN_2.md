# SchoolFlow — Sprint Plan 2 (Phases 2–6)

**Goal:** Build both the Parent Portal and School operational features — applications, communication, report cards, and fee payments — for all actors (school, parent, teacher, bursar).  
**Duration:** 5 sprints × 2 weeks = 10 weeks (Weeks 11–20)  
**Stack:** Java (Backend) · Next.js (Frontend) · PostgreSQL · AWS S3 · OPay · WhatsApp Business API  
**Covers:** Phase 2 (Parent Portal & Enrollment) · Phase 3 (PTA & Notifications) · Phase 5 (Report Cards) · Phase 6 (Finance Module)

> **Prerequisite:** All Sprint 1–5 work is complete. Schools are registered, KYC-approved, and student data is in the system.

---

## Sprint Overview

| Sprint    | Focus                             | Weeks | Actors                  |
| --------- | --------------------------------- | ----- | ----------------------- |
| Sprint 6  | Parent Portal Foundation          | 11–12 | Parent, School          |
| Sprint 7  | Applications & Enrollment         | 13–14 | Parent, School          |
| Sprint 8  | PTA Communication & Notifications | 15–16 | Parent, School, Teacher |
| Sprint 9  | Report Cards & Academic Results   | 17–18 | Parent, School, Teacher |
| Sprint 10 | Finance Module — Fees & Payments  | 19–20 | Parent, School (Bursar) |

---

## Sprint 6 — Parent Portal Foundation (Weeks 11–12)

**Goal:** Parents can register, activate their account, see their children, and search for schools. Schools can configure their admissions settings.

### Backend

**Parent Auth & Account**

- [ ] `POST /api/parents/register` — accepts phone number; sends OTP via WhatsApp (primary) or SMS (fallback); creates a `pending` parent user record
- [ ] `POST /api/parents/verify-otp` — validates OTP; activates parent account; returns JWT tokens
- [ ] `POST /api/parents/activate-invite` — handles activation from a school invitation link (Sprint 5 flow); parent sets a PIN (6-digit) for future payment actions; account status changes from `pending` to `active`
- [ ] `POST /api/auth/parent/login` — phone + OTP login (parents do not use passwords — OTP only)
- [ ] `GET /api/parents/me` — returns logged-in parent's profile, linked children, and each child's school
- [ ] `GET /api/parents/children` — list all children linked to this parent (across all schools)

**School Search & Discovery**

- [ ] `GET /api/schools/search` — accepts query params: `name`, `location`, `state`, `type` (nursery/primary/secondary); returns only schools with `kyc_status: approved` and `visibility: public`
- [ ] `GET /api/schools/:subdomain/profile` — public school profile (name, logo, location, types offered, application fee, whether admissions are open)

**School — Admissions Settings**

- [ ] `PUT /api/schools/settings/admissions` — school admin sets: `admissions_open` (bool), `application_fee` (NUMERIC), `available_classes` (array of class IDs accepting new students)
- [ ] `GET /api/schools/settings/admissions` — returns current admissions settings

### Frontend

**Parent — Registration & Login**

- [ ] Build parent registration page (`/parent/register`):
  - Phone number input with Nigerian flag prefix (+234)
  - "Send OTP" button
  - OTP entry screen (6-digit code, 2-minute countdown, "Resend" option)
  - On success: redirect to parent dashboard
- [ ] Build parent invitation activation page (`/parent/activate?token=xxx`):
  - Shows child's name and school name (from token)
  - PIN setup screen (enter + confirm 6-digit PIN)
  - On success: redirect to parent dashboard
- [ ] Build parent login page (`/parent/login`):
  - Phone number → OTP flow (same as registration OTP screen)

**Parent — Dashboard**

- [ ] Build parent dashboard layout:
  - Bottom navigation (mobile-first): Home, Children, Notifications, Profile
  - Top header: "Good morning, [Name]" + notifications bell
- [ ] Build dashboard home:
  - Children cards: each card shows child photo, name, school name, class, and a badge for any outstanding action (fees due, new result, new message)
  - "Add a Child to Another School" CTA button (leads to school search)
- [ ] Build child detail page:
  - Child photo, name, class, school
  - Tabs: Fees | Results | Attendance | Messages
  - Each tab is a placeholder for now (filled in later sprints)

**School Search**

- [ ] Build school search page (`/parent/search`):
  - Search bar (name or location)
  - Filter chips: state, school type
  - School cards in results: logo, name, location, type badges, application fee, "KYC Verified" badge
  - "View School" and "Apply Now" buttons per card
- [ ] Build public school profile page (`/schools/[subdomain]`):
  - School logo, name, address, phone, email
  - Classes offered list
  - Application fee
  - "Apply Now" button (disabled if admissions are closed with a message)

**School — Admissions Settings**

- [ ] Build admissions settings page in school dashboard:
  - Toggle: "Open / Close Admissions"
  - Application fee input
  - Checkboxes per class (which classes are accepting applications)
  - Save button

**Definition of Done:** A parent can register with their phone number via OTP and land on their dashboard. A parent invited by a school (from Sprint 5 import) can activate their account, set a PIN, and see their child's card. School search returns only verified schools. School can open/close admissions.

---

## Sprint 7 — Applications & Enrollment (Weeks 13–14)

**Goal:** Parent can apply to a school and pay the application fee. School can review, schedule, and decide on applications.

### Backend

**Parent — Applications**

- [ ] `POST /api/applications` — creates a new application; fields: school_id, child details (name, DOB, gender, desired_class, previous_school, medical_notes), documents (photo, birth cert — S3 URLs), additional guardians array
- [ ] `GET /api/applications` — list all applications for the logged-in parent (across schools), with current status
- [ ] `GET /api/applications/:id` — single application detail

**OPay — Application Fee Payment**

- [ ] `POST /api/payments/application-fee/initiate` — creates an OPay payment order for the application fee amount; returns OPay checkout URL
- [ ] `POST /api/webhooks/opay` — OPay webhook receiver; validates signature; on success: records payment in `payments` table, marks application as `paid`, generates PDF receipt, sends WhatsApp + email confirmation to parent, sends notification to school admin
- [ ] `GET /api/payments/receipt/:payment_id` — returns receipt data (for PDF download)

**School — Application Processing**

- [ ] `GET /api/school/applications` — list all applications received by this school (filterable by status, class, date)
- [ ] `GET /api/school/applications/:id` — full application detail including payment status
- [ ] `POST /api/school/applications/:id/schedule-exam` — saves exam/interview details (type, date, time, venue, instructions); sends WhatsApp notification to parent
- [ ] `POST /api/school/applications/:id/admit` — marks application as `admitted`; sends WhatsApp + email to parent; creates a full student record and enrollment if not already existing; links parent account
- [ ] `POST /api/school/applications/:id/reject` — marks application as `rejected` with optional reason; sends WhatsApp + email to parent
- [ ] `POST /api/school/applications/:id/record-assessment` — school records entrance exam/interview outcome (attendance, rating, notes)

### Frontend

**Parent — Application Flow**

- [ ] Build child application form (multi-step):
  - **Step 1 — Child details:** first name, last name, middle name (optional), date of birth (date picker), gender radio, desired class dropdown (populated from school's open classes), previous school (optional), medical information (optional text area)
  - **Step 2 — Documents:** child passport photo upload, birth certificate upload (optional)
  - **Step 3 — Additional guardian:** name, phone, relationship (optional, "Add Another" button for multiple)
  - **Step 4 — Review:** summary of all entered data, application fee amount shown
- [ ] Build OPay payment screen:
  - Application fee summary card
  - "Pay ₦X,XXX" button → opens OPay checkout (redirect or modal)
  - Processing screen while waiting for webhook confirmation
  - Success screen: application reference number, receipt download button, "Back to Dashboard" button
- [ ] Build application tracker (in parent dashboard):
  - List of all applications with status chips: `Under Review` / `Exam Scheduled` / `Admitted` / `Not Admitted`
  - Click application → detail view with timeline of status changes
  - Exam/interview details shown when scheduled (date, time, venue, instructions)

**School — Applications Inbox**

- [ ] Build applications list page (school dashboard sidebar: "Applications"):
  - Table: applicant name, desired class, applied date, payment status, current status
  - Filter by: status, class, date range
  - Bulk actions: mark selected as reviewed
- [ ] Build application detail page:
  - Child info panel (photo, details, documents — with download buttons)
  - Parent/guardian info panel
  - Payment panel (fee amount, paid status, receipt link)
  - Action buttons: "Schedule Exam", "Admit", "Reject"
- [ ] Build schedule exam modal:
  - Assessment type radio (written / interview / both)
  - Date picker, time picker
  - Venue input
  - Instructions text area
  - "Send Invitation to Parent" button
- [ ] Build record assessment modal:
  - Attendance toggle (present / no-show)
  - Impression dropdown (excellent / good / fair / poor)
  - Observations text area
  - Recommendation radio
  - Assessed-by dropdown (staff list)

**Definition of Done:** Parent can complete an application, pay the fee via OPay, and see their application status update. School can view all applications, schedule an exam, record the result, and admit or reject — with the parent notified via WhatsApp at each step.

---

## Sprint 8 — PTA Communication & Notifications (Weeks 15–16)

**Goal:** School can send announcements and manage the PTA WhatsApp group. Parents receive notifications across all channels. Teacher records attendance and parents get absence alerts.

### Backend

**WhatsApp Business API Integration**

- [ ] Set up WhatsApp Business API client (Meta Cloud API)
- [ ] `POST /api/internal/whatsapp/send` — internal service to send a WhatsApp message to a phone number (used by all notification triggers)
- [ ] `POST /api/webhooks/whatsapp` — Meta webhook receiver; handles delivery status updates (`sent`, `delivered`, `read`); updates `notifications` table accordingly

**PTA Group Invite Tracking**

- [ ] `POST /api/pta/set-invite-link` — school admin pastes the WhatsApp group invite link; stored against school record
- [ ] `POST /api/pta/invite-all` — generates a unique tracking URL per parent (`/join/:token`), saves to `pta_invites` table with status `not_invited`, then sends each parent a WhatsApp message containing their personal tracking URL
- [ ] `GET /join/:token` — redirect endpoint; marks `pta_invites.status = link_clicked`; redirects parent to the WhatsApp group invite link
- [ ] `GET /api/pta/status` — returns PTA group stats: total parents, invited, clicked, in group, left group
- [ ] `PUT /api/pta/invites/:parent_id/status` — manual admin override (mark as `in_group` or `left_group`)

**Notification Engine**

- [ ] Build a `NotificationService` with a single `send(userId, type, payload)` method that:
  - Looks up the user's channel preferences from DB
  - Respects quiet hours (10 PM – 7 AM)
  - Dispatches via WhatsApp, in-app, email, or SMS based on preferences
  - Records each dispatch attempt in the `notifications` table
- [ ] Notification types to implement: `fee_reminder`, `payment_confirmation`, `result_released`, `school_announcement`, `attendance_alert`, `application_update`, `urgent_alert`
- [ ] `GET /api/notifications` — paginated list of notifications for the logged-in user
- [ ] `PUT /api/notifications/:id/read` — mark a notification as read
- [ ] `PUT /api/notifications/read-all` — mark all as read

**Announcements**

- [ ] `POST /api/announcements` — school admin creates an announcement (title, body, target: all-school or specific class, channels array); triggers `NotificationService` for all targeted parents
- [ ] `GET /api/announcements` — list announcements for the school (admin view) or for the parent's children's schools (parent view)

**Attendance**

- [ ] `POST /api/attendance/record` — teacher records daily attendance for a class; accepts array of `{ student_id, status: present | absent | late }`
- [ ] `GET /api/attendance/class/:class_id?date=` — returns attendance for a class on a given date
- [ ] On each `absent` or `late` record: trigger `NotificationService` to send an attendance alert to all parents linked to that student

**Parent — Notification Preferences**

- [ ] `GET /api/parents/notification-preferences` — returns current preferences
- [ ] `PUT /api/parents/notification-preferences` — saves preferences (per notification type, per channel, frequency, quiet hours toggle)

### Frontend

**School — PTA Management Page**

- [ ] Build PTA page (school dashboard):
  - Input field for WhatsApp group invite link + "Save" button
  - Stats bar: total parents, % invited, % clicked, % in group
  - Parent table with status column (colour-coded chips: not invited / invited / clicked / in group / left)
  - "Invite All Uninvited" button
  - "Re-invite Non-Joiners" button (targets `link_clicked` only)
  - Manual override dropdown per parent row

**School — Announcements Page**

- [ ] Build announcements composer:
  - Title and body text area
  - Target selector: "All Parents" or per-class checkboxes
  - Channel checkboxes: WhatsApp, In-app, Email
  - "Send Now" and "Schedule for Later" (schedule is a placeholder for now)
  - Past announcements list with delivery stats (sent / delivered / read counts)

**School — Attendance Page**

- [ ] Build daily attendance recorder:
  - Class selector and date picker (defaults to today)
  - Student list with present / absent / late radio per row
  - "Mark All Present" shortcut button
  - "Save Attendance" button with confirmation
  - View past attendance by date

**Parent — Notification Centre**

- [ ] Build notification centre screen:
  - Grouped by date (Today, Yesterday, This Week)
  - Each notification: icon by type, title, body, time, read/unread indicator
  - Tap to navigate to the relevant screen (fee, result, announcement)
  - "Mark All Read" button
  - Unread count badge on bottom nav bell icon
- [ ] Build notification preferences screen:
  - Toggle grid: notification types (rows) × channels (columns: WhatsApp / Email / SMS)
  - Quiet hours toggle with time range picker

**Definition of Done:** School can set the PTA invite link and send tracked invites to all parents. Parents receive WhatsApp messages with unique links. Status updates when a parent clicks. School can send an announcement and all targeted parents receive it via WhatsApp and in-app. Teacher records attendance and absent students' parents receive a WhatsApp alert. Parent can manage notification preferences.

---

## Sprint 9 — Report Cards & Academic Results (Weeks 17–18)

**Goal:** Teachers enter scores. System calculates results. School publishes reports. Parents receive and download PDF report cards.

### Backend

**Subjects & Grading**

- [ ] `POST /api/subjects` — create a subject for a class (name, max CA score, max exam score)
- [ ] `GET /api/subjects?class_id=` — list subjects for a class
- [ ] `POST /api/school/grading-system` — configure grading boundaries (e.g. 70–100 = A, 60–69 = B, etc.)
- [ ] `GET /api/school/grading-system` — returns current grading config

**Score Entry**

- [ ] `POST /api/grades/ca` — teacher submits CA scores for a class; accepts array of `{ student_id, subject_id, ca1, ca2 }`; validates against max scores; upserts into `grades` table
- [ ] `POST /api/grades/exam` — teacher submits exam scores; same structure; triggers total + grade + position calculation
- [ ] `GET /api/grades/class/:class_id?term_id=` — returns all grades for a class in a term (teacher view)
- [ ] Grade calculation (triggered after exam scores saved):
  - `total = ca1 + ca2 + exam`
  - Grade derived from grading system config
  - Position calculated by ranking students in the class by total (handles ties)
  - All stored back to `grades` table

**Comments & Behavioral Ratings**

- [ ] `POST /api/reports/comments` — teacher saves class comment for a student; principal saves principal comment
- [ ] `POST /api/reports/behavioral-ratings` — saves 5-star ratings per trait (punctuality, attentiveness, cooperation, neatness, politeness, leadership)

**Report Publishing**

- [ ] `POST /api/reports/generate/:enrollment_id` — generates a report record for one student (assembles grades, comments, attendance, behavioral ratings); status: `draft`
- [ ] `POST /api/reports/publish-all?term_id=&class_id=` — publishes all draft reports for a class; sets status to `published`; triggers `NotificationService` to alert each parent (WhatsApp + in-app)
- [ ] `GET /api/reports/:enrollment_id` — returns full report data (for rendering the PDF)
- [ ] `GET /api/reports/:enrollment_id/pdf` — generates and returns a PDF report card (using a PDF library e.g. iText or JasperReports); PDF includes: school logo, student photo, results table, attendance, behavioral ratings, teacher comment, principal comment, QR code, digital signature

**Parent — View Results**

- [ ] `GET /api/parent/children/:student_id/ca-scores?term_id=` — returns CA scores for the child (visible after CA is published)
- [ ] `GET /api/parent/children/:student_id/results?term_id=` — returns full term results (visible after report is published)
- [ ] `GET /api/parent/children/:student_id/performance-trend` — returns term-over-term average scores across all terms for the child

### Frontend

**School — Subject & Grading Setup**

- [ ] Build subjects management page (per class):
  - List of subjects with max CA and max exam columns
  - Add subject modal (name, max CA, max exam)
  - Edit and delete per row
- [ ] Build grading system configuration page:
  - Grade boundaries table (add rows: min score, max score, grade letter, remark)
  - Example: 70–100 → A → Excellent; 60–69 → B → Very Good; etc.

**Teacher — Score Entry**

- [ ] Build CA score entry page:
  - Class selector + term selector
  - Subject tabs across the top
  - Table: student name | CA1 input | CA2 input | total (auto-calculated and read-only)
  - Validation: cannot exceed max score; highlights invalid cells in red
  - "Save Scores" button; shows last-saved timestamp
- [ ] Build exam score entry page (same layout, adds exam column, shows CA total as read-only, calculates grand total)
- [ ] Build comments entry page:
  - Student list for the class
  - Text area per student for class teacher comment
  - Principal comment entry (separate view restricted to principal role)
- [ ] Build behavioral ratings page:
  - Student list
  - 5-star selector per trait per student (grid layout)

**School — Results Publishing**

- [ ] Build results review page:
  - Class + term selector
  - Preview table: all students, all subject totals, overall average, position
  - Highlight: top 3 students, students below passing threshold
  - "Publish All" button with confirmation modal ("This will notify all parents")
  - Per-student "Preview PDF" link (opens PDF in new tab)

**Parent — Results View**

- [ ] Build CA scores screen (child detail → Results tab → mid-term):
  - Table: subject | CA1 | CA2 | total | grade
  - Performance summary: strongest subjects, needs improvement
- [ ] Build full term results screen:
  - Header: overall average, class position, grade
  - Detailed table: subject | CA1 | CA2 | exam | total | grade | class position
  - Teacher comment card
  - Principal comment card
  - Attendance summary (days present, absent, late, attendance %)
  - Behavioral ratings (star display per trait)
  - Next term info card (resumption date, fees due)
  - Action buttons: "Download PDF" | "Share via WhatsApp"
- [ ] Build performance trend screen:
  - Line graph: term-over-term average (use a chart library, e.g. Recharts or Chart.js)
  - Subject comparison: top 3 strongest, bottom 2 needing improvement
- [ ] PDF download: call `/api/reports/:enrollment_id/pdf`, stream as file download; share button encodes the PDF as a WhatsApp share link

**Definition of Done:** Teacher can enter CA1, CA2, and exam scores for every student in their class. System calculates totals, grades, and positions automatically. Principal can review and publish reports. Parent receives a WhatsApp notification, views the results in-app, and downloads a properly formatted PDF report card.

---

## Sprint 10 — Finance Module: Fees & Payments (Weeks 19–20)

**Goal:** School configures fees and invoices. Parent views outstanding fees and pays via OPay. Automated reminders run on schedule. Bursar has a full payment dashboard.

### Backend

**Fee Configuration**

- [ ] `POST /api/fee-types` — bursar creates a fee type (name e.g. "Tuition", "Books", amount in naira, applicable class IDs, term_id)
- [ ] `GET /api/fee-types?term_id=&class_id=` — list fee types
- [ ] `PUT /api/fee-types/:id` — edit fee type
- [ ] `DELETE /api/fee-types/:id` — soft-delete fee type

**Invoice Generation**

- [ ] `POST /api/invoices/generate?term_id=&class_id=` — generates invoices for all enrolled students in a class for a term (one invoice per student, line items per fee type); idempotent — re-running does not create duplicates
- [ ] `GET /api/invoices?student_id=` — list all invoices for a student
- [ ] `GET /api/invoices/:id` — invoice detail with line items and payment history

**Parent — Fee Payment**

- [ ] `GET /api/parent/children/:student_id/fees?term_id=` — returns outstanding fee breakdown per fee type for the child (amount, paid, balance per item)
- [ ] `POST /api/payments/fees/initiate` — accepts `{ invoice_id, fee_type_ids[] }` (parent selects which items to pay); creates an OPay payment order for the sum; returns OPay checkout URL
- [ ] `POST /api/webhooks/opay` (already built in Sprint 7) — extend to handle fee payments: update `invoices.paid_amount`, create `payments` record, recalculate balance, generate PDF receipt, send WhatsApp + email to parent, send notification to bursar

**Automated Fee Reminders**

- [ ] Build a scheduled job (Spring `@Scheduled` or a cron task) that runs daily at 8 AM and:
  - Queries all unpaid or partially paid invoices
  - For each, checks whether today matches a reminder trigger (14d before deadline, 7d, 2d, due date, 1d overdue, every 3d after overdue)
  - If matched and the parent has not paid since last check: sends reminder via `NotificationService`
  - Reminder message includes child name, amount owed, deadline, and a "Pay Now" deep link
  - Consolidates multiple children per parent into one message
  - Skips if quiet hours, respects parent's reminder preference (can snooze for 24 hours)
- [ ] `POST /api/parent/reminders/:invoice_id/snooze` — parent snoozes reminder for 24 hours

**Bursar Dashboard**

- [ ] `GET /api/bursar/summary?term_id=` — returns: total fees expected, total collected, total outstanding, number of full payers, number of partial payers, number of zero payers
- [ ] `GET /api/bursar/defaulters?term_id=` — list of students with outstanding balance (sortable by amount owed)
- [ ] `GET /api/bursar/payments?term_id=` — full payment transaction log for the school (filterable by date, class, fee type)

### Frontend

**School — Fee Configuration**

- [ ] Build fee types management page (Settings → Fees):
  - Table of fee types: name, amount, applicable classes, term
  - "Add Fee Type" modal: name, amount input, class multi-select, term selector
  - Edit and delete per row
- [ ] Build "Generate Invoices" section:
  - Class selector + term selector
  - Preview: "This will generate invoices for X students covering Y fee types totalling ₦Z"
  - "Generate Invoices" button
  - Success confirmation with count of invoices created

**School — Bursar Dashboard**

- [ ] Build bursar dashboard page:
  - Summary cards: Total Expected / Total Collected / Outstanding / % Paid
  - Bar chart: per-class collection rate
  - Defaulters table: student name, class, total owed, last payment date, "Send Reminder" button per row (manual trigger)
  - Full payment log table: date, student name, fee types paid, amount, receipt link

**Parent — Fees Screen**

- [ ] Build fees screen (child detail → Fees tab):
  - Outstanding summary card: "You owe ₦X,XXX for [Child Name] this term"
  - Fee breakdown table: fee type | total | paid | balance | status chip (paid / partial / due / overdue)
  - Checkboxes to select which fee items to pay
  - "Pay Selected (₦X,XXX)" and "Pay All (₦X,XXX)" buttons
- [ ] Build OPay payment flow (reuse Sprint 7 pattern):
  - Payment summary screen: itemised list of selected fees, total amount
  - PIN entry screen (6-digit PIN set during account activation)
  - "Confirm Payment" → OPay checkout opens
  - Success screen: receipt download + share button + "Back to Dashboard"
- [ ] Build payment history screen:
  - Chronological list: date, description, amount, receipt link
  - Filter by child and date range
- [ ] Build fee reminder notification action:
  - When parent taps a fee reminder notification → deep link to the fees screen for that child
  - "Snooze for 24 hours" button on the notification itself

**Definition of Done:** Bursar can create fee types, generate invoices for all students in a class, and view a full payment dashboard. Parent can see exactly what is owed per fee type, select items to pay, complete payment via OPay, and download the receipt. Automated reminders fire on schedule and stop as soon as the invoice is fully paid.

---

## Cross-Sprint Notes

### Teacher messaging (Phase 4)

Teacher-parent messaging was not included in this sprint plan — it is lower priority than fees, results, and communications. Schedule it as Sprint 11 after the MVP launch and initial school feedback.

### AI features (Phase 7)

AI features require at least one full term of clean data (grades, attendance) to be meaningful. Schedule for Sprint 12+ after schools have completed at least one term on the platform.

### Mobile-first design rule

Every parent-facing screen must work on a budget Android phone (360px viewport, slow 3G). Test each screen on Chrome DevTools mobile emulation before marking a frontend task done.

### OPay integration notes

- All OPay payment initiations return a checkout URL — open this in the parent's default browser (not a WebView) to ensure OPay's security flows work correctly
- Always validate the OPay webhook signature before processing any payment confirmation
- Store the OPay transaction reference on every `payments` record for dispute resolution

### Notification delivery priority

Always attempt channels in this order: WhatsApp → In-app → Email → SMS. Only fall back to the next channel if the previous one fails (not delivered within 30 seconds).

### Branch strategy

Continues from Sprint Plan 1: feature branches off `develop`, merged via PR, auto-deployed to staging on merge to `develop`, manual deploy to production.

---

_Last updated: 2026-05-08_
