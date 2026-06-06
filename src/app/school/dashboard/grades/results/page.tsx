import PageHeader from "@/src/shared/PageHeader";
import InProgress from "@/src/shared/InProgress";

export default function PublishResultsPage() {
  return (
    <div>
      <PageHeader
        title="Publish Results"
        subtitle="Review, preview, and publish end-of-term results to parents."
      />
      <InProgress
        title="Results publishing is coming"
        subtitle="Review the full class result sheet, preview individual PDF report cards, then publish. Parents are notified via WhatsApp the moment you publish."
        features={[
          "Full class result preview before publishing",
          "Top 3 students and at-risk students highlighted",
          "Preview individual PDF report card per student",
          "Enter teacher and principal comments before publishing",
          "Rate students on affective and psychomotor domains",
          "One-click publish — all parents notified via WhatsApp",
        ]}
      />
    </div>
  );
}
