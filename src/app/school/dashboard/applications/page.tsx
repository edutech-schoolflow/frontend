import PageHeader from "@/src/shared/PageHeader";

export default function ApplicationsPage() {
  return (
    <div>
      <PageHeader
        title="Applications"
        subtitle="Student enrollment applications received from parents."
      />
      <p className="text-sm text-grey-text">Applications inbox — connect to mock API in component.</p>
    </div>
  );
}
