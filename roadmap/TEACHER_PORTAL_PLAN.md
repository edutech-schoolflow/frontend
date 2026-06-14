# Teacher Portal — Feature Plan

This document covers everything a Nigerian school teacher does manually today and how the platform automates or digitalises each duty. Organised by the natural rhythm of a teacher's work: daily, weekly, per-assessment, per-term, and professional.

---

## Design Philosophy

A teacher's time belongs in the classroom, not behind a desk filling forms. Every feature in this portal exists to eliminate a manual, paper-based step. If a teacher currently writes it in a notebook, types it into a spreadsheet, or carries it home in a folder — this platform should handle it.

---

## 1. Attendance Management

**What teachers do manually today:**

- Call names from a register book every morning
- Write absent/late students in a different book
- Submit weekly attendance totals to the admin office
- Calculate each student's attendance percentage at end of term (by hand or Excel)
- Notify parents of absences by phone call or sending a note home with another student

**Platform automation:**

- Digital register: teacher taps present / absent / late per student each morning — takes 60 seconds
- System auto-calculates cumulative attendance percentage per student, per term
- Parent receives an automatic WhatsApp notification the same morning when their child is marked absent
- End-of-term attendance summary auto-included in the report card — no calculation needed
- Admin can see real-time attendance across all classes from the school dashboard
- Late pattern alerts: system flags students who are late more than 5 times in a term

**Features to build:**

- [ ] Morning register (list of students, tap to mark)
- [ ] Bulk mark (mark all present, then adjust exceptions)
- [ ] View attendance history per student
- [ ] Attendance summary card per class (present today / absent today / late today)
- [ ] Parent auto-notification on absence
- [ ] End-of-term attendance report (auto-generated)
- [ ] Late/absence pattern flag (configurable threshold)

---

## 2. Lesson Planning & Scheme of Work

**What teachers do manually today:**

- Write lesson notes by hand or in Word/Google Docs each week
- Submit printed lesson notes to the HOD or principal for approval before teaching
- Write a scheme of work at the start of term covering what will be taught in each week
- Keep a record of which topics have been covered and which are pending

**Platform automation:**

- Digital lesson note editor — teacher types directly in the app, formats it cleanly, submits with one tap
- HOD/principal receives a notification, reviews and approves or returns with comments — no printing, no carrying
- Scheme of work builder: drag-and-drop weekly topics for the term, system tracks progress against plan
- Auto-reminder if a lesson note has not been submitted by a configured deadline

**Features to build:**

- [ ] Lesson note editor (rich text: headings, objectives, content, evaluation)
- [ ] Submit for approval flow (draft → submitted → approved / returned with comments)
- [ ] HOD approval inbox (approve, reject with note, request revision)
- [ ] Scheme of work planner (week-by-week topic grid for the term)
- [ ] Progress tracker: topics taught vs topics planned
- [ ] Lesson note archive (teacher can search past notes by subject, date, topic)
- [ ] Template library: school can set a standard lesson note format; teacher fills in the blanks

---

## 3. Exam Question Setting & Submission

**What teachers do manually today:**

- Type exam questions in Word or write by hand
- Submit printed questions to the HOD or exam coordinator for review
- HOD reviews, approves, sometimes returns for corrections
- Admin prints the final exam script and distributes on exam day
- This process involves multiple rounds of printing, carrying physical papers, and back-and-forth

**Platform automation:**

- Teacher types questions directly in the portal with a structured question editor
- Supports question types: multiple choice (with options A–D), theory, fill-in-the-blank, essay
- Questions submitted digitally to HOD for review — HOD can comment on individual questions
- HOD approves the question paper; admin downloads and prints the final PDF
- Question bank: teacher can save reusable questions, build new exams by pulling from previous years
- Exam generation: teacher sets "pick 10 random questions from this bank" — system shuffles and generates the paper

**Features to build:**

- [ ] Question editor (multiple choice, theory, fill-in-blank, essay types)
- [ ] Question bank (store and tag questions by topic, difficulty, year)
- [ ] Exam builder: compose a paper from question bank or write fresh
- [ ] Set marks per question
- [ ] Submit exam paper to HOD for review
- [ ] HOD review interface: approve, comment on specific questions, return for revision
- [ ] Admin download: print-ready PDF of approved exam paper
- [ ] Exam paper version history (tracks all edits with timestamps)
- [ ] Auto-shuffle: generate variant A and variant B from the same question bank (reduces cheating)

---

## 4. Score Entry & Results

