import SchoolSidebar from "@/src/components/school/layout/SchoolSidebar";
import SchoolTopbar from "@/src/components/school/layout/SchoolTopbar";

export default function SchoolDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SchoolSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <SchoolTopbar />
        <main className="flex-1 overflow-y-auto bg-surface-muted px-[32px] py-[28px]">
          {children}
        </main>
      </div>
    </div>
  );
}
