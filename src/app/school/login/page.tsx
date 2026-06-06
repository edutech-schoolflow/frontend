import AuthCardLayout from "@/src/layout/auth/AuthCardLayout";
import SchoolLoginForm from "@/src/components/school/auth/SchoolLoginForm";

export default function SchoolLoginPage() {
  return (
    <AuthCardLayout
      title="Welcome back"
      subTitle="Sign in to your school portal"
    >
      <SchoolLoginForm />
    </AuthCardLayout>
  );
}
