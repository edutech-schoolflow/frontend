# Grades, CA Scores & Results — Feature Plan

This document captures the full design discussion and decisions for the Grades & Results feature (Sprint 9). It expands on the high-level sprint plan with the specific decisions that affect how the feature is built.

---

## What This Feature Covers

The Grades & Results section covers the full academic scoring lifecycle:

1. **Setup** — subjects per class, grading scale, CA structure, teacher assignments
2. **CA Score Entry** — teachers enter continuous assessment scores mid-term
3. **Mid-term Publication** (optional) — school shares CA scores with parents early
4. **Exam Score Entry** — teachers enter end-of-term exam scores
5. **Auto-calculation** — system computes totals, grades, and positions automatically
6. **Comments & Ratings** — teacher and principal comments, affective and psychomotor ratings
7. **Results Review** — admin/principal reviews before publishing
8. **Publication** — school publishes; parents are notified via WhatsApp and in-app
9. **PDF Report Card** — generated automatically; parent downloads or shares
10. **Performance Trends** — term-over-term analysis visible to parents

---

## Decision 1 — CA Structure (Configurable, Not Fixed)

The current sprint plan assumes CA1 + CA2 only. This is too rigid. Nigerian schools use different CA breakdowns:

| School type        | Common CA structure                         |
| ------------------ | ------------------------------------------- |
| Nursery / Primary  | CA1 + CA2 = 40, Exam = 60                   |
| Secondary (some)   | CA1 + CA2 + CA3 = 30, Exam = 70             |
| Secondary (others) | Test + Assignment + Midterm = 40, Exam = 60 |
| Private schools    | Their own custom split                      |

**Decision: CA components are configurable per school.**

The school defines:

- How many CA components exist (1 to 4)
- The label for each (e.g. "CA1", "CA2", "Assignment", "Midterm Test")
- The max score for each component
- The max exam score

The system enforces that all components + exam score add up to 100. Teachers enter scores against the components the school configured — they never see a generic "CA1/CA2" if the school uses different names.

**Example configuration:**

```
Component 1: "First Test"      max: 15
Component 2: "Second Test"     max: 15
Component 3: "Assignment"      max: 10
Exam:         "Examination"    max: 60
Total:                               100
```

---

## Decision 2 — Who Enters Scores (Both Models Supported)

There are two models used in Nigerian schools:

**Class teacher model** (common in nursery/primary):

- One teacher is responsible for a class
- They teach all or most subjects
- They enter scores for all subjects for their class

**Subject teacher model** (common in secondary):

- A Maths teacher teaches Maths across multiple classes (e.g. JSS1A, JSS1B, JSS2A)
- They only enter Maths scores
- A different teacher handles English, another handles Physics, etc.

**Decision: Support both via a `teacher_subject_class` assignment table.**

A teacher is assigned to teach a specific subject in a specific class. The class teacher is a special assignment that grants access to all subjects for that class.

```
teacher_assignments
  id, school_id, staff_id, class_id, subject_id (nullable),
  role ENUM (class_teacher | subject_teacher)
```

- A `class_teacher` assignment: staff_id sees all subjects for class_id when entering scores
- A `subject_teacher` assignment: staff_id only sees subject_id for class_id

This means a single teacher can be the class teacher of JSS1A (sees all subjects) AND a subject teacher of Maths in JSS2B (sees only Maths for JSS2B).

---

## Decision 3 — Position (Both Subject-Level and Overall)

Nigerian report cards show two types of position:

1. **Subject position** — the student's rank within the class for a specific subject (e.g. "1st in Mathematics")
2. **Overall class position** — the student's rank across all subjects based on their cumulative total or average

**Decision: Calculate and display both.**

- Subject position: rank students in the class by their total score for that subject
- Overall position: rank students by their cumulative total across all subjects (or average)
- Ties: students with equal scores get the same position (e.g. two students both ranked 3rd; next position is 5th — no 4th)
- Report card shows:
  - Each subject row includes a "Position" column (e.g. 2nd out of 42)
  - Footer shows overall average, overall position, class size

---

## Decision 4 — Grading Scale (NERDC Default, School Can Override)

The national standard (NERDC) grading scale:

| Score Range | Grade | Remark    |
| ----------- | ----- | --------- |
| 70 – 100    | A     | Excellent |
| 60 – 69     | B     | Very Good |
| 50 – 59     | C     | Good      |
| 45 – 49     | D     | Fair      |
| 40 – 44     | E     | Pass      |
| 0 – 39      | F     | Fail      |

**Decision: NERDC scale ships as the default. Schools can override it in Settings.**

The grading system is stored as a configurable table per school. When the school is created, it is seeded with the NERDC default. The admin can edit the boundaries, grade letters, and remarks at any time. Changes apply to the next term only — published results are never retroactively recalculated.

