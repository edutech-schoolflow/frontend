"use client";

import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import { getStudents, getClasses } from "@/src/lib/api/students";
import type { Student, Class } from "@/src/types/student";
import AddStudentModal from "./AddStudentModal";

function age(dob: string) {
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

function initials(s: Student) {
  return `${s.firstName[0]}${s.lastName[0]}`.toUpperCase();
}

export default function SchoolStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    Promise.all([getStudents(), getClasses()]).then(([{ data }, cls]) => {
      setStudents(data);
      setClasses(cls);
      setLoading(false);
    });
  }, []);

  const classMap = Object.fromEntries(classes.map((c) => [c.id, c.name]));

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
      (s.admissionNumber ?? "").toLowerCase().includes(q);
    const matchClass = classFilter === "all" || s.classId === classFilter;
    return matchSearch && matchClass;
  });

  function handleAdded(student: Student) {
    setStudents((prev) => [student, ...prev]);
    setShowAdd(false);
  }

  return (
    <>
      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-[340px]">
          <Search className="absolute left-[12px] top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-grey-text" />
          <input
            type="text"
            placeholder="Search by name or admission no…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border-default bg-white py-[9px] pl-[36px] pr-[12px] text-[13px] text-dark-blue outline-none focus:border-brand-green"
          />
        </div>

        {/* Class filter */}
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="rounded-lg border border-border-default bg-white px-3 py-[9px] text-[13px] text-dark-blue outline-none focus:border-brand-green"
        >
          <option value="all">All classes</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Count */}
        <span className="text-[13px] text-grey-text">
          {filtered.length} student{filtered.length !== 1 ? "s" : ""}
        </span>

        {/* Add button */}
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-[6px] rounded-lg bg-brand-green px-4 py-2.5 text-[13px] font-medium text-white hover:opacity-90"
        >
          <Plus className="h-[15px] w-[15px]" />
          Add Student
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border-default bg-white">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-border-default bg-surface-muted">
              <th className="px-[16px] py-[12px] font-medium text-grey-text">
                Student
              </th>
              <th className="px-[16px] py-[12px] font-medium text-grey-text">
                Admission No.
              </th>
              <th className="px-[16px] py-[12px] font-medium text-grey-text">
                Class
              </th>
              <th className="px-[16px] py-[12px] font-medium text-grey-text">
                Age
              </th>
              <th className="px-[16px] py-[12px] font-medium text-grey-text">
                Gender
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-[16px] py-[48px] text-center text-[13px] text-grey-text"
                >
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-[16px] py-[48px] text-center text-[13px] text-grey-text"
                >
                  {search || classFilter !== "all"
                    ? "No students match your search."
                    : "No students yet."}
                </td>
              </tr>
            ) : (
              filtered.map((student, i) => (
                <tr
                  key={student.id}
                  className={`transition-colors hover:bg-surface-muted ${i !== filtered.length - 1 ? "border-b border-border-default" : ""}`}
                >
                  {/* Name + avatar */}
                  <td className="px-[16px] py-[14px]">
                    <div className="flex items-center gap-[10px]">
                      <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-[12px] font-semibold text-brand-green">
                        {initials(student)}
                      </div>
                      <div>
                        <p className="font-medium text-dark-blue">
                          {student.firstName}
                          {student.middleName
                            ? ` ${student.middleName}`
                            : ""}{" "}
                          {student.lastName}
                        </p>
                        {student.medicalNotes && (
                          <p className="mt-[1px] text-[11px] text-amber-600">
                            ⚕ Medical note
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-[16px] py-[14px] font-mono text-[12px] text-grey-text">
                    {student.admissionNumber ?? "—"}
                  </td>
                  <td className="px-[16px] py-[14px] text-dark-blue">
                    {student.classId ? (classMap[student.classId] ?? "—") : "—"}
                  </td>
                  <td className="px-[16px] py-[14px] text-dark-blue">
                    {age(student.dateOfBirth)} yrs
                  </td>
                  <td className="px-[16px] py-[14px]">
                    <span
                      className={`inline-flex rounded-full px-[10px] py-[3px] text-[12px] font-medium ${student.gender === "female" ? "bg-pink-50 text-pink-700" : "bg-blue-50 text-blue-700"}`}
                    >
                      {student.gender === "female" ? "Female" : "Male"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <AddStudentModal
          classes={classes}
          onDone={handleAdded}
          onClose={() => setShowAdd(false)}
        />
      )}
    </>
  );
}
