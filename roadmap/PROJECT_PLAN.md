# SchoolFlow — Project Plan

## Problem Statement

Most schools in Nigeria operate entirely on paper. Records are lost, parents are hard to reach, and admin work consumes hours that should go to teaching. This project introduces technology to these schools in a gradual, trust-building way — starting with the simplest possible win (getting student and parent data online) and expanding into a full AI-powered school management platform over time.

The target customer is the school owner or principal who has never used a digital system before. Every decision in this build must reflect that reality.

---

## Vision

A multi-tenant, AI-enhanced School Management Information System (MIS) sold as a monthly SaaS subscription to Nigerian primary and secondary schools. One platform, many schools — each with fully isolated data, their own dashboard, and an onboarding path designed for non-tech staff.

**Product name:** SchoolFlow  
**MVP target launch:** June 2026  
**MVP development timeline:** 4–6 months (starting December 2025)  
**Pricing model:** ₦500–₦1,000 per student per month (billed to the school).

---

## Guiding Principles

1. **Start simple, earn trust, then expand.** Never introduce a feature before the school is ready for it.
2. **Design for non-tech teachers.** If it requires training, it's too complex.
3. **Multi-tenant from day one.** Every table has a `school_id`. RLS is set up before the first row of data is written.
4. **Money is stored in naira as a decimal value (e.g. `NUMERIC(12,2)`).**
5. **Enrollment is the central join.** A student's relationship to a school, class, and term is always resolved through the `enrollments` table.
6. **Payments via OPay.** All parent payments are processed through OPay. No wallet or virtual account complexity at this stage.

---

## MVP Scope

The MVP covers the School Portal (onboarding + operations) and the Parent Portal (6 core features).

| #   | Feature                                    | Phase             |
| --- | ------------------------------------------ | ----------------- |
| S1  | School registration & admin setup          | Phase 0           |
| S2  | Receive & process student applications     | Phase 0 / Phase 2 |
| 1   | Child enrollment & application fee payment | Phase 2           |
| 2   | Pay children's school fees                 | Phase 6           |
| 3   | Receive school notifications               | Phase 3           |
| 4   | Fee reminder notifications                 | Phase 6           |
| 5   | View CA scores & term results              | Phase 5           |
| 6   | Message class teacher                      | Phase 4           |

---

## Phased Rollout

### Phase 0 — School Registration & Onboarding

_(School Portal Feature S1: School Registration & Admin Setup)_

A school must complete registration and KYC before it can use any feature on the platform. This phase covers the entire journey from landing page to an active, verified school account.

#### A. School Registration (3-step form)

- **Step 1 — School details:** name, school type (Nursery / Primary / Secondary / combined), address, city/LGA, state, phone, email
- **Step 2 — Admin account:** name, position (Principal / Vice Principal / Bursar / Registrar / ICT Admin), email, phone, password
- **Step 3 — Subdomain:** school chooses their subdomain (e.g. `greenfield.schoolflow.com`); validated for uniqueness in real time; cannot be changed after registration
- Email verification required before account is activated

#### B. Backend provisioning on registration

When registration is submitted, the system automatically:

- Creates a tenant record in the master DB with: `status: pending_kyc`, `kyc_status: not_submitted`, `visibility: hidden`, `payments_enabled: false`, `plan: starter`
- Provisions a school-specific database (all tables created, default seed data applied)
- Creates the admin staff record with full permissions
- Does NOT create an OPay merchant record yet — that happens only after KYC approval

#### C. KYC Verification (4-step form)

School CANNOT receive payments and is NOT visible to parents until KYC is approved. The school can continue configuring the system while KYC is under review.

- **Step 1 — School documents:** registration certificate, operating licence, proof of address (each as PDF or image, max 5MB)
- **Step 2 — Proprietor information:** full name, ID type (National ID / Passport / Driver's Licence / Voter's Card), ID number, ID front photo, ID back photo, phone, email
- **Step 3 — Bank account:** bank name, account number, account name verified via name-enquiry API, account type
- **Step 4 — Review & submit:** confirmation checkboxes; school receives a "submitted, under review" screen after submitting

#### D. Platform Admin KYC review

