# SchoolFlow — Sprint Plan 2 (Phases 2–6)

**Goal:** Build both the Parent Portal and School operational features — applications, communication, report cards, and fee payments — for all actors (school, parent, teacher, bursar).  
**Duration:** 6 sprints × 2 weeks = 12 weeks (Weeks 11–22)  
**Stack:** Java (Backend) · Next.js (Frontend) · PostgreSQL · AWS S3 · Monnify · WhatsApp Business API  
**Covers:** Phase 2 (Parent Portal & Enrollment) · Phase 3 (PTA & Notifications) · Phase 4 (Teacher Portal) · Phase 5 (Report Cards) · Phase 6 (Finance Module)

> **Prerequisite:** All Sprint 1–5 work is complete. Schools are registered, KYC-approved, and student data is in the system.

---

## Sprint Overview

| Sprint    | Focus                             | Weeks | Actors                  |
| --------- | --------------------------------- | ----- | ----------------------- |
| Sprint 6  | Parent Portal Foundation          | 11–12 | Parent, School          |
| Sprint 7  | Applications & Enrollment         | 13–14 | Parent, School          |
| Sprint 8  | PTA Communication & Notifications | 15–16 | Parent, School, Teacher |
| Sprint 8b | Teacher Portal                    | 16–17 | Teacher, School         |
| Sprint 9  | Report Cards & Academic Results   | 18–19 | Parent, School, Teacher |
| Sprint 10 | Finance Module — Fees & Payments  | 20–21 | Parent, School (Bursar) |

---

## Sprint 6 — Parent Portal Foundation (Weeks 11–12)

**Goal:** Parents can register, activate their account, see their children, and search for schools. Schools can configure their admissions settings.

### Backend

**Parent Auth & Account**

- [ ] `POST /api/parents/register` — accepts phone number; checks if a `users` row already exists for this phone (the person may already be a teacher on the platform); if yes: creates a `parent_profiles` row linked to the existing `users` row and returns a "profile added to your account" response; if no: creates a new `users` row + `parent_profiles` row; sends OTP via WhatsApp for verification
- [ ] `POST /api/parents/verify-otp` — validates OTP; activates the parent profile; returns JWT (same JWT structure used across all portals — portal context is derived from which profiles exist, not from a separate token type)
- [ ] `POST /api/parents/activate-invite` — handles activation from a school invitation link; parent sets a PIN (6-digit) for payment actions; triggers Monnify reserved account creation (see below)
- [ ] `POST /api/parents/wallet/create-account` — internal; called after parent activation; calls `POST /api/v2/bank-transfer/reserved-accounts` on Monnify to generate dedicated virtual account numbers (Wema + Sterling); stores account reference and account numbers in `parent_wallets`
- [ ] `POST /api/webhooks/monnify` — Monnify webhook receiver; validates HMAC signature; on `SUCCESSFUL_TRANSACTION` event: credits `parent_wallets.balance`, creates a `wallet_transactions` credit record, sends WhatsApp notification to parent ("₦X,XXX received. Wallet balance: ₦Y,YYY")
- [ ] `GET /api/parents/wallet` — returns parent's wallet balance and all their virtual account numbers (so parent can see where to send money)
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
  - After successful login: if user also has a `teachers` profile, show a context switcher banner — "You also have a teacher account. [Switch to Teacher Portal]"
- [ ] Build shared post-login context routing logic:
  - Only parent profile → redirect to `/parent/dashboard`
  - Only teacher profile → redirect to `/teacher/dashboard`
  - Both profiles → show "Welcome back, [Name]. How would you like to continue?" with two cards: Parent Portal and Teacher Portal. User's last-used context is remembered for next login.

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

**Monnify — Application Fee Payment**

