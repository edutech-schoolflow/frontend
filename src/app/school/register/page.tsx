import AuthCardLayout from "@/src/layout/auth/AuthCardLayout";
import SchoolRegisterForm from "@/src/components/school/auth/SchoolRegisterForm";

export default function SchoolRegisterPage() {
  return (
    <AuthCardLayout
      title="Register your school"
      subTitle="Get started on SchoolFlow in 3 simple steps"
    >
      <SchoolRegisterForm />
    </AuthCardLayout>
  );
}
