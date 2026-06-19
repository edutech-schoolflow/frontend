import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAllArmSubmissions,
  getAllUnifiedPapers,
  approveExamPaper,
  rejectExamPaper,
  createUnifiedPaper,
  saveAdminFeedback,
} from "@/src/lib/api/examPaper";
import type { ExamPaper, ExamType } from "@/src/types/examPaper";
import type { GradeTerm } from "@/src/types/scoreEntry";

export type StatusFilter = "all" | "pending" | "ready";

export interface SubmissionGroup {
  key: string;
  className: string;
  subject: string;
  term: GradeTerm;
  examType: ExamType;
  papers: ExamPaper[];
}

function groupSubmissions(papers: ExamPaper[]): SubmissionGroup[] {
  const map = new Map<string, SubmissionGroup>();
  for (const paper of papers) {
    const cn = paper.className ?? paper.armName.replace(/\s[A-Z]$/, "");
    const key = `${cn}::${paper.subject}::${paper.term}::${paper.examType}`;
    if (!map.has(key)) {
      map.set(key, {
        key,
        className: cn,
        subject: paper.subject,
        term: paper.term,
        examType: paper.examType,
        papers: [],
      });
    }
    map.get(key)!.papers.push(paper);
  }
  return Array.from(map.values()).sort((a, b) => {
    const cn = a.className.localeCompare(b.className);
    return cn !== 0 ? cn : a.subject.localeCompare(b.subject);
  });
}

export function useSchoolExams() {
  const router = useRouter();

  const [term, setTerm] = useState<GradeTerm>("second_term");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [armPapers, setArmPapers] = useState<ExamPaper[]>([]);
  const [unifiedPapers, setUnifiedPapers] = useState<ExamPaper[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [buildingGroupKey, setBuildingGroupKey] = useState<string | null>(null);
  const [previewPaper, setPreviewPaper] = useState<ExamPaper | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getAllArmSubmissions(), getAllUnifiedPapers()]).then(
      ([arm, unified]) => {
        if (cancelled) return;
        setArmPapers(arm);
        setUnifiedPapers(unified);
        setLoaded(true);
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const termPapers = useMemo(
    () => armPapers.filter((p) => p.term === term),
    [armPapers, term]
  );
  const allGroups = useMemo(() => groupSubmissions(termPapers), [termPapers]);

  const getExistingUnified = useCallback(
    (group: SubmissionGroup) =>
      unifiedPapers.find(
        (up) =>
          up.className === group.className &&
          up.subject === group.subject &&
          up.term === group.term &&
          up.examType === group.examType
      ),
    [unifiedPapers]
  );

  const visibleGroups = useMemo(() => {
    if (statusFilter === "pending")
      return allGroups.filter((g) =>
        g.papers.some((p) => p.status === "submitted")
      );
    if (statusFilter === "ready")
      return allGroups.filter(
        (g) => getExistingUnified(g)?.status === "approved"
      );
    return allGroups;
  }, [allGroups, statusFilter, getExistingUnified]);

  const pendingCount = useMemo(
    () => termPapers.filter((p) => p.status === "submitted").length,
    [termPapers]
  );
  const approvedCount = useMemo(
    () => termPapers.filter((p) => p.status === "approved").length,
    [termPapers]
  );
  const finalizedCount = useMemo(
    () =>
      unifiedPapers.filter((p) => p.term === term && p.status === "approved")
        .length,
    [unifiedPapers, term]
  );

  async function handleApprove(paperId: string) {
    setApprovingId(paperId);
    const updated = await approveExamPaper(paperId);
    setArmPapers((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    setApprovingId(null);
  }

  async function handleReject(paperId: string, comment: string) {
    const updated = await rejectExamPaper(paperId, comment);
    setArmPapers((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  }

  async function handleSaveFeedback(
    paperId: string,
    feedback: string,
    questionNotes: Record<string, string>
  ) {
    const updated = await saveAdminFeedback(paperId, feedback, questionNotes);
    setArmPapers((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  }

  async function handleBuildUnified(group: SubmissionGroup) {
    setBuildingGroupKey(group.key);
    const approved = group.papers.filter((p) => p.status === "approved");
    const mergedQuestions = approved.flatMap((p) =>
      p.questions.map((q) => ({
        ...q,
        id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sourceArm: p.armName,
      }))
    );
    const paper = await createUnifiedPaper({
      className: group.className,
      subject: group.subject,
      term: group.term,
      examType: group.examType,
      duration: approved[0].duration,
      instructions: approved[0].instructions,
      questions: mergedQuestions,
      sourceArmIds: approved.map((p) => p.armId),
    });
    router.push(`/school/dashboard/exams/unified/${paper.id}`);
  }

  return {
    loaded,
    term,
    setTerm,
    statusFilter,
    setStatusFilter,
    termPapers,
    visibleGroups,
    pendingCount,
    approvedCount,
    finalizedCount,
    getExistingUnified,
    approvingId,
    buildingGroupKey,
    previewPaper,
    setPreviewPaper,
    handleApprove,
    handleReject,
    handleSaveFeedback,
    handleBuildUnified,
  };
}
