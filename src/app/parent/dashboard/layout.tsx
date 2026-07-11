import ParentSidebar from "@/src/components/parent/dashboard/layout/ParentSidebar";
import ParentTopbar from "@/src/components/parent/dashboard/layout/ParentTopbar";
import IdentityGuard from "@/src/components/parent/dashboard/layout/IdentityGuard";

// The parent home is an IDENTITY page (EDD-002): guarded by the identity session, not a parent token.
// A brand-new user with no relationships lands here and grows into it (find schools → apply → enrol).
export default function ParentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <IdentityGuard>
      <div className="flex h-screen overflow-hidden">
        <ParentSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <ParentTopbar />
          <main className="flex-1 overflow-y-auto bg-white">{children}</main>
        </div>
      </div>
    </IdentityGuard>
  );
}
