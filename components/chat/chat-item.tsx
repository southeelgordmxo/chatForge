"use client";

import { Member } from "@prisma/client";

interface ChatItemProps {
  messageId: string;
  content: string;
  fileUrl?: string | null;
  deleted?: boolean | null;
  isUpdated: boolean;
  timestamp: string;
  socketUrl: string;
  socketQuery: Record<string, any>;
  currentMember: Member;
  member: Member;
}

const ChatItem = ({
  content,
  currentMember,
  deleted,
  fileUrl,
  isUpdated,
  member,
  messageId,
  socketQuery,
  socketUrl,
  timestamp,
}: ChatItemProps) => {
  return <div>{content}</div>;
};

export default ChatItem;
