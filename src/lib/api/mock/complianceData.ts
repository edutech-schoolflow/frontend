import type { ComplianceRecord } from "@/src/types/compliance";

export const MOCK_COMPLIANCE: ComplianceRecord[] = [
  // ── School ────────────────────────────────────────────────────────────────────
  {
    actorType: "school",
    actorId: "sch-001",
    steps: [
      {
        id: "school_profile",
        label: "School Profile",
        status: "not_started",
        required: true,
      },
      {
        id: "contact_setup",
        label: "Contact Setup",
        status: "not_started",
        required: true,
      },
      {
        id: "proprietor",
        label: "Proprietor / Owner",
        status: "not_started",
        required: true,
      },
      {
        id: "business_registration",
        label: "Business Registration",
        status: "not_started",
        required: true,
      },
      {
        id: "review",
        label: "Review & Submit",
        status: "not_started",
        required: true,
      },
    ],
    overallStatus: "incomplete",
    updatedAt: "2026-06-01T00:00:00Z",
  },

  // ── Teachers ──────────────────────────────────────────────────────────────────
  {
    actorType: "teacher",
    actorId: "usr-002",
    steps: [
      {
        id: "nin",
        label: "National ID (NIN)",
        status: "pending",
        required: true,
        data: { nin: "12345678901", submittedAt: "2026-06-10T09:00:00Z" },
      },
    ],
    overallStatus: "pending",
    updatedAt: "2026-06-10T09:00:00Z",
  },
  {
    actorType: "teacher",
    actorId: "usr-003",
    steps: [
      {
        id: "nin",
        label: "National ID (NIN)",
        status: "verified",
        required: true,
        data: {
          nin: "98765432100",
          submittedAt: "2026-06-01T10:00:00Z",
          verifiedAt: "2026-06-02T08:00:00Z",
        },
      },
    ],
    overallStatus: "verified",
    updatedAt: "2026-06-02T08:00:00Z",
  },

  // ── Parents ───────────────────────────────────────────────────────────────────
  {
    actorType: "parent",
    actorId: "demo-user",
    steps: [
      {
        id: "nin",
        label: "National ID (NIN)",
        status: "not_started",
        required: true,
      },
    ],
    overallStatus: "incomplete",
    updatedAt: "2026-06-01T00:00:00Z",
  },
];
