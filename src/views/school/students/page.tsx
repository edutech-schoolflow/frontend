import PageHeader from "@/src/shared/PageHeader";
import SchoolStudents from "@/src/components/school/students/SchoolStudents";

export default function StudentsPage() {
  return (
    <div>
      <PageHeader
        title="Students"
        subtitle="All enrolled students across classes."
      />
      <SchoolStudents />
    </div>
  );
}
