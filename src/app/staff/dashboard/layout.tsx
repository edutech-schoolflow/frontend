import { StaffFeaturesProvider } from "@/src/context/StaffFeaturesContext";
import StaffSidebar from "@/src/components/teacher/dashboard/layout/TeacherSidebar";
import StaffTopbar from "@/src/components/teacher/dashboard/layout/TeacherTopbar";

export default function StaffDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StaffFeaturesProvider>
      <div className="flex h-screen overflow-hidden">
        <StaffSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <StaffTopbar />
          <main className="flex-1 overflow-y-auto bg-white">{children}</main>
        </div>
      </div>
    </StaffFeaturesProvider>
  );
}
