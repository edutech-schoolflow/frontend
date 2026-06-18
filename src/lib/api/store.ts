import { MOCK_STORE_ITEMS, MOCK_MATERIAL_ASSIGNMENTS } from "./mock/storeData";
import { MOCK_STUDENTS, MOCK_CLASSES } from "./mock/schoolData";
import {
  MOCK_PARENT_CHILDREN,
  MOCK_PARENT_FEE_INVOICES,
  MOCK_PARENT_FEE_SUMMARIES,
} from "./mock/parentData";
import type {
  StoreItem,
  MaterialAssignment,
  StoreCategory,
} from "@/src/types/store";
import type { ParentChild } from "@/src/types/parent";

const delay = () => new Promise((r) => setTimeout(r, 400));

// ── Invoice injection ──────────────────────────────────────────────────────────
// Injects store purchase lines into the parent-facing invoice so the parent
// sees one unified bill. The `source: "store"` marker lets the school separate
// store revenue from regular fees on their side.

function injectStoreLineIntoInvoice(
  studentId: string,
  item: StoreItem,
  quantity: number,
  feeTypeId: string
) {
  const invoice = MOCK_PARENT_FEE_INVOICES[studentId];
  if (!invoice) return;

  const amount = item.price * quantity;

  // Guard: don't double-inject on re-renders / hot reload
  if (invoice.lines.some((l) => l.feeTypeId === feeTypeId)) return;

  invoice.lines.push({
    feeTypeId,
    feeTypeName: item.name,
    amount,
    paid: 0,
    balance: amount,
    status: "unpaid",
    source: "store",
  });

  invoice.totalAmount += amount;
  invoice.balance += amount;
  if (invoice.status === "paid") invoice.status = "partial";

  // Keep the parent fee summary in sync so the home widget shows updated total
  const summary = MOCK_PARENT_FEE_SUMMARIES.find(
    (s) => s.studentId === studentId
  );
  if (summary) summary.outstandingFees += amount;
}

// ── Store items ────────────────────────────────────────────────────────────────

export async function getStoreItems(): Promise<StoreItem[]> {
  await delay();
  return [...MOCK_STORE_ITEMS];
}

