import PageHeader from "@/src/shared/PageHeader";
import InProgress from "@/src/shared/InProgress";

export default function AuditLogPage() {
  return (
    <div>
      <PageHeader
        title="Audit Log"
        subtitle="A complete record of every action taken in your school account."
      />
      <InProgress
        title="The audit log is coming"
        subtitle="Every important action — score edits, payment records, student changes, result publications — is logged here with the staff member's name, date, and time."
        features={[
          "Timestamped log of every data change in the system",
          "Filter by action type, staff member, or date range",
          "See before and after values for edits",
          "Locked records — the audit log cannot be edited or deleted",
          "Export log for compliance or investigation purposes",
        ]}
      />
    </div>
  );
}
