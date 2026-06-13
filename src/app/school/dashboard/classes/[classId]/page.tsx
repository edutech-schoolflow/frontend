import ClassDetail from "@/src/components/school/classes/ClassDetail";

export default function ClassDetailPage({
  params,
  searchParams,
}: {
  params: { classId: string };
  searchParams: { name?: string };
}) {
  return <ClassDetail classId={params.classId} className={searchParams.name} />;
}
