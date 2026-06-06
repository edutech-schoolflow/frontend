import SchoolAuthLayout from "@/src/layout/auth/SchoolAuthLayout";
import SchoolRegisterForm from "@/src/components/school/auth/SchoolRegisterForm";

export default function SchoolRegisterPage() {
  return (
    <SchoolAuthLayout
      title="Register your school"
      subtitle="Get started on Oneschoolplatform in 3 simple steps"
    >
      <SchoolRegisterForm />
    </SchoolAuthLayout>
  );
}
