import { MOCK_NOTIFICATIONS } from "@/src/lib/api/mock/data";

const typeIcon: Record<string, string> = {
  fee_reminder: "💰",
  payment_confirmation: "✅",
  result_released: "📊",
  school_announcement: "📢",
  attendance_alert: "⚠️",
  application_update: "📋",
  urgent_alert: "🚨",
  teacher_message: "💬",
};

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-border-default px-4 pt-10 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-dark-blue">
            Notifications
          </h1>
          <button className="text-xs text-brand-green font-medium">
            Mark all read
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {MOCK_NOTIFICATIONS.map((notif) => (
          <div
            key={notif.id}
            className={`rounded-xl bg-white border p-4 ${
              notif.status !== "read"
                ? "border-brand-green/20 bg-blue-50/30"
                : "border-border-default"
            }`}
          >
            <div className="flex gap-3">
              <span className="text-xl">{typeIcon[notif.type] ?? "🔔"}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-dark-blue">
                  {notif.title}
                </p>
                <p className="mt-0.5 text-xs text-grey-text">{notif.body}</p>
                <p className="mt-1 text-[10px] text-grey-text">
                  {new Date(notif.createdAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {notif.status !== "read" && (
                <div className="mt-1 h-2 w-2 rounded-full bg-brand-green" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
