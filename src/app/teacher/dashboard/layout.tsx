import TeacherSidebar from "@/src/components/teacher/dashboard/layout/TeacherSidebar";
import TeacherTopbar from "@/src/components/teacher/dashboard/layout/TeacherTopbar";

export default function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <TeacherSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TeacherTopbar />
        <main className="flex-1 overflow-y-auto bg-white">{children}</main>
      </div>
    </div>
  );
}