**What teachers do manually today:**

- Write CA scores in a mark book per student per subject
- Transfer scores from mark book to a result sheet (manually, prone to errors)
- Calculate totals, averages, and positions by hand or in Excel
- Write these scores onto individual report card templates
- Submit result sheets to admin for compilation

**Platform automation:**

- Teacher enters scores directly — system calculates totals, grades, and positions automatically
- Scores lock at submission deadline — no accidental edits after submission
- Teacher can preview the full compiled report card before it goes to the principal
- System flags impossible entries (e.g. CA score above maximum)
- Score entry progress bar: "8 of 32 students entered" — teacher knows where they stopped

**Features to build:**

- [ ] CA score entry grid (student list × subject columns)
- [ ] Exam score entry grid (same layout, adds exam column, shows CA total as read-only)
- [ ] Auto-calculation: total, grade, class position (handles ties correctly)
- [ ] Score validation: cannot exceed maximum, cannot be negative
- [ ] Save progress (auto-save on every change, not just on "submit")
- [ ] Submission deadline enforcement: scores lock after the admin-set deadline
- [ ] Score entry progress tracker
- [ ] Preview report card per student before submission
- [ ] Bulk import option: teacher can upload a filled Excel template as fallback

---

## 5. Student Comments & Behavioral Ratings

**What teachers do manually today:**

- Write a comment per student on the report card (20–40 students × 2–3 sentences each)
- Rate students on behavioral traits: punctuality, neatness, cooperation, etc.
- These are handwritten on printed report card sheets and can take hours per term

**Platform automation:**

- Structured comment entry: one text box per student, with AI-assisted suggestions based on the student's scores and attendance (teacher can edit freely)
- Behavioral rating grid: 5-star or A–E scale per trait per student — simple tap interface
- Psychomotor/affective domain ratings (drawing, music, sport, handwriting) — configurable by school
- Comment templates: teacher saves reusable phrases ("A diligent student who...", "Needs to improve...")

**Features to build:**

- [ ] Class teacher comment entry (one text area per student)
- [ ] AI comment suggestion (optional — generates draft based on scores + attendance, teacher edits)
- [ ] Comment template library (teacher builds their own phrase bank)
- [ ] Behavioral ratings grid (punctuality, neatness, attentiveness, cooperation, leadership, politeness)
- [ ] Psychomotor ratings (drawing, music, sports, handwriting, spoken English) — shown only if school enables them
- [ ] Bulk copy: apply the same rating to multiple students, then adjust individually

---

## 6. Assignment Management

**What teachers do manually today:**

- Write assignment questions on the board or on sheets of paper
- Collect exercise books or sheets at the due date
- Mark assignments by hand
- Record scores in a mark book
- Return books/sheets with corrections
- Parents have no visibility into assignments unless the child tells them

**Platform automation:**

- Teacher creates a digital assignment: title, instructions, due date, maximum marks
- Parents receive a WhatsApp notification when an assignment is posted
- Teacher records submission status per student (submitted / not submitted)
- Teacher enters scores after marking
- Parents see the assignment, score, and any teacher feedback
- Overdue assignment alert: parent notified if their child hasn't submitted

**Features to build:**

- [ ] Assignment creator (title, description, due date, max marks, attach a file)
- [ ] Student submission tracker (submitted / not submitted / late per student)
- [ ] Score entry per student after marking
- [ ] Teacher feedback text box per student
- [ ] Parent notification on assignment posted
- [ ] Parent notification if child did not submit by deadline
- [ ] Assignment history per class (archive of all past assignments)
- [ ] Student performance on assignments visible on parent portal

---

## 7. Parent Communication

**What teachers do manually today:**

