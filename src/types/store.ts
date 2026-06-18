export type StoreCategory =
  | "uniform"
  | "book"
  | "stationery"
  | "equipment"
  | "other";

export interface StoreItem {
  id: string;
  schoolId: string;
  name: string;
  description: string;
  category: StoreCategory;
  price: number; // naira
  unit: string; // "piece", "pair", "set", "copy"
  emoji: string;
  stock: number | null; // null = unlimited
  isActive: boolean;
  createdAt: string;
  sizes?: string[]; // available sizes, e.g. ["XS","S","M","L","XL","XXL"]
}

export interface CartLine {
  storeItem: StoreItem;
  studentId: string;
  studentName: string;
  schoolId: string;
  schoolName: string;
  quantity: number;
  selectedSize?: string;
}

export type AssignmentStatus = "pending" | "invoiced" | "paid";

export interface MaterialAssignment {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  storeItemId: string;
  storeItemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  assignedBy: string;
  assignedAt: string;
  note?: string;
  status: AssignmentStatus;
}
