import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import { authProfile } from "@/lib/auth-profile";
import { db } from "@/lib/db.prisma";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ChannelIDPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIDPage = async ({ params }: ChannelIDPageProps) => {
  const profile = await authProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.serverId) {
    return redirect("/");
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
      serverId: params.serverId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: params.serverId,
    },
  });

  if (!channel || !member) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col items-center w-full h-full">
      <ChatHeader channel={channel} serverId={params.serverId} type="channel" />
      <div className="flex-1">This is chat playground</div>
      <div className="w-full py-2">
        <ChatInput
          type="channel"
          name={channel.name}
          query={{
            serverId: params.serverId,
            channelId: params.channelId,
          }}
          apiUrl="/api/socket/messages"
        />
      </div>
    </div>
  );
};

export default ChannelIDPage;