- [ ] `POST /api/payments/application-fee/pay` — accepts `{ application_id, pin }`: validates PIN, checks `parent_wallets.balance >= application_fee`, calls Monnify disbursement API (`POST /api/v2/disbursements/single`) to transfer to school's settlement account, debits wallet, creates `payments` record, marks application as `paid`, generates PDF receipt, sends WhatsApp + email confirmation to parent, notifies school admin
- [ ] `POST /api/payments/application-fee/topup-prompt` — if wallet balance is insufficient: returns parent's virtual account numbers and the exact top-up amount needed; Monnify webhook (registered in Sprint 6) auto-completes the payment when funds arrive
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
- [ ] Build payment screen for application fee:
  - Wallet balance card ("Your wallet: ₦X,XXX")
  - Application fee summary card
  - If balance sufficient: PIN entry → "Confirm Payment" button → processing → success
  - If balance insufficient: show shortfall amount + parent's Monnify virtual account numbers with "Top up and continue" message; poll or wait for webhook to auto-complete
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

**Definition of Done:** Parent can complete an application, pay the fee from their Monnify wallet (or top up and auto-pay), and see their application status update. School can view all applications, schedule an exam, record the result, and admit or reject — with the parent notified via WhatsApp at each step.

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

## Sprint 8b — Teacher Portal (Weeks 16–17)

**Goal:** Teachers have their own independent portal account that persists across schools. Schools invite teachers; teachers accept and are linked. Teachers can resign without losing their profile or history.

### Backend

**Teacher Auth & Account**

- [ ] `POST /api/teachers/register` — teacher self-registration: name, email, phone, password; checks if a `users` row already exists for this phone/email (the person may already be a parent on the platform); if yes: creates a `teachers` profile row linked to the existing `users` row — one account, new capability added; if no: creates a new `users` row + `teachers` row. Either way, the user now has both profiles accessible from one login.
- [ ] `POST /api/teachers/verify-email` — email verification flow (same pattern as school registration)
- [ ] `POST /api/auth/teacher/login` — email + password login; returns JWT
- [ ] `GET /api/teachers/me` — returns teacher's profile, current school links, and employment history
- [ ] `PUT /api/teachers/me` — teacher updates their own profile: qualifications, subjects, bio, photo

**School → Teacher Invite Flow**

- [ ] `POST /api/school/staff/invite` — school admin sends invite: email, role (class_teacher | subject_teacher | admin), assigned_class_id (optional); creates a `teacher_invites` row with a signed token; sends WhatsApp + email to the teacher
- [ ] `GET /api/teacher/invites` — teacher views all pending invites (they may have invites from multiple schools)
- [ ] `POST /api/teacher/invites/:token/accept` — teacher accepts; creates a `school_staff` row (teacher_id, school_id, role, start_date = today); invite status → `accepted`
- [ ] `POST /api/teacher/invites/:token/decline` — invite status → `declined`; school admin notified
- [ ] `GET /api/school/staff` — school lists all current and past staff (filterable by status: active | resigned | terminated); returns teacher name, role, assigned class, start_date, end_date
- [ ] `GET /api/school/staff/:teacher_id` — school views a teacher's profile and their employment history **at this school only**

**Teacher Resignation & Offboarding**

- [ ] `POST /api/teacher/schools/:school_id/resign` — teacher resigns from a school: sets `school_staff.end_date = today`, `status → resigned`; school admin notified via WhatsApp + email; teacher retains full account and read-only access to historical records at this school
- [ ] `POST /api/school/staff/:teacher_id/end-employment` — school admin ends employment: same effect as resignation but sets `status → terminated`; teacher notified

### Frontend

**Teacher Portal (`teacher.schoolflow.com`)**

- [ ] Build teacher registration page (`/teacher/register`):
  - Name, email, phone, password
  - Basic profile: subjects taught (multi-select), years of experience
  - Email verification step
- [ ] Build teacher login page (`/teacher/login`):
  - Email + password login
  - After login: same context routing logic as parent portal — if user also has a `parent_profiles` row, show context switcher: "You also have a parent account. [Switch to Parent Portal]"
- [ ] Build teacher dashboard:
  - Current school cards (one card per active `school_staff` row): school name, logo, role, assigned class
  - Pending invites section (if any): school name, role offered, "Accept" / "Decline" buttons
  - "No schools yet" empty state for new teachers
- [ ] Build teacher profile page:
  - Editable: qualifications (add/remove), subjects, bio, profile photo
  - Read-only: employment history timeline (School A: Jan 2020 – Mar 2022, School B: May 2022 – present)
