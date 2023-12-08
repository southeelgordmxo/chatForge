import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessage from "@/components/chat/chat-messaage";
import MediaRoom from "@/components/media-room";
import { authProfile } from "@/lib/auth-profile";
import { db } from "@/lib/db.prisma";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
import { Frown } from "lucide-react";
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
    include: {
      profile: true,
    },
  });

  if (!channel || !member) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col items-center w-full h-full">
      <ChatHeader channel={channel} serverId={params.serverId} type="channel" />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessage
            socketUrl="/api/socket/messages"
            apiUrl="/api/messages"
            name={channel.name}
            type="channel"
            chatId={channel.id}
            member={member}
            paramKey="channelId"
            paramValue={channel.id}
            socketQuery={{
              channelId: channel.id,
              serverId: params.serverId,
            }}
          />
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
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <div className="text-muted-foreground text-lg flex-1 flex items-center justify-center">
          Audio channel is not support yet! <Frown />
        </div>
      )}
      {channel.type === ChannelType.VIDEO && (
        <div className="text-muted-foreground text-lg flex-1 flex items-center justify-center">
          Video channel is not support yet! <Frown />
        </div>
      )}
      {/* {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channel.id} video={false} audio={true} />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} video={true} audio={true} />
      )} */}
    </div>
  );
};

export default ChannelIDPage;
