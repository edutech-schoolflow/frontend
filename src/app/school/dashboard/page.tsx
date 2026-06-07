import PageHeader from "@/src/shared/PageHeader";
import StatsCard from "@/src/shared/StatsCard";

export default function SchoolDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back. Here's an overview of your school."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard label="Total Students" value={450} />
        <StatsCard label="Staff Members" value={32} />
        <StatsCard label="Pending Applications" value={5} />
        <StatsCard label="Fees Collected" value="₦1,200,000" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border-default bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-dark-blue">
            Getting Started Checklist
          </h2>
          <ul className="space-y-3 text-sm">
            {[
              { label: "Complete school setup", done: true },
              { label: "Invite proprietor (owner)", done: false },
              { label: "Add staff members", done: true },
              { label: "Create classes & sections", done: true },
              { label: "Add your first students", done: true },
              { label: "Set up fee structure", done: false },
              { label: "Configure grading system", done: false },
              { label: "Test parent portal access", done: false },
            ].map((item) => (
              <li key={item.label} className="flex items-center gap-2">
                <span
                  className={item.done ? "text-green-500" : "text-gray-300"}
                >
                  {item.done ? "✓" : "○"}
                </span>
                <span
                  className={
                    item.done ? "text-grey-text line-through" : "text-dark-blue"
                  }
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border-default bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-dark-blue">
            KYC Status
          </h2>
          <div className="flex items-center gap-3 rounded-lg bg-green-50 p-4">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-sm font-medium text-green-700">KYC Verified</p>
              <p className="text-xs text-green-600">
                Payments enabled · School visible to parents
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
