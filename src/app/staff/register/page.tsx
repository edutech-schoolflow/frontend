import StaffAuthLayout from "@/src/layout/auth/TeacherAuthLayout";
import StaffRegisterForm from "@/src/components/teacher/auth/TeacherRegisterForm";
import InviteAcceptFlow from "@/src/components/staff/auth/InviteAcceptFlow";

export default async function StaffRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (token) {
    return <InviteAcceptFlow token={token} />;
  }

  return (
    <StaffAuthLayout
      title="Create your staff account"
      subtitle="Your professional profile — portable across every school you work at"
    >
      <StaffRegisterForm />
    </StaffAuthLayout>
  );
}
