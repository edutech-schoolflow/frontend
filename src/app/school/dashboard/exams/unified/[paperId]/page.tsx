import { use } from "react";
import UnifiedPaperEditor from "@/src/components/school/exams/UnifiedPaperEditor";

export default function UnifiedPaperEditorRoute({
  params,
}: {
  params: Promise<{ paperId: string }>;
}) {
  const { paperId } = use(params);
  return <UnifiedPaperEditor paperId={paperId} />;
}
