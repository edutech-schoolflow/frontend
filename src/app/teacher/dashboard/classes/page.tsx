import InProgress from "@/src/shared/InProgress";

export default function TeacherClassesPage() {
  return (
    <div className="p-[30px]">
      <InProgress
        title="My Classes"
        subtitle="See all the classes you teach across your schools."
        features={[
          "List of classes with subject and arm",
          "Student count per class",
          "Quick link to take attendance or enter scores",
        ]}
      />
    </div>
  );
}