export async function createStoreItem(
  data: Omit<StoreItem, "id" | "createdAt">
): Promise<StoreItem> {
  await delay();
  const item: StoreItem = {
    ...data,
    id: `item-${String(MOCK_STORE_ITEMS.length + 1).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
  };
  MOCK_STORE_ITEMS.push(item);
  return item;
}

export async function updateStoreItem(
  id: string,
  patch: Partial<Omit<StoreItem, "id" | "createdAt">>
): Promise<StoreItem> {
  await delay();
  const idx = MOCK_STORE_ITEMS.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error("Item not found");
  Object.assign(MOCK_STORE_ITEMS[idx], patch);
  return { ...MOCK_STORE_ITEMS[idx] };
}

// ── Assignment helpers ─────────────────────────────────────────────────────────

export interface AssignTarget {
  scope: "individual" | "class" | "all";
  studentId?: string;
  classId?: string;
}

export async function assignItemToStudents(params: {
  item: StoreItem;
  target: AssignTarget;
  quantity: number;
  note?: string;
  assignedBy: string;
}): Promise<MaterialAssignment[]> {
  await delay();

  const { item, target, quantity, note, assignedBy } = params;

  let studentIds: string[] = [];

  if (target.scope === "individual" && target.studentId) {
    studentIds = [target.studentId];
  } else if (target.scope === "class" && target.classId) {
    studentIds = MOCK_STUDENTS.filter(
      (s) => s.classId === target.classId && s.schoolId === item.schoolId
    ).map((s) => s.id);
  } else if (target.scope === "all") {
    studentIds = MOCK_STUDENTS.filter((s) => s.schoolId === item.schoolId).map(
      (s) => s.id
    );
  }

  const newAssignments: MaterialAssignment[] = studentIds.map(
    (studentId, i) => {
      const student = MOCK_STUDENTS.find((s) => s.id === studentId);
      const feeTypeId = `store-${item.id}-asgn-${Date.now()}-${i}`;
      const assignment: MaterialAssignment = {
        id: `asgn-${Date.now()}-${i}`,
        schoolId: item.schoolId,
        studentId,
        studentName: student
          ? `${student.firstName} ${student.lastName}`
          : studentId,
        storeItemId: item.id,
        storeItemName: item.name,
        quantity,
        unitPrice: item.price,
        totalPrice: item.price * quantity,
        assignedBy,
        assignedAt: new Date().toISOString(),
        note,
        status: "invoiced",
      };
      MOCK_MATERIAL_ASSIGNMENTS.push(assignment);
      injectStoreLineIntoInvoice(studentId, item, quantity, feeTypeId);
      return assignment;
    }
  );

  return newAssignments;
}

export async function getMaterialAssignments(): Promise<MaterialAssignment[]> {
  await delay();
  return [...MOCK_MATERIAL_ASSIGNMENTS].sort(
    (a, b) =>
      new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime()
  );
}

// ── Reference data for assignment modal ───────────────────────────────────────

export interface ClassOption {
  id: string;
  name: string;
  studentCount: number;
}

export interface StudentOption {
  id: string;
  name: string;
  className: string;
  photoUrl?: string;
}

export async function getClassOptions(): Promise<ClassOption[]> {
  await delay();
  return MOCK_CLASSES.map((cls) => ({
    id: cls.id,
    name: cls.name,
    studentCount: MOCK_STUDENTS.filter((s) => s.classId === cls.id).length,
  }));
}

export async function getStudentOptions(): Promise<StudentOption[]> {
  await delay();
  return MOCK_STUDENTS.map((s) => {
    const cls = MOCK_CLASSES.find((c) => c.id === s.classId);
    return {
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      className: cls?.name ?? "Unknown class",
      photoUrl: s.photoUrl,
    };
  });
}

export function getAssignmentPreview(
  target: AssignTarget,
  classes: ClassOption[],
  students: StudentOption[]
): StudentOption[] {
  if (target.scope === "individual" && target.studentId) {
    return students.filter((s) => s.id === target.studentId);
  }
  if (target.scope === "class" && target.classId) {
    return students.filter((s) => {
      const cls = classes.find((c) => c.id === target.classId);
      return s.className === cls?.name;
    });
  }
  if (target.scope === "all") return students;
  return [];
}

// ── Parent-facing API ─────────────────────────────────────────────────────────

export async function getStoreItemsForSchool(
  schoolId: string
): Promise<StoreItem[]> {
  await delay();
  return MOCK_STORE_ITEMS.filter((i) => i.schoolId === schoolId && i.isActive);
}

export async function getParentChildren(): Promise<ParentChild[]> {
  await delay();
  return [...MOCK_PARENT_CHILDREN];
}

export interface ParentCartLine {
  storeItem: StoreItem;
  studentId: string;
  studentName: string;
  schoolId: string;
  schoolName: string;
  quantity: number;
}

export async function parentPurchaseItems(
  lines: ParentCartLine[]
): Promise<void> {
  await delay();
  for (const line of lines) {
    const feeTypeId = `store-${line.storeItem.id}-par-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const assignment: MaterialAssignment = {
      id: `asgn-par-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      schoolId: line.schoolId,
      studentId: line.studentId,
      studentName: line.studentName,
      storeItemId: line.storeItem.id,
      storeItemName: line.storeItem.name,
      quantity: line.quantity,
      unitPrice: line.storeItem.price,
      totalPrice: line.storeItem.price * line.quantity,
      assignedBy: "parent",
      assignedAt: new Date().toISOString(),
      status: "invoiced",
    };
    MOCK_MATERIAL_ASSIGNMENTS.push(assignment);
    injectStoreLineIntoInvoice(
      line.studentId,
      line.storeItem,
      line.quantity,
      feeTypeId
    );
  }
}

// ── Formatting helpers ─────────────────────────────────────────────────────────

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export const CATEGORY_META: Record<
  StoreCategory,
  { label: string; bg: string; text: string }
> = {
  uniform: { label: "Uniform", bg: "bg-[#eff6ff]", text: "text-[#2563eb]" },
  book: { label: "Book", bg: "bg-[#fffbeb]", text: "text-[#b45309]" },
  stationery: {
    label: "Stationery",
    bg: "bg-[#f0fdf4]",
    text: "text-[#16a34a]",
  },
  equipment: { label: "Equipment", bg: "bg-[#faf5ff]", text: "text-[#7c3aed]" },
  other: { label: "Other", bg: "bg-[#f3f4f6]", text: "text-[#6b7280]" },
};

export const STORE_CATEGORIES: StoreCategory[] = [
  "uniform",
  "book",
  "stationery",
  "equipment",
  "other",
];
