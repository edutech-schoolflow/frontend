import PageHeader from "@/src/shared/PageHeader";
import InProgress from "@/src/shared/InProgress";

export default function InvoicesPage() {
  return (
    <div>
      <PageHeader
        title="Invoices"
        subtitle="View all student invoices and their payment status."
      />
      <InProgress
        title="Invoice management is coming"
        subtitle="Every student gets an invoice per term. Track what's been paid, what's outstanding, and send reminders — all from here."
        features={[
          "View all invoices filtered by class, term, and payment status",
          "Drill into each invoice to see line items and payment history",
          "Send a manual fee reminder to a specific parent",
          "Download invoice as PDF",
          "Automated reminders sent 14, 7, and 2 days before the deadline",
        ]}
      />
    </div>
  );
}