- All pending KYC submissions appear in the Platform Admin panel
- Admin reviews each document individually and can mark it approved or rejected with notes
- Admin can make one of three decisions: **Approve**, **Reject**, or **Request More Information**

**On Approve:**

- `kyc_status → approved`, `status → active`, `visibility → public`, `payments_enabled → true`
- OPay merchant account activated for the school
- Approval email + in-app notification sent to school admin and proprietor

**On Reject:**

- Rejection reason sent to school admin by email and in-app notification
- School can update documents and resubmit; the review loop repeats until approved

#### E. Onboarding Wizard (first login — accessible while KYC is pending)

A 5-step guided setup, every step skippable:

1. Upload school logo (PNG/JPG, max 2MB)
2. Select classes offered (Pre-Nursery through SSS3)
3. Set current academic year, current term, and term start/end dates
4. Invite the school proprietor (owner) by name, email, and phone — owner receives an email invitation
5. Summary screen: getting-started checklist + 30-day free trial notice

#### F. Dashboard first view

- Getting-started checklist: complete setup, invite proprietor, add staff, create classes, add students, set fees, configure grading, test parent portal access
- KYC status banner shown until KYC is approved (shows current status: not submitted / under review / approved / rejected)
- Quick stats panel (all zeros on first login)
- School dashboard accessible at `[subdomain].schoolflow.com`

---

### Phase 1 — Data Collection

Get every student and parent record online. This is the foundation everything else is built on.

**How it works:**

- Class teachers receive a WhatsApp link to a Google Form
- The form asks for: student full name, class, parent name, parent phone number, parent email (optional)
- Form is deliberately simple — one question at a time, no login required
- Every submission lands in a Google Sheet owned by the admin
- A Google Apps Script `onFormSubmit` trigger fires a `POST` request to the backend API, including a hidden `school_id` field

**Why Google Form, not a spreadsheet shared with teachers:**
A Google Form is almost impossible for a non-tech teacher to break. A shared spreadsheet can have rows deleted, columns shifted, or data entered in the wrong cell. The form abstracts all of that away.

**Parent deduplication logic:**

- Teachers enter student records only
- Parents are linked separately using their phone number as the unique identifier
- If a parent's phone number already exists in the system, a second child is simply linked to the existing parent record — no duplicate parent entry
- One parent, multiple children, one PTA group invite, one combined report

---

### Phase 2 — Parent Portal & Enrollment

_(MVP Feature 1: Child Enrollment & Application Fee Payment)_

Parents can register themselves, search for schools, submit applications for their children, and pay application fees — all without visiting the school physically.

#### Parent self-registration

- Parent signs up with phone number + OTP verification (no email required)
- Welcome message sent via WhatsApp

#### School search & discovery

- Parents can search schools by name, location, type (Nursery / Primary / Secondary)
- Each school listing shows: name, location, school type, application fee, ratings
- Parents can view school details before applying

#### Child enrollment application

- Parent fills an application form per child: name, date of birth, gender, desired class, previous school, medical notes, photo upload, birth certificate upload (optional)
- Multiple guardians can be added per child
- Parent reviews a summary before proceeding to payment

#### Application fee payment

- Parent clicks "Pay Application Fee" — an OPay checkout is opened
- Parent pays via any OPay-supported method (card, bank transfer, USSD, OPay balance)
- OPay sends a webhook to the system on successful payment
- System records the payment, marks the application as paid, and generates a PDF receipt
- WhatsApp + email confirmation sent to parent; school admin notified instantly
- Application status tracking: `Under Review → Exam/Interview Scheduled → Admitted → Not Admitted`

---

### Phase 3 — PTA Communication & Notifications

_(MVP Feature 3: Receive School Notifications)_

Once data is clean, the system manages the entire PTA WhatsApp group lifecycle and powers the full notification engine.

#### PTA WhatsApp group invite flow

1. Admin creates the school's PTA WhatsApp group manually and generates a group invite link.
2. Admin pastes the invite link into the dashboard — the system stores it against the school.
3. The system generates a **unique tracking URL per parent** (e.g. `app.com/join/abc123`). When a parent taps it, they are redirected to the WhatsApp group invite link and the system marks that parent as **Invite Sent → Link Clicked**.
4. The system sends each parent this tracking link automatically via the WhatsApp Business API as a personalised message.

