import ChatHeader from "@/components/chat/chat-header";
import { authProfile } from "@/lib/auth-profile";
import { findOrCreateConversation } from "@/lib/conversation";
import { db } from "@/lib/db.prisma";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIDPageProps {
  params: {
    serverId: string;
    memberId: string;
  };
}

const MemberIDPage = async ({ params }: MemberIDPageProps) => {
  const profile = await authProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentUser = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentUser) {
    return redirect("/");
  }

  const conversation = await findOrCreateConversation(
    currentUser.id,
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
    </div>
  );
};

export default MemberIDPage;
