import ParentSidebar from "@/src/components/parent/dashboard/layout/ParentSidebar";
import ParentTopbar from "@/src/components/parent/dashboard/layout/ParentTopbar";
import ParentAuthGuard from "@/src/components/parent/dashboard/layout/ParentAuthGuard";

export default function ParentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ParentAuthGuard>
      <div className="flex h-screen overflow-hidden">
        <ParentSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <ParentTopbar />
          <main className="flex-1 overflow-y-auto bg-white">{children}</main>
        </div>
      </div>
    </ParentAuthGuard>
  );
}