---

## Decision 5 — Mid-term CA Publication (Optional)

There are two distinct publishing moments in a school term:

- **Mid-term**: school may want to share CA scores with parents before the exam (e.g. so parents can see where their child is struggling)
- **End of term**: full report card — CA + exam + position + comments + PDF

**Decision: Mid-term CA publication is optional.**

Schools that want to share CA scores early can publish a "CA release" — parents see a simplified view of their child's CA scores per subject, without exam scores or position. This is separate from the final report.

Schools that skip mid-term publication simply go straight to end-of-term publishing. Nothing breaks either way.

Two separate publish actions in the dashboard:

1. "Release CA Scores" (optional, mid-term) → parents see CA only
2. "Publish Results" (end of term, required) → parents see full report + PDF

---

## Decision 6 — Affective and Psychomotor Domains (Both, Properly Structured)

Standard Nigerian report cards have two trait sections, not one. The current sprint plan's "behavioral ratings (5-star)" is too vague and incorrect.

**Affective Domain** — character and behaviour:

- Punctuality
- Attentiveness
- Neatness / Tidiness
- Cooperation / Teamwork
- Politeness / Respect
- Leadership
- Honesty

**Psychomotor Domain** — physical and creative skills:

- Sports / Physical Education
- Drawing / Art & Craft
- Music
- Practical / Lab Work
- ICT / Computer Skills
- Verbal / Oral Expression

**Decision: Both sections are included. Each trait is rated on a 5-point scale: Excellent / Very Good / Good / Fair / Poor.**

These are entered by the class teacher. Schools can turn off traits they do not assess (e.g. a nursery school may not assess "Lab Work"). The system ships with the full list as defaults; the school admin can deactivate traits they do not use.

Data model:

```
report_trait_ratings
  id, enrollment_id, term_id, domain ENUM (affective | psychomotor),
  trait VARCHAR, rating ENUM (excellent | very_good | good | fair | poor),
  entered_by UUID (staff_id)
```

---

## Decision 7 — Report Card Format (Full Nigerian Standard)

The PDF report card follows the standard Nigerian school report card format:

### Sections in order:

**1. School Header**

- School logo (uploaded during onboarding)
- School name (bold, large)
- School address, phone, email
- School motto (if set)
- "Academic Report — [Term] [Academic Year]"

**2. Student Information**

- Full name, admission number
- Class, date of birth, gender
- Days school opened | Days present | Days absent | Attendance %

**3. Scores Table**

| Subject          | 1st Test | 2nd Test | Assignment | Exam | Total | Grade | Remark    | Position |
| ---------------- | -------- | -------- | ---------- | ---- | ----- | ----- | --------- | -------- |
| Mathematics      | 14       | 13       | 9          | 55   | 91    | A     | Excellent | 2nd      |
| English Language | 12       | 11       | 8          | 50   | 81    | A     | Excellent | 5th      |
| ...              |          |          |            |      |       |       |           |          |

(Column headers match the CA component names the school configured)

**4. Summary Row**

- Cumulative Total | Overall Average | Class Position | Number in Class

**5. Affective Domain Ratings**
| Trait | Rating |
|---|---|
| Punctuality | Excellent |
| Attentiveness | Very Good |
| ... | |

**6. Psychomotor Domain Ratings**
| Trait | Rating |
|---|---|
| Sports | Good |
| Drawing / Art | Very Good |
| ... | |

**7. Class Teacher's Comment**
Free text. Entered per student. Signed with teacher's name.

**8. Principal's Comment**
Free text. Restricted to principal role. Signed with name and date.

**9. Next Term Information**

- Next term resumption date
- Current term closing date
- Fees due next term (if configured)

**10. Verification Footer**

- QR code linking to a public result verification page
- School stamp placeholder
- "Generated by Oneschoolplatform"

---

## Score Entry Workflow (Step by Step)

### Setup (done once per term, by admin)

1. Admin confirms subjects per class are correct (add/remove if needed)
2. Admin confirms CA structure for the term (components + max scores)
3. Admin confirms grading scale (or leaves as default)
4. Admin assigns class teachers and subject teachers for the term

### Mid-term (CA entry)

1. Teacher logs in → goes to Grades → Enter CA Scores
2. Selects their class (or class + subject if subject teacher)
3. Sees a table: student rows × CA component columns
4. Enters scores, system validates in real-time (cannot exceed max)
5. Saves — scores are stored as draft
6. Admin reviews (optional) and clicks "Release CA Scores" if sharing mid-term

### End of term (Exam entry)

