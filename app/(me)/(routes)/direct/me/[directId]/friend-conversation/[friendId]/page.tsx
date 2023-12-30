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

interface FriendConversationPageProps {
  params: {
    directId: string;
    friendId: string;
  };
}

const FriendConversationPage = async ({
  params,
}: FriendConversationPageProps) => {
  const profile = await authProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentMemberOne = await db.member.findFirst({
    where: {
      serverId: params.directId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  const currentMemberTwo = await db.member.findFirst({
    where: {
      serverId: params.directId,
      profileId: params.friendId,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMemberOne) {
    return redirect("/");
  }

  if (!currentMemberTwo) {
    return redirect("/");
  }

  const conversation = await findOrCreateConversation(
    currentMemberOne.id,
    currentMemberTwo.id
  );

  if (!conversation) {
    return redirect(`/direct/me/${params.directId}/friend-all`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="flex flex-col items-center w-full h-full">
      <ChatHeader
        serverId={params.directId}
        type="member"
        directId={params.directId}
        member={otherMember}
      />

      <>
        <ChatMessage
          member={currentMemberOne}
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
    </div>
  );
};

export default FriendConversationPage;