**Why not auto-add parents directly to the group:**
The official WhatsApp Business API does not support adding users to groups. Unofficial libraries (Baileys, whatsapp-web.js) can do it but violate WhatsApp's Terms of Service and risk the school's number being permanently banned. The tracked invite link approach is the safe, reliable, and scalable alternative.

#### PTA group membership tracker

| Status         | Meaning                        | How it's set                   |
| -------------- | ------------------------------ | ------------------------------ |
| `not_invited`  | Parent exists, no invite sent  | Default                        |
| `invite_sent`  | WhatsApp message delivered     | Set when API confirms delivery |
| `link_clicked` | Parent tapped the tracking URL | Set automatically on redirect  |
| `in_group`     | Parent has joined the group    | Set by group bot or admin      |
| `left_group`   | Parent left the group          | Set by group bot or admin      |

**Group bot (optional):** A WhatsApp bot number added as group admin detects join/leave events and updates the tracker automatically via webhook.

#### Admin dashboard — PTA view

- Table of all parents with WhatsApp group status
- One-click "Invite All Uninvited" and "Re-invite Non-Joiners" buttons
- Count summary: X of Y parents are in the group

#### Notification engine

**Notification types:**

- Fee reminders and payment confirmations
- Result release (CA scores and term reports)
- School announcements and event reminders
- Attendance alerts (parent notified when child is marked absent)
- Application status updates
- Messages from class teacher
- Urgent alerts (school closure, emergencies)

**Delivery channels (in priority order):**

1. WhatsApp (primary — ~90% open rate in Nigeria)
2. In-app push notifications
3. Email (formal records, PDF attachments)
4. SMS (fallback for critical notifications when WhatsApp unavailable)

**Parent notification preferences:**

- Parents can toggle each notification type per channel (WhatsApp / Email / SMS)
- Frequency: real-time, daily digest, or weekly digest
- Quiet hours: no notifications between 10 PM and 7 AM
- Critical notifications (urgent alerts) cannot be disabled

---

### Phase 4 — Teacher-Parent Messaging

_(MVP Feature 6: Message Class Teacher)_

Parents can message their child's class teacher directly from within the app. Teachers respond from the school dashboard.

- Conversations are scoped to a specific child (one thread per parent-child-teacher relationship)
- Teachers see all parent messages in a unified inbox on their dashboard
- Message history is preserved and searchable
- Parents receive a WhatsApp notification when the teacher replies
- File attachments supported (photos, documents)
- Admins can view all conversations for safeguarding purposes

---

### Phase 5 — Report Cards & Academic Results

_(MVP Feature 5: View CA Scores & Term Results)_

Teachers enter scores; the system does all the maths, generates professional PDFs, and delivers reports to parents automatically.

#### CA score entry (mid-term)

- Teachers enter CA1 and CA2 scores per subject per student
- System calculates total CA score and grade automatically
- Once published, parents receive a WhatsApp notification with a summary
- Parent can view full CA score table per subject in the app

#### End-of-term results

- Teachers enter exam scores per subject
- System calculates: CA1 + CA2 + Exam = Total; derives grade, position in class
- Teacher writes a class comment; principal writes a principal comment
- Behavioral ratings (5-star scale: punctuality, attentiveness, neatness, cooperation, leadership)
- Attendance summary included (days present / absent / late, attendance percentage)
- Next term resumption date and fee amount displayed at the bottom of the report

#### PDF report card

- Generated automatically when the school publishes results
- Contains: school logo, student photo, admission number, results table, attendance summary, behavioral ratings, teacher and principal comments, QR code for verification, school stamp and digital signature
- A4 format, print-ready, styled in school colours
- Parents can download, share via WhatsApp/email, or print

#### Performance trends

- Parents can view a term-over-term graph of their child's average score
- Subject-wise breakdown: strongest subjects and subjects needing improvement
- AI-generated recommendations (Phase 7) layered on top of this data

---

### Phase 6 — Finance Module

_(MVP Features 2 & 4: Pay School Fees + Fee Reminder Notifications)_

#### Fee payments

