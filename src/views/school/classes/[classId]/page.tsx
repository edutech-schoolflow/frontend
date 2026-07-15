import { use } from "react";
import ClassDetail from "@/src/components/school/classes/ClassDetail";

export default function ClassDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ classId: string }>;
  searchParams: Promise<{ name?: string }>;
}) {
  const { classId } = use(params);
  const { name } = use(searchParams);
  return <ClassDetail classId={classId} className={name} />;
}
