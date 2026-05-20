import { mockResponse } from "./mockClient";
import { MOCK_PTA_INVITES } from "./mock/data";
import type { PtaStats } from "@/src/types/parent";

export const setPtaInviteLink = async (_inviteLink: string) =>
  mockResponse({ message: "PTA invite link saved." });

export const sendInviteAll = async () =>
  mockResponse({ message: "Invites sent to 3 uninvited parents." });

export const getPtaStatus = async (): Promise<PtaStats> =>
  mockResponse({
    total: 3,
    notInvited: 1,
    invited: 1,
    clicked: 0,
    inGroup: 1,
    leftGroup: 0,
  });

export const getPtaInvites = async (_params?: { status?: string; page?: number; limit?: number }) =>
  mockResponse({ data: MOCK_PTA_INVITES, total: MOCK_PTA_INVITES.length });

export const updateInviteStatus = async (_parentId: string, status: "in_group" | "left_group") =>
  mockResponse({ message: `Status updated to ${status}.` });