- Parent sees all children's outstanding fees in one dashboard
- Fees broken down by type: tuition, books, uniform, transport, exam fees, etc.
- Parent can select specific fee items to pay (partial payment supported) or pay all at once
- Parent clicks "Pay" — an OPay checkout opens for the selected amount
- OPay sends a webhook on successful payment; system records the payment and updates the student ledger
- Real-time receipt (PDF) generated on success; downloadable and shareable via WhatsApp
- School bursar receives instant notification of payment
- Student ledger updates immediately (visible to school dashboard)

#### Automated fee reminders

| Trigger                    | Message tone                               |
| -------------------------- | ------------------------------------------ |
| 14 days before deadline    | Friendly early reminder                    |
| 7 days before deadline     | Urgent reminder with direct "Pay Now" link |
| 2 days before deadline     | Urgent                                     |
| Day of deadline            | Final warning                              |
| 1 day overdue              | Overdue notice                             |
| Every 3 days after overdue | Persistent until paid                      |

**Smart reminder rules:**

- Reminders stop immediately when payment is made
- Partial payments are acknowledged and remaining balance is shown
- Each reminder includes a direct "Pay Now" link that opens OPay checkout immediately
- Multiple children with outstanding fees are consolidated into one message (not separate messages per child)
- Tone is always polite and respectful — never threatening
- Reminders are not sent during quiet hours (10 PM – 7 AM)
- Parent can snooze a reminder for 24 hours

---

### Phase 7 — AI Features

- Attendance pattern analysis — early warning flags for at-risk students
- AI-generated narrative comments for report sheets (teacher can edit before publishing)
- Plain-English insights for principals ("3 students in JSS2 have missed more than 30% of classes this term")
- WhatsApp chatbot for parents to query their child's fees balance or attendance

---

## Technology Stack

| Layer          | Choice                     | Reason                                                                          |
| -------------- | -------------------------- | ------------------------------------------------------------------------------- |
| Database       | PostgreSQL                 | Native RLS for multi-tenant isolation, JSONB, array types, generated columns    |
| Backend        | Java API Routes            | Familiarity, strong typing, good for complex business logic                     |
| Frontend       | Next.js                    | Subdomain or path-based tenant routing                                          |
| File Storage   | AWS S3                     | Report PDFs, profile photos, document uploads                                   |
| Payments       | OPay                       | Nigerian market coverage, card/bank transfer/USSD support, webhook confirmation |
| Messaging      | WhatsApp Business API      | Parent notifications, PTA group invite tracking                                 |
| Data Ingestion | Google Forms + Apps Script | Teacher-facing, zero friction                                                   |

**Why PostgreSQL over MySQL:**

- Row Level Security — multi-tenant data isolation enforced at the database level
- Native JSONB — for webhook payloads, external results, AI insights
- Array column types — for staff qualifications, announcement channels
- Generated columns — for auto-calculated totals and balances

---

## Database Schema

### Core / Tenancy

```
schools              — one row per school (tenant); includes: kyc_status (not_submitted | under_review | approved | rejected), status (pending_kyc | active | suspended), visibility (hidden | public), payments_enabled bool
academic_years       — e.g. "2024/2025", scoped to school
terms                — First/Second/Third term per academic year
```

### School Onboarding & KYC (Phase 0)

```
kyc_submissions      — one record per submission attempt; tracks: school_id, status, submitted_at, reviewed_at, reviewer_id, admin_notes (internal), school_message (sent to school on reject)
kyc_documents        — individual uploaded files per submission; type enum: registration_cert | operating_licence | proof_of_address | proprietor_id_front | proprietor_id_back; stores S3 URL and per-document approval status
school_onboarding    — tracks onboarding wizard progress per school (completed steps stored as JSONB)
```

### People

```
users                — all human accounts (teachers, admin, parents), with role enum
students             — student profiles, scoped to school
staff                — teacher/admin profiles, linked to users
classes              — e.g. "JSS1A", scoped to school
```

### Enrollment & Applications (new — Phase 2)

```
applications         — a child's application to a school; includes status enum and documents (JSONB)
application_fees     — fee charged per application; linked to payment record
```

### Relationships / Join Tables

```
student_parents      — many-to-many: one parent → many students, one student → many parents
enrollments          — student + class + term + academic_year (central join for academic records)
class_subjects       — which subjects are taught in which class
assignment_submissions
```

