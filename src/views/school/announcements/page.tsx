import PageHeader from "@/src/shared/PageHeader";
import InProgress from "@/src/shared/InProgress";

export default function AnnouncementsPage() {
  return (
    <div>
      <PageHeader
        title="Announcements"
        subtitle="Broadcast messages to parents, students, or staff."
      />
      <InProgress
        title="Announcements are coming"
        subtitle="Compose and send school-wide or class-targeted announcements. Messages are delivered via WhatsApp, in-app, and email. See delivery stats in real time."
        features={[
          "Compose announcements with title and body",
          "Target: all parents, specific class, or all staff",
          "Deliver via WhatsApp, in-app notification, and email",
          "View sent, delivered, and read counts per announcement",
          "Schedule an announcement for a future date and time",
        ]}
      />
    </div>
  );
}
