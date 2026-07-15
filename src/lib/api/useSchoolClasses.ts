import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSchoolClasses,
  getSchoolClass,
  createSchoolClass,
  deleteSchoolClass,
  getClassArms,
  addClassArm,
  getSchoolTeachers,
  setClassLevelTeacher,
  setClassTeacher,
  addSubjectTeacher,
  removeSubjectTeacher,
} from "./schoolClasses";

export const classesKey = ["school", "classes"] as const;
export const teachersKey = ["school", "teachers"] as const;
export const classKey = (classId: string) =>
  ["school", "classes", classId] as const;
export const classArmsKey = (classId: string) =>
  ["school", "classes", classId, "arms"] as const;

export function useClasses() {
  return useQuery({
    queryKey: classesKey,
    queryFn: getSchoolClasses,
    staleTime: 30_000,
  });
}

export function useClass(classId: string) {
  return useQuery({
    queryKey: classKey(classId),
    queryFn: () => getSchoolClass(classId),
    enabled: !!classId,
  });
}

export function useSchoolTeachers() {
  return useQuery({
    queryKey: teachersKey,
    queryFn: getSchoolTeachers,
    staleTime: 60_000,
  });
}

export function useCreateClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createSchoolClass,
    onSuccess: () => qc.invalidateQueries({ queryKey: classesKey }),
  });
}

export function useDeleteClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteSchoolClass,
    onSuccess: () => qc.invalidateQueries({ queryKey: classesKey }),
  });
}

// ── ClassDetail (arms + teacher assignment) ───────────────────────────────────

export function useClassArms(classId: string) {
  return useQuery({
    queryKey: classArmsKey(classId),
    queryFn: () => getClassArms(classId),
    enabled: !!classId,
  });
}

export function useAddClassArm(classId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { arm: string; teacherAffiliationId?: string | null }) =>
      addClassArm(classId, vars.arm, vars.teacherAffiliationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: classArmsKey(classId) });
      qc.invalidateQueries({ queryKey: classesKey });
    },
  });
}

export function useSetClassLevelTeacher(classId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (teacherAffiliationId: string | null) =>
      setClassLevelTeacher(classId, teacherAffiliationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: classKey(classId) });
      qc.invalidateQueries({ queryKey: classesKey });
    },
  });
}

export function useSetClassTeacher(classId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: {
      armId: string;
      teacherAffiliationId: string | null;
    }) => setClassTeacher(vars.armId, vars.teacherAffiliationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: classArmsKey(classId) });
      qc.invalidateQueries({ queryKey: classesKey });
    },
  });
}

export function useAddSubjectTeacher(classId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: {
      armId: string;
      teacherAffiliationId: string;
      subject: string;
    }) =>
      addSubjectTeacher(vars.armId, vars.teacherAffiliationId, vars.subject),
    onSuccess: () => qc.invalidateQueries({ queryKey: classArmsKey(classId) }),
  });
}

export function useRemoveSubjectTeacher(classId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (subjectTeacherId: string) =>
      removeSubjectTeacher(subjectTeacherId),
    onSuccess: () => qc.invalidateQueries({ queryKey: classArmsKey(classId) }),
  });
}
