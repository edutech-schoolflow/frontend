import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Details page",
  description: "",
};

const AnnouncementDetails = dynamic(
  () => import("@/src/components/announcements/id")
);

const AnnouncementDetailPage = () => {
  return <AnnouncementDetails />;
};

export default AnnouncementDetailPage;
