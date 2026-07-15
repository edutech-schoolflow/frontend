import PageHeader from "@/src/shared/PageHeader";
import InProgress from "@/src/shared/InProgress";

export default function StoreOrdersPage() {
  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle="Track and fulfil parent orders from the school store."
      />
      <InProgress
        title="Order management is coming"
        subtitle="Every time a parent places and pays for an order, it appears here. Pack, mark ready, and record collection — all in one place."
        features={[
          "View all orders filtered by status (Paid, Ready, Collected)",
          "See full item breakdown per order",
          "Mark orders as ready for collection",
          "Notify parent via WhatsApp when their order is ready",
          "Export sales report for the term",
        ]}
      />
    </div>
  );
}
