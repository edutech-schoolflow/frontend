import InProgress from "@/src/shared/InProgress";

export default function TeacherAssignmentsPage() {
  return (
    <div className="p-[30px]">
      <InProgress
        title="Assignments"
        subtitle="Create and manage assignments for your classes. Parents are notified when you post one."
        features={[
          "Create assignment with title, instructions, due date, and max marks",
          "Track submission status per student",
          "Enter marks after marking",
          "Add feedback per student",
          "Parent notified if child did not submit by deadline",
        ]}
      />
    </div>
  );
}
