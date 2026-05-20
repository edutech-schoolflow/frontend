export type NotificationType =
  | "fee_reminder"
  | "payment_confirmation"
  | "result_released"
  | "school_announcement"
  | "attendance_alert"
  | "application_update"
  | "urgent_alert"
  | "teacher_message";

export type NotificationChannel = "whatsapp" | "in_app" | "email" | "sms";
export type NotificationStatus = "sent" | "delivered" | "read";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  body: string;
  status: NotificationStatus;
  actionUrl?: string;
  readAt?: string;
  createdAt: string;
}

export interface ChannelPreference {
  whatsapp: boolean;
  email: boolean;
  sms: boolean;
}

export interface NotificationPreferences {
  feeReminders: ChannelPreference;
  paymentConfirmations: ChannelPreference;
  resultReleases: ChannelPreference;
  schoolAnnouncements: ChannelPreference;
  attendanceAlerts: ChannelPreference;
  teacherMessages: ChannelPreference;
  frequency: "realtime" | "daily_digest" | "weekly_digest";
  quietHoursEnabled: boolean;
}
