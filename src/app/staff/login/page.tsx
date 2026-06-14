import StaffAuthLayout from "@/src/layout/auth/TeacherAuthLayout";
import StaffLoginForm from "@/src/components/teacher/auth/TeacherLoginForm";

export default function StaffLoginPage() {
  return (
    <StaffAuthLayout
      title="Welcome back"
      subtitle="Sign in to your staff portal"
    >
      <StaffLoginForm />
    </StaffAuthLayout>
  );
}
