import InProgress from "@/src/shared/InProgress";

export default function TeacherSchoolsPage() {
  return (
    <div className="p-[30px]">
      <InProgress
        title="My Schools"
        subtitle="Schools you are currently affiliated with, plus any pending invitations waiting for your acceptance."
        features={[
          "Active school affiliations with role and class assignments",
          "Accept or decline school invitations",
          "Resign from a school with a formal resignation record",
          "Employment history auto-updated on your profile",
        ]}
      />
    </div>
  );
}
