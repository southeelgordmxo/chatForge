import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessage from "@/components/chat/chat-messaage";
import MediaRoom from "@/components/media-room";
import { authProfile } from "@/lib/auth-profile";
import { findOrCreateConversation } from "@/lib/conversation";
import { db } from "@/lib/db.prisma";
import { checkFullName } from "@/lib/helper";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIDPageProps {
  params: {
    serverId: string;
    memberId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

const MemberIDPage = async ({ params, searchParams }: MemberIDPageProps) => {
  const profile = await authProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await findOrCreateConversation(
    currentMember.id,
    params.memberId
  );

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="flex flex-col items-center w-full h-full">
      <ChatHeader
        serverId={params.serverId}
        type="member"
        member={otherMember}
      />
      {!searchParams?.video && (
        <>
          <ChatMessage
            member={currentMember}
            name={otherMember.profile.name}
            type="member"
            apiUrl="/api/direct-messages"
            chatId={conversation.id}
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <div className="w-full py-2">
            <ChatInput
              name={checkFullName(otherMember.profile.name)}
              type="member"
              apiUrl="/api/socket/direct-messages"
              query={{
                conversationId: conversation.id,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MemberIDPage;
