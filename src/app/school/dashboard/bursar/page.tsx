import PageHeader from "@/src/shared/PageHeader";
import InProgress from "@/src/shared/InProgress";

export default function BursarDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Bursar Dashboard"
        subtitle="Full financial overview — income, expenses, and net position."
      />
      <InProgress
        title="The bursar dashboard is coming"
        subtitle="A complete, school-native accounting view. Track fee income, store sales, and expenses. See your P&L for the term and export everything to Excel."
        features={[
          "Total expected vs collected vs outstanding this term",
          "Per-class collection rate breakdown",
          "Record school expenses by category (salaries, utilities, etc.)",
          "Profit & Loss summary: income minus expenses = net position",
          "Export full accounts to Excel for your accountant",
          "Close the term's accounts when done",
        ]}
      />
    </div>
  );
}
