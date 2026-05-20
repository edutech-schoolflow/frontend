import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Meters",
  description: "",
};

const Meters = dynamic(() => import("@/src/components/meters"));

const MetersPage = () => {
  return <Meters />;
};

export default MetersPage;
