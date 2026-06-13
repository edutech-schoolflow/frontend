import InProgress from "@/src/shared/InProgress";

export default function TeacherSettingsPage() {
  return (
    <div className="p-[30px]">
      <InProgress
        title="Settings"
        subtitle="Manage your account, password, and notification preferences."
        features={[
          "Update email and phone number",
          "Change password",
          "Notification preferences: email, WhatsApp, in-app",
          "Delete account",
        ]}
      />
    </div>
  );
}
