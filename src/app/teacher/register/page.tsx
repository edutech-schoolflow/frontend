import TeacherAuthLayout from "@/src/layout/auth/TeacherAuthLayout";
import TeacherRegisterForm from "@/src/components/teacher/auth/TeacherRegisterForm";

export default function TeacherRegisterPage() {
  return (
    <TeacherAuthLayout
      title="Create your teacher account"
      subtitle="Your professional profile — portable across every school you teach at"
    >
      <TeacherRegisterForm />
    </TeacherAuthLayout>
  );
}