- [ ] Build resign flow:
  - Teacher selects school → "Resign from this school" → confirmation modal
  - On confirm: school removed from active cards; moved to employment history with end date

**School — Staff Management Page (`/school/dashboard/staff`)**

- [ ] Build staff list: table of all current staff — name, role, assigned class, start date, status chip (Active)
- [ ] Build "Invite Teacher" modal:
  - Email input, role dropdown, class assignment (optional)
  - "Send Invite" button → WhatsApp + email sent to teacher
  - Pending invites section below table: email, role, sent date, status (Pending / Accepted / Declined / Expired)
- [ ] Build staff detail drawer: teacher name, photo, contact, qualifications, assigned class, start date; "End Employment" button (with confirmation)
- [ ] Build past staff section (collapsed by default): former teachers with end dates and status chips

**Definition of Done:** A teacher can register independently at `teacher.schoolflow.com`, build their profile, receive an invite from a school, accept it, and appear on the school's staff page. A teacher can resign and their account remains active. The school can end employment from their dashboard. If a teacher registers using the same phone/email as an existing parent account, no duplicate `users` row is created — a `teachers` profile is added to their existing identity and they see a context switcher on login. All school linkage uses `school_staff` as the join — no teacher record is owned by or deleted by a school.

---

## Sprint 9 — Report Cards & Academic Results (Weeks 18–19)

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

**Teacher — Score Entry (in Teacher Portal)**

Score entry happens in the teacher's own portal (`teacher.schoolflow.com`), not the school dashboard. The teacher sees only the class(es) they are assigned to via `school_staff`.

- [ ] Build CA score entry page (teacher portal):
  - School + class selector (if teacher is at multiple schools)
  - Term selector
  - Subject tabs across the top
  - Table: student name | CA1 input | CA2 input | total (auto-calculated, read-only)
  - Validation: cannot exceed max score; highlights invalid cells in red
  - "Save Scores" button; shows last-saved timestamp
- [ ] Build exam score entry page (same layout, adds exam column, shows CA total as read-only, calculates grand total)
- [ ] Build comments entry page (teacher portal):
  - Student list for the class
  - Text area per student for teacher comment
- [ ] Build behavioral ratings page (teacher portal):
  - Student list
  - 5-star selector per trait per student (grid layout)

**School — Principal Comment Entry (in School Dashboard)**

- [ ] Build principal comment entry page (school dashboard — restricted to principal role):
  - Student list for a class
  - Text area per student for principal comment

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

**Goal:** School configures fees and invoices. Parent views outstanding fees and pays from their Monnify wallet. Automated reminders run on schedule. Bursar has a full payment dashboard.

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
- [ ] `POST /api/payments/fees/pay` — accepts `{ invoice_id, fee_type_ids[], pin }`: validates PIN, sums selected fee items, checks `parent_wallets.balance >= total`, calls Monnify disbursement to school's settlement account, debits wallet, creates `payments` record, updates `invoices.paid_amount`, recalculates balance, generates PDF receipt, sends WhatsApp + email to parent, notifies bursar
- [ ] `POST /api/payments/fees/topup-prompt` — if wallet balance is insufficient: returns parent's virtual account numbers and exact shortfall; Monnify webhook (Sprint 6) auto-triggers payment when funds arrive
- [ ] `GET /api/parents/wallet` (Sprint 6) — also used here to show wallet balance on fees screen

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
- [ ] Build Monnify wallet payment flow (reuse Sprint 7 pattern):
  - Wallet balance card shown at top of fees screen
  - Payment summary screen: itemised list of selected fees, total amount
  - PIN entry screen (6-digit PIN set during account activation)
  - "Confirm Payment" → server validates PIN + balance → Monnify disbursement → success
  - If balance insufficient: top-up screen showing virtual account numbers + shortfall amount
  - Success screen: receipt download + share button + "Back to Dashboard"
- [ ] Build payment history screen:
  - Chronological list: date, description, amount, receipt link
  - Filter by child and date range
- [ ] Build fee reminder notification action:
  - When parent taps a fee reminder notification → deep link to the fees screen for that child
  - "Snooze for 24 hours" button on the notification itself

