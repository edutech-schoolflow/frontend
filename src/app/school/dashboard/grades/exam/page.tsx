import PageHeader from "@/src/shared/PageHeader";
import InProgress from "@/src/shared/InProgress";

export default function EnterExamScoresPage() {
  return (
    <div>
      <PageHeader
        title="Enter Exam Scores"
        subtitle="Record end-of-term examination scores for each subject and class."
      />
      <InProgress
        title="Exam score entry is coming"
        subtitle="Enter exam scores alongside locked CA totals. The system auto-calculates each student's total, grade, and position in class."
        features={[
          "CA totals shown as read-only alongside exam score input",
          "Auto-calculates total score, grade, and class position",
          "Handles tied positions correctly",
          "Highlights students below the passing threshold",
          "Scores locked once results are published",
        ]}
      />
    </div>
  );
}
