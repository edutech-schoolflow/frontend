import { useCallback, useEffect, useState } from "react";
import {
  getStoreItems,
  createStoreItem,
  updateStoreItem,
  getMaterialAssignments,
  assignItemToStudents,
  getClassOptions,
  getStudentOptions,
  type ClassOption,
  type StudentOption,
  type AssignTarget,
} from "@/src/lib/api/store";
import { useStaffFeatures } from "@/src/context/StaffFeaturesContext";
import type { StoreItem, MaterialAssignment } from "@/src/types/store";

export function useStaffStore() {
  const { features, profile } = useStaffFeatures();

  const [items, setItems] = useState<StoreItem[]>([]);
  const [assignments, setAssignments] = useState<MaterialAssignment[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(() => {
    Promise.all([
      getStoreItems(),
      getMaterialAssignments(),
      getClassOptions(),
      getStudentOptions(),
    ]).then(([itemsData, assignData, classData, studentData]) => {
      setItems(itemsData);
      setAssignments(assignData);
      setClasses(classData);
      setStudents(studentData);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreateItem(
    data: Omit<StoreItem, "id" | "createdAt" | "schoolId">
  ) {
    await createStoreItem({ ...data, schoolId: "sch-001" });
    load();
  }

  async function handleEditItem(
    itemId: string,
    data: Omit<StoreItem, "id" | "createdAt" | "schoolId">
  ) {
    await updateStoreItem(itemId, data);
    load();
  }

  async function handleAssign(
    item: StoreItem,
    target: AssignTarget,
    qty: number,
    note: string
  ) {
    if (!profile) return;
    await assignItemToStudents({
      item,
      target,
      quantity: qty,
      note,
      assignedBy: profile.staff.id,
    });
    load();
  }

  return {
    loaded,
    items,
    assignments,
    classes,
    students,
    canManage: features.can_manage_store,
    handleCreateItem,
    handleEditItem,
    handleAssign,
  };
}
