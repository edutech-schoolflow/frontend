import InProgress from "@/src/shared/InProgress";

export default function TeacherTimetablePage() {
  return (
    <div className="p-[30px]">
      <InProgress
        title="Timetable"
        subtitle="Your personal teaching schedule — updated automatically when admin makes changes."
        features={[
          "Weekly grid: day × period × class × subject",
          "Today's schedule in a simplified list view",
          "Notification when your timetable changes",
          "Substitute assignment visibility",
        ]}
      />
    </div>
  );
}
