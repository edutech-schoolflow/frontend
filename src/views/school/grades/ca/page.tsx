import PageHeader from "@/src/shared/PageHeader";
import InProgress from "@/src/shared/InProgress";

export default function EnterCAScoresPage() {
  return (
    <div>
      <PageHeader
        title="Enter CA Scores"
        subtitle="Record continuous assessment scores for each subject and class."
      />
      <InProgress
        title="CA score entry is coming"
        subtitle="Teachers enter CA scores per subject per student. The system validates scores, calculates totals, and saves progress automatically."
        features={[
          "Select class and subject to enter scores",
          "Configurable CA components (CA1, CA2, Assignment, etc.)",
          "Real-time validation against maximum scores",
          "Auto-saves as you type",
          "Release CA scores to parents mid-term (optional)",
        ]}
      />
    </div>
  );
}
