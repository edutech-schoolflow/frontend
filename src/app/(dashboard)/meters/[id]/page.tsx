import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Meter Detail",
  description: "",
};

const MetersDetails = dynamic(() => import("@/src/components/meters/id/Id"));

const MetersDetailsPage = () => {
  return <MetersDetails />;
};

export default MetersDetailsPage;
