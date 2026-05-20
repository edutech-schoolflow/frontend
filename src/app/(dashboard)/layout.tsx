import LayoutPage from "@/src/layout/dashboard";
import { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return <LayoutPage>{children}</LayoutPage>;
};

export default DashboardLayout;
