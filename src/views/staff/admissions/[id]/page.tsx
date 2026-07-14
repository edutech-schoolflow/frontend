import ApplicationDetail from "@/src/components/school/applications/ApplicationDetail";

export default function StaffApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="p-[30px]">
      <ApplicationDetail
        id={params.id}
        backPath="/staff/dashboard/admissions"
      />
    </div>
  );
}
