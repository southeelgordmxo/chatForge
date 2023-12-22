"use client";
import { Member, Profile } from "@prisma/client";
import ChatWelcomeMessage from "./chat-welcome-message";
import { useChatQuery } from "@/hook/use-chat-query";
import { Fragment, useRef } from "react";
import { Loader2, ServerCrash } from "lucide-react";
import ChatItem from "./chat-item";
import { MessageWithMemberWithProfile } from "@/type";
import { useChatSocket } from "@/hook/use-chat-socket";
import { useChatScroll } from "./chat-scroll";

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
  const topChatRef = useRef<HTMLDivElement | null>(null);
  const bottomChatRef = useRef<HTMLDivElement | null>(null);

  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:updated`;

  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useChatQuery({
      apiUrl,
      paramKey,
      paramValue,
      queryKey,
    });

  useChatSocket({
    addKey,
    queryKey,
    updateKey,
  });

  useChatScroll({
    topChatRef,
    bottomChatRef,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    loadMoreMessages: fetchNextPage,
    count: data?.pages?.[0]?.data?.length ?? 0,
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
    <div
      ref={topChatRef}
      className="w-full flex-1 flex flex-col items-center py-4 overflow-y-auto"
    >
      {!hasNextPage && <div className="flex-1"></div>}
      {!hasNextPage && (
        <div className="px-4 flex items-start w-full">
          <ChatWelcomeMessage name={name} type={type} />
        </div>
      )}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-7 w-7 animate-spin text-muted-foreground mb-3" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className=" text-muted-foreground mb-3 transition-colors dark:hover:text-zinc-300 hover:text-zinc-800"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto w-full">
        {data?.pages.map((group, i) => {
          return (
            <Fragment key={i}>
              {group?.data?.map((message: MessageWithMemberWithProfile) => (
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
      <div ref={bottomChatRef} />
    </div>
  );
};

export default ChatMessage;
