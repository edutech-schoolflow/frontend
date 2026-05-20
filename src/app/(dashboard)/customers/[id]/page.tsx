import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Details page",
  description: "",
};

const CustomerDetail = dynamic(() => import("@/src/components/customers/id"));

const CustomerDetailPage = () => {
  return <CustomerDetail />;
};

export default CustomerDetailPage;
