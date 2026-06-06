import PageHeader from "@/src/shared/PageHeader";
import InProgress from "@/src/shared/InProgress";

export default function FeeTypesPage() {
  return (
    <div>
      <PageHeader
        title="Fee Types"
        subtitle="Define the fees your school charges each term."
      />
      <InProgress
        title="Fee configuration is coming"
        subtitle="Create and manage fee types (tuition, PTA levy, books, etc.) with amounts per class. The system generates invoices automatically for all enrolled students."
        features={[
          "Create fee types with name, amount, and applicable classes",
          "Set different amounts per class (e.g. JSS1 pays less than SSS3)",
          "Link fees to a specific term or make them recurring",
          "Generate invoices for all students in a class with one click",
          "Edit fee types before invoices are generated",
        ]}
      />
    </div>
  );
}