### Academic

```
subjects             — subject definitions per school
grades               — CA1 + CA2 + exam score + generated total, per enrollment + subject
attendance           — daily attendance per student per class
reports              — generated term report per enrollment (includes status: draft | published)
timetables
assignments
external_results     — WAEC/NECO/BECE results stored as JSONB
```

### Finance

```
fee_types            — e.g. "School Fees", "PTA Levy" — amounts in naira
invoices             — per student per term, balance is a generated column
payments             — individual payment records linked to invoice
```

### Communication & Messaging (new — Phase 3 & 4)

```
notifications        — per-user notification log (type, channel, status: sent | delivered | read)
announcements        — school-wide or class-targeted broadcasts
pta_invites          — per-parent invite tracking (status: not_invited | invite_sent | link_clicked | in_group | left_group)
message_threads      — one thread per parent + child + teacher relationship
messages             — individual messages within a thread (sender, body, attachments, read_at)
```

### Onboarding

```
google_form_configs  — stores each school's Form ID and linked Sheet ID
student_imports      — staging table for rows received from Google Form before validation
```

### AI

```
ai_insights          — AI-generated observations stored per school per term
```

### System

```
audit_logs           — automatic record of every INSERT/UPDATE/DELETE via Postgres triggers
subscriptions        — tenant billing plan and status
billing_invoices     — platform-level invoices sent to schools
```

---

## Key Schema Rules

1. Every table has `school_id uuid NOT NULL REFERENCES schools(id)` — no exceptions.
2. Row Level Security is enabled on every table from day one.
3. The `enrollments` table is the single source of truth for "which student is in which class in which term." Grades, attendance, and reports all join through it.
4. All monetary values are stored as `NUMERIC(12,2)` in naira (e.g. `5000.00`).
5. `users.role` is an enum: `super_admin | school_admin | teacher | parent | bursar`.
6. Soft deletes via `deleted_at timestamptz` — no hard deletes on core records.
7. Payment records store the OPay transaction reference for reconciliation and dispute resolution.
8. A school with `kyc_status != 'approved'` must not appear in parent-facing school search results, and all payment endpoints must reject requests from such schools.

---

## Build Order

1. Build school registration form (3-step: school details → admin account → subdomain)
2. Build email verification flow
3. Build tenant provisioning (school DB creation, admin staff record, default seed data)
4. Build KYC submission form (4-step: school docs → proprietor info → bank account → review)
5. Build Platform Admin KYC review panel (approve / reject / request more info)
6. Build KYC approval flow — flip school status, activate OPay merchant, send notifications
7. Build onboarding wizard (5-step, each step skippable)
8. Build getting-started checklist and KYC status banner on admin dashboard
9. Set up PostgreSQL schema — enable RLS immediately
10. Write and run SQL migration files for the core schema (schools, users, students, classes, enrollments, student_parents)
11. Build the Google Form → Apps Script → API ingestion pipeline
12. Build the admin dashboard with tenant routing
13. Build parent self-registration (phone OTP)
14. Build school search and child application flow
15. Build application fee payment via OPay (checkout → webhook → receipt)
16. Add PTA invite tracking and WhatsApp notification engine
17. Build teacher-parent messaging (threads + inbox)
18. Build grades entry UI for teachers (CA + exam scores)
19. Build PDF report card generation and delivery
20. Build fee invoice system + OPay payment flow
21. Build automated fee reminder scheduler
22. Layer in AI insights last, once clean data exists

---

## What to Build First (This Week)

- [ ] Build school registration form (3 steps: school details → admin account → subdomain)
- [ ] Build email verification flow
- [ ] Build tenant + school DB provisioning on successful registration
- [ ] Write SQL migration for: `schools`, `kyc_submissions`, `kyc_documents`, `school_onboarding`, `academic_years`, `terms`, `users`, `students`, `classes`, `enrollments`, `student_parents`
- [ ] Enable RLS on all tables
- [ ] Build KYC submission form (4 steps)
- [ ] Build Platform Admin KYC review panel
- [ ] Build onboarding wizard (5 steps, skippable)

---

_Last updated: 2026-05-08_
