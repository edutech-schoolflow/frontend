import PageHeader from "@/src/shared/PageHeader";
import SchoolApplications from "@/src/components/school/applications/SchoolApplications";

export default function ApplicationsPage() {
  return (
    <div>
      <PageHeader
        title="Applications"
        subtitle="Student enrollment applications received from parents."
      />
      <SchoolApplications />
    </div>
  );
}