- Call parents on their personal phone to report behavior or academic issues
- Send notes home with students (notes are often lost or not delivered)
- Rely on parents coming to school for PTAs (many don't show up)
- No record of what was discussed

**Platform automation:**

- In-app messaging: teacher sends a message to a specific parent about a specific child
- Full conversation history saved — both sides can refer back to it
- Teacher sends from their portal; parent receives in their portal + WhatsApp notification
- All conversations scoped to a specific child — no ambiguity
- School admin can view conversations for safeguarding (read-only)

**Features to build:**

- [ ] Parent messaging inbox (unified, scoped per school)
- [ ] New conversation: select student → select parent → compose message
- [ ] Reply thread view
- [ ] File attachment support (send a photo of classwork, a note)
- [ ] Read receipts
- [ ] Unread message badge on nav
- [ ] Message search

---

## 8. Class Broadcast / Announcements

**What teachers do manually today:**

- Write notices on the board and ask students to copy them into their notebooks for parents
- Call parents via class WhatsApp group (if one exists) — no tracking of who read it
- Some schools send circulars home with students — many are lost

**Platform automation:**

- Teacher sends a broadcast to all parents in their class from the portal
- Message delivered via WhatsApp + in-app notification to every parent
- Delivery tracking: system shows how many parents received and read the message
- Scheduled broadcasts: teacher writes the message today, sets it to send at 6 PM

**Features to build:**

- [ ] Class broadcast composer (title + body)
- [ ] Schedule send (send now or pick a date/time)
- [ ] Delivery stats: sent / delivered / read counts
- [ ] Broadcast history (archive of all sent broadcasts)
- [ ] Target by group: send to all parents, or just parents of students who scored below a threshold

---

## 9. Timetable

**What teachers do manually today:**

- Refer to a printed timetable pinned to the staffroom wall
- Timetable changes are communicated verbally or via handwritten note

**Platform automation:**

- Teacher sees their personal timetable: day × period × class × subject
- Timetable set by admin; teacher is notified when it changes
- "What's next?" view: shows the teacher's next class in plain language
- Substitute teacher: if a teacher is absent, admin can assign a substitute and that teacher's timetable updates

**Features to build:**

- [ ] Personal timetable view (weekly grid)
- [ ] Today's schedule view (simplified linear list)
- [ ] Timetable change notification
- [ ] Substitute assignment (admin-managed, teacher notified)

---

## 10. Student Behavior & Discipline Records

**What teachers do manually today:**

- Report behavioral incidents verbally to the vice principal
- Write in a punishment book
- No formal tracking — patterns are hard to spot
- Parents are called only after things escalate

**Platform automation:**

- Teacher logs a behavioral incident: student, type (disruptive / absent without permission / fighting / etc.), description, action taken
- Incident log is visible to the class teacher, VP, and principal — not parents by default
- Patterns are surfaced: "Chukwuemeka has had 4 incidents this term"
- Parent notification option: teacher chooses whether to notify the parent immediately or flag for VP to handle
- VP can escalate to a formal suspension record

**Features to build:**

- [ ] Incident logger: student, date, type, description, action taken
- [ ] Incident history per student (visible to teacher, VP, principal)
- [ ] Pattern alert: flag if a student exceeds a threshold (configurable)
- [ ] Notify parent toggle (immediate WhatsApp to parent, or internal only)
- [ ] Suspension record (logged by VP/principal after escalation)

---

## 11. Invigilation & Exam Duties

**What teachers do manually today:**

- Receive an invigilation schedule on a printed sheet
- Sign to confirm they received scripts
- Count and verify scripts before and after the exam
- Report any malpractice incidents in writing to the exam coordinator

**Platform automation:**

- Invigilation schedule posted digitally — teacher sees their assigned hall, date, time
- Script count entry: teacher logs how many scripts collected at end of exam
- Malpractice report: structured digital form (student, incident type, witnesses, description)
- All invigilation records stored and searchable by admin

**Features to build:**

- [ ] Invigilation schedule (admin creates, teacher sees their assignments)
- [ ] Script count confirmation per exam session
- [ ] Malpractice incident report form
- [ ] Invigilation history

---

## 12. Textbook & Material Tracking

**What teachers do manually today:**

- Distribute textbooks to students at start of term from a physical list
- Collect signatures or tick names on a sheet
- Chase students for unreturned books at end of term
- Request supplies (chalk, marker, exercise books) by writing a note to admin

**Platform automation:**

- Digital distribution log: teacher marks which students received which textbook
- End-of-term return tracker: shows who has returned / not returned
- Material request: teacher submits a request for supplies directly from the portal; admin sees all pending requests in one place

**Features to build:**

- [ ] Textbook distribution log (student checklist per book title)
- [ ] Return tracker at end of term (outstanding items highlighted)
- [ ] Supply request form (item, quantity, reason, urgency)
- [ ] Request status tracking: pending / approved / delivered

---

## 13. Staff Meeting & Professional Records

**What teachers do manually today:**

- Attend staff meetings, sign an attendance register
- Receive meeting minutes on paper (often weeks late)
- Keep a manual CPD (Continuous Professional Development) record for inspections
- No central record of training attended

**Platform automation:**

- Staff meeting: admin publishes agenda, teachers confirm attendance digitally
- Minutes published after the meeting — every teacher gets a notification
- CPD log: teacher records training, workshops, certifications attended
- Automatically included in teacher's professional profile for any school that views it

**Features to build:**

- [ ] Staff meeting invite (admin creates, teachers accept/note attendance)
- [ ] Meeting minutes publication (admin uploads, all staff notified)
- [ ] CPD log (teacher self-records: training title, organiser, date, certificate upload)
- [ ] CPD summary on professional profile

---

## 14. Professional Profile & Career

**What teachers do manually today:**

- Write a new CV for every school application
- Explain employment history in interviews verbally — no verified record
- Qualifications are on paper certificates that can be lost

**Platform automation:**

- Teacher's profile is their living professional record
- Schools that invite a teacher can preview their verified profile before sending an invite
- Employment history is built automatically as they join and leave schools on the platform
- Qualification uploads stored permanently — never lost

**Features to build:**

- [ ] Profile editor: name, photo, bio, subjects, years of experience
- [ ] Qualification upload (upload certificate, system stores it, shows on profile)
- [ ] Employment history timeline (auto-built from `school_staff` joins and resignations)
- [ ] Profile visibility setting: public to schools on platform / private
- [ ] School can preview profile before sending an invite

---

## 15. Notifications & Reminders

Every manual chase is a notification the system sends instead:

| Trigger                             | Notification                                                      |
| ----------------------------------- | ----------------------------------------------------------------- |
| Attendance not taken by 9 AM        | "You haven't taken attendance for JSS2A today"                    |
| Score deadline in 3 days            | "CA scores for English due in 3 days — 12 of 32 students entered" |
| Lesson note not submitted           | "Your lesson note for next week is due tomorrow"                  |
| New parent message                  | "Mrs. Okafor sent you a message about Emeka"                      |
| HOD returns exam question           | "Your Biology exam paper was returned with 2 comments"            |
| School publishes results            | "Term 1 results have been published"                              |
| New school invite                   | "Sunrise Academy has invited you to join as Class Teacher, JSS1"  |
| Student behavior pattern            | "Daniel has been marked late 5 times this term"                   |
| Assignment not submitted by student | Flagged in teacher's dashboard                                    |

---

## Feature Priority (Build Order)

### Phase 1 — Core (Sprint 8b)

Teacher registration, professional profile, school invite/resign flow, context switcher

### Phase 2 — Daily Workflow (Sprint 9 extension)

Attendance, score entry, comments, behavioral ratings, timetable

### Phase 3 — Communication (Sprint 9b)

Parent messaging, class broadcast, notifications

### Phase 4 — Exam & Academic (Sprint 10b)

Exam question setting, question bank, HOD approval flow, assignment management

### Phase 5 — Administration (Post-MVP)

Lesson planning, scheme of work, invigilation scheduling, textbook tracking, material requests, staff meeting records, CPD log

---

## What This Replaces (Manual Tools Teachers Currently Use)

| Manual tool today                   | Platform feature                        |
| ----------------------------------- | --------------------------------------- |
| Register book                       | Digital attendance                      |
| Mark book / Excel                   | Score entry grid                        |
| Printed report card                 | Auto-generated PDF report               |
| Word doc lesson notes               | Lesson note editor + approval flow      |
| Physical exam paper submission      | Digital question setting + HOD review   |
| Personal phone calls to parents     | In-app messaging + WhatsApp             |
| Class WhatsApp group (untracked)    | Class broadcast with delivery tracking  |
| Punishment book                     | Behavior incident log                   |
| Printed timetable on staffroom wall | Personal digital timetable              |
| Paper CPD records                   | Digital CPD log on professional profile |
| Written material requests           | Supply request form                     |
| Textbook distribution sheet         | Digital distribution + return tracker   |

---

_Last updated: 2026-06-12_

Invoices — bursar core workflow, needs student invoice list with payment status
Timetable — teachers need their weekly schedule

Scores — unclear if this is separate from Grades or the same thing under a different name

Staff onboarding — when a school admin invites a teacher (via the school's Staff tab), how does that person receive the invite, create an account, and get linked to the school? The registration page exists at /staff/register but the flow connecting invite → account creation → school link isn't built
Notification/alerts — e.g. "You haven't checked in today" banner, upcoming exam reminders
The most impactful things to build next (in order):

Invoices — bursar's second core page after Fee Management
Students — registrar needs this alongside Admissions
Staff onboarding flow — without this the whole invite system has a dead end
Timetable — teachers check this daily
