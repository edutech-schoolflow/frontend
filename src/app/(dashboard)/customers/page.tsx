import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Customer Management - Customers",
  description: "",
};

const Customers = dynamic(() => import("@/src/components/customers"));

const CustomersPage = () => {
  return <Customers />;
};

export default CustomersPage;