**Definition of Done:** Bursar can create fee types, generate invoices for all students in a class, and view a full payment dashboard. Parent can see exactly what is owed per fee type, see their wallet balance, select items to pay, confirm with PIN, and download the receipt — all without leaving the app. Automated reminders fire on schedule and stop as soon as the invoice is fully paid.

---

## Cross-Sprint Notes

### Teacher messaging (Phase 4)

Teacher-parent messaging was not included in this sprint plan — it is lower priority than fees, results, and communications. Schedule it as Sprint 11 after the MVP launch and initial school feedback.

### AI features (Phase 7)

AI features require at least one full term of clean data (grades, attendance) to be meaningful. Schedule for Sprint 12+ after schools have completed at least one term on the platform.

### Mobile-first design rule

Every parent-facing screen must work on a budget Android phone (360px viewport, slow 3G). Test each screen on Chrome DevTools mobile emulation before marking a frontend task done.

### Monnify integration notes

- **Authentication:** Monnify uses Basic Auth (`base64(apiKey:secretKey)`) to obtain a token; cache the token server-side (valid 1 hour) and refresh on 401
- **Reserved account creation:** `POST /api/v2/bank-transfer/reserved-accounts` — called once per parent on activation; pass `getAllAvailableBanks: true` to get Wema + Sterling numbers; store the `accountReference` (your parent UUID) and both account numbers in `parent_wallets`
- **Inflow webhook:** `POST /api/webhooks/monnify` — validate the HMAC-SHA512 signature (`monnify-signature` header) before processing; event type `SUCCESSFUL_TRANSACTION` triggers wallet credit
- **Disbursement:** `POST /api/v2/disbursements/single` — platform initiates transfer from its Monnify wallet to the school's bank account; use a unique `reference` per payment for idempotency
- **Disbursement webhook:** `POST /api/webhooks/monnify` — same endpoint handles both inflow and disbursement events; check `eventType`: `SUCCESSFUL_DISBURSEMENT` confirms school received funds
- Store the Monnify `transactionReference` on every `payments` and `wallet_transactions` record for reconciliation and dispute resolution
- Sandbox at `https://sandbox.monnify.com` — simulate incoming transfers from the Monnify sandbox dashboard

### Notification delivery priority

Always attempt channels in this order: WhatsApp → In-app → Email → SMS. Only fall back to the next channel if the previous one fails (not delivered within 30 seconds).

### Branch strategy

Continues from Sprint Plan 1: feature branches off `develop`, merged via PR, auto-deployed to staging on merge to `develop`, manual deploy to production.

---

## Sprint 11 — School Store (Weeks 21–22)

**Goal:** Schools can list physical items for sale (books, uniforms, stationery, etc.) and parents can browse, order, and pay through the platform. The school manages fulfilment and tracks what has been collected.

### Context & Rationale

Schools currently handle item sales manually — parents call to ask what books are needed, pay cash at the gate, and queue to collect. This creates cash-handling risk, lost records, and unhappy parents. The Store centralises this: schools publish a catalogue, parents order and pay online, and the school prepares items before the parent arrives. No cash changes hands.

---

### How it works — End to End

**School side:**

1. Bursar or admin opens the Store section and creates product listings.
2. Each listing is visible to parents of the relevant class(es).
3. When a parent places an order and pays, the school gets notified immediately.
4. The orders page shows a fulfilment queue — the bursar marks each order as **Ready** when items are packed, and **Collected** when the parent picks them up.
5. At the end of term, the school can export a full sales report.

**Parent side:**

