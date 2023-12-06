import { Member } from "@prisma/client";
import ChatWelcomeMessage from "./chat-welcome-message";

interface ChatMessageProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, any>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "member";
}

const ChatMessage = ({
  apiUrl,
  chatId,
  member,
  name,
  paramKey,
  paramValue,
  socketQuery,
  socketUrl,
  type,
}: ChatMessageProps) => {
  return (
    <div className="w-full flex-1 flex flex-col items-center py-4 overflow-y-hidden">
      <div className="flex-1"></div>
      <div className="px-4 flex items-start w-full">
        <ChatWelcomeMessage name={name} type={type} />
      </div>
    </div>
  );
};

export default ChatMessage;
