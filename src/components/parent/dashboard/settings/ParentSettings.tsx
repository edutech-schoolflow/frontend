import ProfileSection from "./ProfileSection";
import PasswordSection from "./PasswordSection";
import NotifSection from "./NotifSection";

export default function ParentSettings() {
  return (
    <div className="px-[88px] py-[31px] pb-[60px]">
      <h1 className="mb-[32px] text-[24px] font-medium text-[#1b1b1b]">
        Settings
      </h1>
      <div className="flex flex-col gap-[24px]">
        <ProfileSection />
        <PasswordSection />
        <NotifSection />
      </div>
    </div>
  );
}
