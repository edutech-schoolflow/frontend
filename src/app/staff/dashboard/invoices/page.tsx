import InProgress from "@/src/shared/InProgress";

export default function StaffInvoicesPage() {
  return (
    <div className="p-[30px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-text-heading">
          Invoices
        </h1>
        <p className="mt-0.5 text-[14px] text-text-body">
          View and manage student fee invoices.
        </p>
      </div>
      <InProgress
        title="Invoice management coming soon"
        subtitle="You'll be able to view all student invoices, track payment status, and send reminders."
        features={[
          "View invoices by class or student",
          "Track paid, partial, and outstanding invoices",
          "Send payment reminders to parents",
          "Export invoice reports",
        ]}
      />
    </div>
  );
}
