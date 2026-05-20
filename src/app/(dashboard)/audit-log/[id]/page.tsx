"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

const AuditDetails = dynamic(() => import("@/src/components/audit-log/index"));

const AuditDetailsPage = () => {
  return <AuditDetails />;
};

export default AuditDetailsPage;
