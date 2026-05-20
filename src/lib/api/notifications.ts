import { mockResponse } from "./mockClient";
import { MOCK_NOTIFICATIONS } from "./mock/data";
import type { NotificationPreferences } from "@/src/types/notification";

export const getNotifications = async (_params?: { page?: number; limit?: number }) =>
  mockResponse({
    data: MOCK_NOTIFICATIONS,
    total: MOCK_NOTIFICATIONS.length,
    unread: MOCK_NOTIFICATIONS.filter((n) => n.status !== "read").length,
  });

export const markRead = async (_id: string) =>
  mockResponse({ message: "Marked as read." });

export const markAllRead = async () =>
  mockResponse({ message: "All notifications marked as read." });

const DEFAULT_PREFS: NotificationPreferences = {
  feeReminders: { whatsapp: true, email: true, sms: true },
  paymentConfirmations: { whatsapp: true, email: true, sms: false },
  resultReleases: { whatsapp: true, email: true, sms: false },
  schoolAnnouncements: { whatsapp: true, email: false, sms: false },
  attendanceAlerts: { whatsapp: true, email: false, sms: false },
  teacherMessages: { whatsapp: true, email: true, sms: false },
  frequency: "realtime",
  quietHoursEnabled: true,
};

export const getPreferences = async (): Promise<NotificationPreferences> =>
  mockResponse(DEFAULT_PREFS);

export const savePreferences = async (prefs: NotificationPreferences) =>
  mockResponse(prefs);
