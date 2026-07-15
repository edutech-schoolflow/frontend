import { apiGet, apiPost, apiPut, apiDelete } from "./client";

export type FeeCategory = "compulsory" | "optional";
export type FeeApprovalStatus = "pending_approval" | "approved" | "rejected";

export interface FeeType {
  id: string;
  name: string;
  amount: number;
  termId: string;
  category: FeeCategory;
  approvalStatus: FeeApprovalStatus;
  rejectionReason?: string | null;
  isActive: boolean;
  applicableClassIds: string[];
}

interface FeeTypeResponse {
  id: string;
  name: string;
  amount: number;
  termId: string;
  category: FeeCategory;
  approvalStatus: FeeApprovalStatus;
  rejectionReason?: string | null;
  isActive: boolean;
  applicableClassIds: string[];
}

function toFeeType(f: FeeTypeResponse): FeeType {
  return {
    id: f.id,
    name: f.name,
    amount: f.amount,
    termId: f.termId,
    category: f.category,
    approvalStatus: f.approvalStatus,
    rejectionReason: f.rejectionReason ?? null,
    isActive: f.isActive,
    applicableClassIds: f.applicableClassIds,
  };
}

// ── reads ─────────────────────────────────────────────────────────────────────

export interface ListFeeTypesParams {
  termId?: string;
  status?: FeeApprovalStatus;
  category?: FeeCategory;
}

export async function getFeeTypes(
  params: ListFeeTypesParams = {}
): Promise<FeeType[]> {
  const qs = new URLSearchParams();
  if (params.termId) qs.set("termId", params.termId);
  if (params.status) qs.set("status", params.status);
  if (params.category) qs.set("category", params.category);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  const { data } = await apiGet<FeeTypeResponse[]>(
    `/school/fee-types${suffix}`
  );
  return data.map(toFeeType);
}

// ── writes ────────────────────────────────────────────────────────────────────

export interface CreateFeeTypeInput {
  name: string;
  amount: number;
  termId: string;
  category: FeeCategory;
  classIds: string[];
}

export async function createFeeType(
  input: CreateFeeTypeInput
): Promise<FeeType> {
  const { data } = await apiPost<FeeTypeResponse>("/school/fee-types", {
    name: input.name,
    amount: input.amount,
    termId: input.termId,
    category: input.category,
    classIds: input.classIds,
  });
  return toFeeType(data);
}

export interface UpdateFeeTypeInput {
  name: string;
  amount: number;
  category: FeeCategory;
  classIds: string[];
}

export async function updateFeeType(
  id: string,
  input: UpdateFeeTypeInput
): Promise<FeeType> {
  const { data } = await apiPut<FeeTypeResponse>(`/school/fee-types/${id}`, {
    name: input.name,
    amount: input.amount,
    category: input.category,
    classIds: input.classIds,
  });
  return toFeeType(data);
}

/** Owner-only: approve a pending fee type (makes it visible to parents). */
export async function approveFeeType(id: string): Promise<FeeType> {
  const { data } = await apiPost<FeeTypeResponse>(
    `/school/fee-types/${id}/approve`,
    {}
  );
  return toFeeType(data);
}

/** Owner-only: reject a pending fee type with an optional reason. */
export async function rejectFeeType(
  id: string,
  reason?: string
): Promise<FeeType> {
  const { data } = await apiPost<FeeTypeResponse>(
    `/school/fee-types/${id}/reject`,
    { reason: reason?.trim() || null }
  );
  return toFeeType(data);
}

/** Hard-deletes a never-billed fee type; archives one already billed. Returns whether it was archived. */
export async function deleteFeeType(
  id: string
): Promise<{ archived: boolean }> {
  const { data } = await apiDelete<{ archived: boolean }>(
    `/school/fee-types/${id}`
  );
  return { archived: !!data?.archived };
}

// ── collections (bursar, payment-based) ─────────────────────────────────────────

export interface FeeCollectionLine {
  feeTypeId: string;
  name: string;
  category: FeeCategory;
  amount: number;
  expected: number; // amount × applicable/subscribed students
  collected: number; // Σ successful payments toward this fee
  outstanding: number; // max(0, expected − collected)
  payers: number; // distinct students who paid anything
  applicableCount: number; // compulsory: applicable students; optional: subscribers
}

export interface BursarCollections {
  totalExpected: number;
  totalCollected: number;
  totalOutstanding: number;
  byFee: FeeCollectionLine[];
}

export async function getCollections(
  termId: string
): Promise<BursarCollections> {
  const { data } = await apiGet<BursarCollections>(
    `/school/fees/collections?termId=${termId}`
  );
  return data;
}
