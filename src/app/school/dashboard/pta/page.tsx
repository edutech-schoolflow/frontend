import PageHeader from "@/src/shared/PageHeader";
import InProgress from "@/src/shared/InProgress";

export default function PtaPage() {
  return (
    <div>
      <PageHeader
        title="PTA Group"
        subtitle="Manage parent WhatsApp group invitations and track membership."
      />
      <InProgress
        title="PTA management is coming"
        subtitle="Paste your school's WhatsApp group invite link and the system sends a personalised tracked link to every parent. See exactly who has joined and who hasn't."
        features={[
          "Paste WhatsApp group invite link once — system handles the rest",
          "Unique tracking link generated per parent",
          "See status per parent: Not Invited / Invited / Link Clicked / In Group",
          "One-click invite all uninvited parents",
          "Re-invite parents who clicked but haven't joined",
        ]}
      />
    </div>
  );
}
