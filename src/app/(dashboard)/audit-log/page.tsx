import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Audit Log",
  description: "",
};
const AuditLog = dynamic(() => import("@/src/components/audit-log"));

const AuditLogPage = () => {
  return <AuditLog />;
};

export default AuditLogPage;
