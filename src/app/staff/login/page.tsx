import TeacherAuthLayout from "@/src/layout/auth/TeacherAuthLayout";
import TeacherLoginForm from "@/src/components/teacher/auth/TeacherLoginForm";

export default function TeacherLoginPage() {
  return (
    <TeacherAuthLayout
      title="Welcome back"
      subtitle="Sign in to your teacher portal"
    >
      <TeacherLoginForm />
    </TeacherAuthLayout>
  );
}
