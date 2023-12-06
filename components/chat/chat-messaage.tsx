"use client";
import { Member, Message, Profile } from "@prisma/client";
import ChatWelcomeMessage from "./chat-welcome-message";
import { useChatQuery } from "@/hook/use-chat-query";
import { Fragment } from "react";
import { Loader2, ServerCrash } from "lucide-react";
import ChatItem from "./chat-item";

type MessagesWithMembersWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

interface ChatMessageProps {
  name: string;
  member: Member & { profile: Profile };
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
  const queryKey = `chat:${chatId}`;

  const { data, status } = useChatQuery({
    apiUrl,
    paramKey,
    paramValue,
    queryKey,
  });

  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
        <h3 className="text-muted-foreground">Loading messages...</h3>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-muted-foreground" />
        <h3 className="text-muted-foreground">Something went wrong!</h3>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col items-center py-4 overflow-y-hidden">
      <div className="flex-1"></div>
      <div className="px-4 flex items-start w-full">
        <ChatWelcomeMessage name={name} type={type} />
      </div>
      <div className="flex flex-col-reverse mt-auto w-full">
        {data?.pages.map((group, i) => {
          return (
            <Fragment key={i}>
              {group?.data?.map((message: MessagesWithMembersWithProfile) => (
                <ChatItem
                  key={message.id}
                  content={message.content}
                  currentMember={member}
                  member={message.member}
                  deleted={message.deleted}
                  fileUrl={message.fileUrl}
                  isUpdated={message.updatedAt !== message.createdAt}
                  messageId={message.id}
                  socketQuery={socketQuery}
                  socketUrl={socketUrl}
                  timestamp={new Date(message.createdAt).toLocaleDateString(
                    "en-Us",
                    {
                      day: "numeric",
                      month: "numeric",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                />
              ))}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ChatMessage;
