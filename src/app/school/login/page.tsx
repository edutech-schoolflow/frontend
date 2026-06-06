import SchoolAuthLayout from "@/src/layout/auth/SchoolAuthLayout";
import SchoolLoginForm from "@/src/components/school/auth/SchoolLoginForm";

export default function SchoolLoginPage() {
  return (
    <SchoolAuthLayout
      title="Welcome back"
      subtitle="Sign in to your school portal"
    >
      <SchoolLoginForm />
    </SchoolAuthLayout>
  );
}
