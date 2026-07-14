import PageHeader from "@/src/shared/PageHeader";
import InProgress from "@/src/shared/InProgress";

export default function StudentImportsPage() {
  return (
    <div>
      <PageHeader
        title="Import Requests"
        subtitle="Review and approve student data submitted via Google Form."
      />
      <InProgress
        title="Student imports are coming"
        subtitle="Teachers submit student and parent data via a Google Form. Each submission lands here for review before it enters the system."
        features={[
          "Review incoming student records from Google Form submissions",
          "Approve or reject each entry individually",
          "Automatic parent deduplication by phone number",
          "Bulk approve all valid records",
          "Download import error report",
        ]}
      />
    </div>
  );
}