1. Teacher goes to Grades → Enter Exam Scores
2. Same class/subject selector
3. Table now shows CA totals as read-only + exam score input
4. Enters exam scores; system auto-calculates total and grade
5. Saves

### Comments & Ratings

1. Teacher goes to Grades → Comments & Ratings
2. Sees all students in their class
3. Enters free-text comment per student
4. Rates each student on affective and psychomotor traits
5. Principal enters principal's comment (separate, role-restricted)

### Publishing

1. Admin goes to Grades → Publish Results
2. Selects class and term
3. Sees a preview table: all students, all totals, positions, averages
4. Can see: top 3 highlighted, students below pass mark highlighted
5. Can preview individual PDF per student before publishing
6. Clicks "Publish" → confirmation modal
7. System sends WhatsApp + in-app notification to all parents in that class
8. Parents can now view results and download PDF

---

## Score Locking Rules

1. CA scores can be edited freely until "Release CA Scores" is clicked
2. After CA release, CA scores are locked — teacher must contact admin to unlock for corrections
3. Exam scores can be edited freely until "Publish Results" is clicked
4. After results are published, all scores are locked permanently
5. Admin can unlock a published result for a specific student (emergency correction) — this action is logged in the audit trail
6. Re-publishing after an unlock sends the parent a new notification: "Your child's result has been updated"

---

## Data Model (Expanded)

```
subjects
  id, school_id, name, class_id, is_active BOOL

ca_config
  id, school_id, term_id
  component_1_label, component_1_max
  component_2_label, component_2_max (nullable)
  component_3_label, component_3_max (nullable)
  component_4_label, component_4_max (nullable)
  exam_max (always set, remainder to make total 100)

grading_scale
  id, school_id, min_score, max_score, grade, remark

teacher_assignments
  id, school_id, staff_id, class_id, subject_id (nullable),
  role ENUM (class_teacher | subject_teacher), term_id

grades
  id, enrollment_id, subject_id, term_id
  component_1, component_2, component_3, component_4 (nullable)
  ca_total (generated), exam_score
  total (generated), grade (derived), remark (derived)
  subject_position INT, ca_released_at, exam_locked_at

reports
  id, enrollment_id, term_id
  overall_total, overall_average, class_position, class_size
  teacher_comment, principal_comment
  status ENUM (draft | ca_released | published)
  published_at, pdf_url

report_trait_ratings
  id, enrollment_id, term_id
  domain ENUM (affective | psychomotor)
  trait VARCHAR, rating ENUM (excellent | very_good | good | fair | poor)
```

---

## Sidebar Navigation (Updated)

The current sidebar has three links under Grades & Results:

- Enter CA Scores
- Enter Exam Scores
- Publish Results

Recommended expansion:

- **Enter CA Scores** — score entry grid (CA components per subject)
- **Enter Exam Scores** — exam score entry (shows CA total as read-only)
- **Comments & Ratings** — free-text comments + affective/psychomotor ratings per student
- **Publish Results** — review table, preview PDFs, publish button

Subject and CA configuration lives under **Settings**, not the Grades section.

---

_Last updated: 2026-06-06_

Based on exactly what you're building, here are the most relevant platforms to study — each for a specific reason:

Nigerian/African context (closest to your market)

Classeek — Nigerian school management platform. Study how they handle the Nigerian school admin's workflow. Look at their onboarding and fee collection flow.
SchoolAdmin — another Nigerian platform. Good for understanding what Nigerian schools expect from a UI.
Remita — not a school platform but widely used for school fee collection in Nigeria. Understand why schools already trust it — then know what you're replacing.
India context (same infrastructure challenges as Nigeria)

Teachmint — the closest comparison to what you're building. India has the same realities: budget Android phones, slow internet, non-tech teachers. Their parent app and score entry flow are very worth studying.
Classplus — strong on the teacher/content side. Good UX reference for score entry and class management.
US platforms (best-in-class UX for specific features)

Brightwheel — the best parent communication + fee collection experience for schools globally. Their daily report cards, payment flow, and parent notification design are exceptional. Study every screen.
ClassDojo — the gold standard for parent-teacher engagement. Their notification design and behaviour tracking are worth copying exactly for your parent portal.
For your landing page and SaaS design

Bumpa — already using this. Continue.
Paystack — their dashboard and landing page are some of the best Nigerian SaaS design you'll find. Lots to borrow.
Linear — study their app UI for your school dashboard. Clean tables, sidebars, modals.
Priority order for your time:

Brightwheel — spend the most time here. Sign up for the free trial if you can. It's the closest to your full feature set.
Teachmint — for the Nigerian/Indian market context.
Paystack dashboard — for how a Nigerian fintech does a clean admin UI.
ClassDojo — specifically for the parent-facing notification and communication screens.
