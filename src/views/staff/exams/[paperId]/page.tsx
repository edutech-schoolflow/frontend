import { use } from "react";
import ExamPaperEditor from "@/src/components/teacher/exams/ExamPaperEditor";

export default function ExamPaperEditorRoute({
  params,
}: {
  params: Promise<{ paperId: string }>;
}) {
  const { paperId } = use(params);
  return <ExamPaperEditor paperId={paperId} />;
}
