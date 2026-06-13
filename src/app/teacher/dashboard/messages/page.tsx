import InProgress from "@/src/shared/InProgress";

export default function TeacherMessagesPage() {
  return (
    <div className="p-[30px]">
      <InProgress
        title="Parent Messages"
        subtitle="Send and receive messages from parents about specific students. Full conversation history is saved."
        features={[
          "Start a conversation: select student → select parent",
          "Reply thread view with timestamps",
          "File attachment support",
          "Read receipts",
          "Unread message badge",
          "Class broadcast to all parents",
        ]}
      />
    </div>
  );
}
