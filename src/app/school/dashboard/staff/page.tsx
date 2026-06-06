import PageHeader from "@/src/shared/PageHeader";
import InProgress from "@/src/shared/InProgress";

export default function StaffPage() {
  return (
    <div>
      <PageHeader
        title="Staff"
        subtitle="Manage your school's teaching and non-teaching staff."
      />
      <InProgress
        title="Staff management is coming"
        subtitle="You'll be able to add staff, assign roles, set class and subject responsibilities, and manage access levels."
        features={[
          "Add teaching and non-teaching staff",
          "Assign staff to classes and subjects",
          "Role-based access (Teacher, Bursar, Registrar, etc.)",
          "Staff profile with contact details and qualifications",
          "Deactivate staff who have left the school",
        ]}
      />
    </div>
  );
}