1. Parent opens the app and sees a "School Shop" card on their child's dashboard.
2. They browse available items (filtered automatically to their child's class).
3. They add items to a cart, review the order, and pay from their Monnify wallet — same PIN → deduction → disbursement flow as school fees.
4. They receive a WhatsApp receipt and a notification when their order is ready for collection.

---

### Data Model

```
store_products       — one row per item listed by a school
  id, school_id, name, description, category (book | uniform | stationery | other),
  price NUMERIC(10,2), stock_qty INT, applicable_class_ids UUID[], image_url,
  is_active BOOL, created_at, updated_at

store_orders         — one row per parent order
  id, school_id, parent_id, student_id, status (pending_payment | paid | ready | collected | cancelled),
  total_amount NUMERIC(10,2), monnify_reference, receipt_url, notes, created_at

store_order_items    — line items per order
  id, order_id, product_id, quantity INT, unit_price NUMERIC(10,2), subtotal NUMERIC(10,2)
```

---

### Backend API

**School — Product Management**

- [ ] `POST /api/store/products` — create a product listing (name, description, category, price, stock_qty, applicable_class_ids, image_url)
- [ ] `GET /api/store/products` — list all products for the school (filterable by category, class, active status)
- [ ] `PUT /api/store/products/:id` — update product (price, stock, active/inactive)
- [ ] `DELETE /api/store/products/:id` — soft-delete (sets `is_active = false`)

**Parent — Browsing & Ordering**

- [ ] `GET /api/parent/store?student_id=` — returns all active products applicable to this student's class
- [ ] `POST /api/store/orders` — parent submits an order (`{ items: [{ product_id, quantity }], pin }`); validates stock; checks wallet balance; calls Monnify disbursement to school; on success: marks order as `paid`, debits wallet, creates `wallet_transactions` debit record, deducts stock, generates receipt PDF, sends WhatsApp confirmation to parent, notifies bursar
- [ ] `POST /api/store/orders/topup-prompt` — if wallet balance insufficient: returns virtual account numbers + shortfall amount
- [ ] `GET /api/parent/store/orders?student_id=` — parent's order history for a child

**School — Order Fulfilment**

- [ ] `GET /api/store/orders?status=&class_id=&date=` — list all orders for the school (filterable by status, class, date)
- [ ] `PUT /api/store/orders/:id/status` — update order status (`ready` or `collected`)
- [ ] `GET /api/store/orders/export?term_id=` — export full order/sales data as CSV

---

### Frontend

**School — Products Page (`/school/dashboard/store/products`)**

- [ ] Product catalogue table: name, category chip, price, stock, applicable classes, active toggle
- [ ] "Add Product" modal:
  - Name, description, category dropdown (Book / Uniform / Stationery / Other)
  - Price input (₦), stock quantity input
  - Class multi-select (which classes this product is for)
  - Image upload (optional — shows placeholder if none)
  - "Save Product" button
- [ ] Inline edit: click a row to edit price or stock quantity directly
- [ ] "Deactivate" button per row (removes from parent view without deleting)

**School — Orders Page (`/school/dashboard/store/orders`)**

- [ ] Status tab bar: All | Paid (pending pack) | Ready | Collected | Cancelled
- [ ] Order table: order date, parent name, student name, class, item summary, total, status chip, action button
- [ ] Order detail drawer (click a row):
  - Line items list: product name, qty, unit price, subtotal
  - Parent contact (phone number)
  - "Mark as Ready" button → status becomes `ready`; parent receives WhatsApp notification
  - "Mark as Collected" button → status becomes `collected`
- [ ] "Export Sales Report" button → downloads CSV

**Parent — School Shop (child dashboard → "Shop" tab)**

- [ ] Product grid: image (or category icon placeholder), name, price, class badge, "Add to Cart" button
- [ ] Cart drawer: list of selected items, quantities (increment/decrement), subtotal per item, order total
- [ ] Order review screen: itemised list, school name, total, "Pay ₦X,XXX" button
- [ ] Monnify wallet payment flow (same PIN → wallet deduction → Monnify disbursement → success pattern as fees)
- [ ] Order history screen: list of past orders with status chips (Paid / Ready for Collection / Collected)
- [ ] Push notification when order is marked Ready: "Your order at [School Name] is ready for collection"

---

### Key Rules

1. Stock is decremented only on confirmed Monnify disbursement, not on order creation.
2. If payment fails or times out, the order is cancelled and stock is restored.
3. A product with `stock_qty = 0` shows as "Out of Stock" on the parent side and cannot be added to cart.
4. Store payments go into the same school bank account as fee payments — no separate wallet.
5. Store sales appear in the bursar's Finance dashboard alongside fee income.

**Definition of Done:** School admin can list products with prices, classes, and stock levels. Parent can browse items for their child's class, place an order, pay from their Monnify wallet with a PIN, and receive a WhatsApp receipt. School receives an instant notification, packs the order, marks it ready, and records collection. Parent receives a WhatsApp notification when items are ready.

---

## Sprint 12 — Native Accounting Layer (Weeks 23–24)

**Goal:** Give the school bursar a complete, school-native accounting system — income from fees and store sales, school expenses, a term-level P&L, and export to Excel/CSV — so they never need to use a physical accounts book again.

### Context & Rationale

A typical Nigerian school bursar today does the following in a physical book:

- Records every fee payment received per student
- Tracks what each parent still owes
- Records school expenses (salaries, electricity, cleaning, supplies)
- At the end of term, tallies income vs expenses to get the net position

We are not building QuickBooks. We are building the specific accounting workflow a school bursar already does — digitised, automated where possible, and with a clean export when their external accountant needs to review it.

**Why not QuickBooks integration:** QuickBooks costs extra per seat, requires training most Nigerian school bursars have not had, and is designed for general business — not school-specific workflows like term-based billing, fee types per class, and invoice-per-student ledgers. Our native layer is simpler, cheaper, and purpose-built.

**The export IS the integration point.** When the school's accountant needs to prepare annual accounts or file tax returns, they download a CSV and work in whatever tool they prefer.

---

### Accounting Model

Income sources tracked by the platform:

1. **Fee payments** — already recorded in `payments` table (Sprint 10)
2. **Store sales** — recorded in `store_orders` (Sprint 11)
3. **Application fees** — recorded in `payments` table (Sprint 7)

New — Expenses:

```
school_expenses
  id, school_id, term_id, category ENUM, description TEXT,
  amount NUMERIC(10,2), expense_date DATE, recorded_by UUID (staff),
  receipt_url (optional), created_at
```

Expense categories:

```
salaries | utilities | maintenance | supplies | transport |
events | taxes | rent | other
```

---

### Data Model Additions

```
school_expenses      — every outgoing recorded by the bursar
  id, school_id, term_id, category, description, amount,
  expense_date, recorded_by, receipt_url, created_at

accounting_periods   — defines the financial period for reporting
  id, school_id, term_id, academic_year_id,
  total_income NUMERIC generated, total_expenses NUMERIC generated,
  net_position NUMERIC generated (income − expenses),
  is_closed BOOL (once closed, no more expense entries allowed)
```

---

### Backend API

**Expenses**

- [ ] `POST /api/accounting/expenses` — bursar records an expense (category, description, amount, date, optional receipt image)
- [ ] `GET /api/accounting/expenses?term_id=&category=&date_from=&date_to=` — list expenses with filters
- [ ] `PUT /api/accounting/expenses/:id` — edit an expense (only if the accounting period is not closed)
- [ ] `DELETE /api/accounting/expenses/:id` — soft-delete

**Income Summary (aggregated from existing tables)**

- [ ] `GET /api/accounting/income?term_id=` — returns:
  - Total fee income (sum of all `payments` records for this term)
  - Total store income (sum of all paid `store_orders` for this term)
  - Total application fee income
  - Grand total income

**P&L Report**

- [ ] `GET /api/accounting/pnl?term_id=` — returns:
  - Income breakdown (fees, store, application fees, subtotals)
  - Expense breakdown (grouped by category, subtotals)
  - Net position (income − expenses)
  - Comparison to previous term (% change in income, % change in expenses)

**Export**

- [ ] `GET /api/accounting/export?term_id=&type=income|expenses|full` — returns a CSV file:
  - **Income CSV:** date, student name, class, fee type / item, amount, Monnify reference
  - **Expenses CSV:** date, category, description, amount, recorded by
  - **Full CSV:** both sheets combined with a summary row

**Period Close**

- [ ] `POST /api/accounting/periods/:term_id/close` — marks the accounting period as closed; no new expense entries permitted; sends a summary email to the school admin

---

### Frontend

**Bursar Dashboard — Accounting Tab**

Extend the existing Bursar Dashboard with a new "Accounting" tab alongside the existing payments view.

**Income Panel**

- [ ] Summary cards: Fee Income / Store Income / Application Fees / Total Income (all for the selected term)
- [ ] Income trend chart: bar chart comparing this term vs last term vs the term before
- [ ] Income breakdown table: source, number of transactions, total amount

**Expense Tracker**

- [ ] Expenses table: date, category chip, description, amount, recorded by, actions (edit / delete)
- [ ] "Record Expense" button → modal:
  - Category dropdown
  - Description text input
  - Amount (₦) input
  - Date picker (defaults to today)
  - Optional: receipt image upload
  - "Save Expense" button
- [ ] Category filter + date range filter above the table
- [ ] Running total: "Total expenses this term: ₦X,XXX,XXX"

**P&L Summary Page**

- [ ] Term selector at top (defaults to current term)
- [ ] Two-column layout:
  - Left: Income breakdown (fee types + store + application fees → total income)
  - Right: Expense breakdown (grouped by category → total expenses)
- [ ] Net position banner at the bottom:
  - Green banner if net positive: "Net surplus: ₦X,XXX,XXX"
  - Red banner if net negative: "Net deficit: ₦X,XXX,XXX"
- [ ] Comparison line: "vs last term: income +12%, expenses −5%"
- [ ] "Export to Excel" button → calls the export endpoint, downloads file

**Close Period**

- [ ] "Close This Term's Accounts" button (restricted to school admin role, not bursar):
  - Confirmation modal: "Closing the accounts means no more expenses can be added for this term. This cannot be undone."
  - On confirm: period is closed, button replaced with "Accounts closed on [date]" label

---

### Export Format (Excel / CSV)

**Income sheet columns:**
`Date | Student Name | Admission No. | Class | Fee Type / Item | Amount (₦) | Monnify Reference | Recorded At`

**Expenses sheet columns:**
`Date | Category | Description | Amount (₦) | Recorded By | Receipt`

**Summary sheet:**
`Total Income | Total Expenses | Net Position | Term | Academic Year | Exported At`

---

### Key Rules

1. Income figures are derived entirely from the `payments` and `store_orders` tables — the bursar cannot manually enter income. This ensures the accounting record always matches the actual payment data.
2. Expenses are the only manually entered entries, and they are soft-deleted (never hard-deleted).
3. A closed accounting period is immutable — no edits, no new entries. This is important for audit integrity.
4. All monetary values displayed in ₦ with comma formatting (e.g. ₦1,250,000.00).
5. The export file is named: `[SchoolName]_[Term]_[AcademicYear]_Accounts.csv`
6. The audit log (existing `audit_logs` table) captures every expense creation, edit, delete, and period close — with the staff member's name and timestamp.

**Definition of Done:** The bursar can record every school expense with a category and date. The P&L page shows total income (auto-calculated from real payment data), total expenses, and the net position for the term — with a comparison to the previous term. The school admin can close the accounts at end of term and download a clean export that an external accountant can work with in Excel.

---

_Last updated: 2026-06-06_

for the OTP, we are gonna use African talking. (backend API).

we have to add a feature for parents to be able to schdule a meetup with teachers.

Application flow

Application detail view — "View details" on the track page goes nowhere
Monnify wallet payment flow — PIN entry screen, wallet balance check, and Monnify disbursement (current Step 4 in the frontend is a mockup)
Account

Parent invite activation page (/parent/activate?token=xxx) — PIN setup for school-invited parents
Notifications

Date grouping (Today / Yesterday / This Week)
Tapping a notification navigates to the relevant screen (fee, result, announcement)
"Mark All Read" actually works
Unread count badge on the sidebar bell icon
Quiet hours toggle in notification preferences (the toggle exists in the plan but isn't in the current NotifSection)
Report card

PDF download button
Share via WhatsApp button
Fees

Checkboxes to select individual fee items to pay
"Pay Selected (₦X)" and "Pay All (₦X)" buttons
Fee reminder snooze ("Snooze for 24 hours" on a reminder notification)
New feature (from your note)

Schedule a meetup with a teacher — form to request a meeting (date, time, reason), teacher responds to approve/reject
That's roughly 8 areas. The biggest ones are the Monnify wallet payment flow and the notifications improvements. The meetup scheduler is net new — not in the sprint plan at all.

Which do you want to tackle first?
