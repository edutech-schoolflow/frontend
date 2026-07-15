import { apiDelete, apiGet, apiPost, apiPut } from "./client";
import { getSchoolStaffList } from "./schoolStaff";
import type {
  SchoolClass,
  ClassLevel,
  ClassArm,
  CreateClassPayload,
} from "@/src/types/school";

// ── backend shapes ────────────────────────────────────────────────────────────

interface SchoolClassResponse {
  id: string;
  name: string;
  level: string; // pre_school | nursery | primary | junior_secondary | senior_secondary
  order: number;
  armsCount: number;
  studentsCount: number;
  teacherNames: string[];
  classTeacher: { affiliationId: string; name: string } | null;
}

interface ClassArmResponse {
  id: string;
  classId: string;
  className: string;
  arm: string;
  fullName: string;
  classTeacher: { affiliationId: string; name: string } | null;
  studentsCount: number;
  subjectTeachers: {
    id: string;
    subject: string;
    teacherAffiliationId: string;
    teacherName: string;
  }[];
}

function toClass(c: SchoolClassResponse): SchoolClass {
  return {
    id: c.id,
    name: c.name,
    level: c.level as ClassLevel,
    order: c.order,
    armsCount: c.armsCount,
    studentsCount: c.studentsCount,
    teacherNames: c.teacherNames,
    classTeacher: c.classTeacher
      ? { id: c.classTeacher.affiliationId, name: c.classTeacher.name }
      : null,
  };
}

function toArm(a: ClassArmResponse): ClassArm {
  return {
    id: a.id,
    classId: a.classId,
    className: a.className,
    arm: a.arm,
    fullName: a.fullName,
    classTeacher: a.classTeacher
      ? { id: a.classTeacher.affiliationId, name: a.classTeacher.name }
      : null,
    studentsCount: a.studentsCount,
    subjectTeachers: a.subjectTeachers.map((s) => ({
      subject: s.subject,
      teacherId: s.teacherAffiliationId,
      teacherName: s.teacherName,
    })),
  };
}

// ── classes ───────────────────────────────────────────────────────────────────

export async function getSchoolClasses(): Promise<SchoolClass[]> {
  const { data } = await apiGet<SchoolClassResponse[]>("/classes");
  return data.map(toClass);
}

export async function getSchoolClass(classId: string): Promise<SchoolClass> {
  const { data } = await apiGet<SchoolClassResponse>(`/classes/${classId}`);
  return toClass(data);
}

export async function createSchoolClass(
  payload: CreateClassPayload
): Promise<SchoolClass> {
  const { data } = await apiPost<SchoolClassResponse>("/classes", {
    name: payload.name,
    level: payload.level,
    order: 0,
    arms: payload.arms,
    teacherPerArm: payload.teacherPerArm ?? null,
  });
  return toClass(data);
}

export async function deleteSchoolClass(classId: string): Promise<void> {
  await apiDelete<null>(`/classes/${classId}`);
}

export async function getClassArms(classId: string): Promise<ClassArm[]> {
  const { data } = await apiGet<ClassArmResponse[]>(`/classes/${classId}/arms`);
  return data.map(toArm);
}

export async function addClassArm(
  classId: string,
  arm: string,
  teacherAffiliationId?: string | null
): Promise<ClassArm> {
  const { data } = await apiPost<ClassArmResponse>(`/classes/${classId}/arms`, {
    arm,
    teacherAffiliationId: teacherAffiliationId ?? null,
  });
  return toArm(data);
}

/** Assign (or clear, with null) the class's own teacher — for classes with no arms. */
export async function setClassLevelTeacher(
  classId: string,
  teacherAffiliationId: string | null
): Promise<void> {
  await apiPut<null>(`/classes/${classId}/class-teacher`, {
    teacherAffiliationId,
  });
}

/** Assign (or clear, with null) an arm's class teacher; returns the updated arm. */
export async function setClassTeacher(
  armId: string,
  teacherAffiliationId: string | null
): Promise<void> {
  await apiPut<null>(`/arms/${armId}/class-teacher`, { teacherAffiliationId });
}

export async function addSubjectTeacher(
  armId: string,
  teacherAffiliationId: string,
  subject: string
): Promise<void> {
  await apiPost<unknown>(`/arms/${armId}/subject-teachers`, {
    teacherAffiliationId,
    subject,
  });
}

export async function removeSubjectTeacher(
  subjectTeacherId: string
): Promise<void> {
  await apiDelete<null>(`/subject-teachers/${subjectTeacherId}`);
}

/** Active teachers for class-teacher / subject-teacher dropdowns (id = staff affiliation id). */
export async function getSchoolTeachers(): Promise<
  { id: string; name: string }[]
> {
  const staff = await getSchoolStaffList();
  return staff
    .filter((s) => s.role === "teacher" && s.status === "active")
    .map((s) => ({ id: s.id, name: `${s.firstName} ${s.lastName}` }));
}
