import InProgress from "@/src/shared/InProgress";

export default function TeacherExamsPage() {
  return (
    <div className="p-[30px]">
      <InProgress
        title="Exam Questions"
        subtitle="Type exam papers directly in the portal and submit to your HOD for review — no printing required."
        features={[
          "Question editor: multiple choice, theory, fill-in-blank, essay",
          "Question bank — save and reuse questions by topic",
          "Compose a paper from bank or write fresh",
          "Submit to HOD for digital review and approval",
          "Admin downloads print-ready PDF of approved paper",
          "Auto-shuffle: generate variant A and variant B",
        ]}
      />
    </div>
  );
}
