import InProgress from "@/src/shared/InProgress";

export default function TeacherScoresPage() {
  return (
    <div className="p-[30px]">
      <InProgress
        title="Score Entry"
        subtitle="Enter CA and exam scores for your students. Totals, grades, and class positions are calculated automatically."
        features={[
          "CA score grid per class and subject",
          "Exam score entry with auto-total",
          "Automatic grade and position calculation",
          "Score validation — cannot exceed maximum",
          "Submission deadline enforcement",
          "Preview report card before submitting",
        ]}
      />
    </div>
  );
}
