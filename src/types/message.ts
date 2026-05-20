export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: "parent" | "teacher";
  body: string;
  attachmentUrl?: string;
  readAt?: string;
  createdAt: string;
}

export interface MessageThread {
  id: string;
  parentId: string;
  parentName: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  messages?: Message[];
}
