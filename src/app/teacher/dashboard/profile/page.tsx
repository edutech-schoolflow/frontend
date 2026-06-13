import InProgress from "@/src/shared/InProgress";

export default function TeacherProfilePage() {
  return (
    <div className="p-[30px]">
      <InProgress
        title="My Professional Profile"
        subtitle="Your portable teaching identity — visible to schools that invite you and automatically updated as you move between schools."
        features={[
          "Edit name, photo, bio, subjects, and years of experience",
          "Upload qualifications and certificates",
          "Employment history timeline (auto-built from school affiliations)",
          "CPD log: training and workshops attended",
          "Profile visibility setting: public to schools or private",
        ]}
      />
    </div>
  );
}
