import PageHeader from "@/src/shared/PageHeader";
import { Button } from "@/src/components/ui/button";

export default function StudentsPage() {
  return (
    <div>
      <PageHeader
        title="Students"
        subtitle="All enrolled students across classes."
        action={
          <Button className="bg-brand-green hover:bg-brand-green/90">
            + Add Student
          </Button>
        }
      />
      <p className="text-sm text-grey-text">
        Student table — connect to mock API in component.
      </p>
    </div>
  );
}
