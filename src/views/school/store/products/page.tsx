import PageHeader from "@/src/shared/PageHeader";
import InProgress from "@/src/shared/InProgress";

export default function StoreProductsPage() {
  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="List items available for parents to order and pay for online."
      />
      <InProgress
        title="The school store is coming"
        subtitle="Create a catalogue of books, uniforms, and other items. Parents browse, order, and pay through the app — no cash at the gate."
        features={[
          "Add products with name, price, category, and stock quantity",
          "Assign products to specific classes",
          "Optional product image upload",
          "Activate or deactivate listings at any time",
          "Stock automatically decremented on confirmed payment",
        ]}
      />
    </div>
  );
}
