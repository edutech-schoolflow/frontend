import type { BehavioralTrait } from "@/src/types/grade";

export function gradeStyle(grade: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    A: { bg: "#daffeb", text: "#1ca95c" },
    B: { bg: "#dbeafe", text: "#2563eb" },
    C: { bg: "#fff4e5", text: "#ff8d28" },
    D: { bg: "#fef9c3", text: "#ca8a04" },
    F: { bg: "#ffe4e4", text: "#e84040" },
  };
  return map[grade] ?? { bg: "#f0f0f0", text: "#666" };
}

export function traitLabel(trait: BehavioralTrait): string {
  const map: Record<BehavioralTrait, string> = {
    punctuality: "Punctuality",
    attentiveness: "Attentiveness",
    cooperation: "Cooperation",
    neatness: "Neatness",
    politeness: "Politeness",
    leadership: "Leadership",
  };
  return map[trait];
}

export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

export function attendanceRate(present: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((present / total) * 100);
}

export function formatReportDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
