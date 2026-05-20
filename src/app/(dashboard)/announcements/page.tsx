import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Announcements",
  description: "",
};
const Announcements = dynamic(() => import("@/src/components/announcements"));

const AnnouncementsPage = () => {
  return <Announcements />;
};

export default AnnouncementsPage;
