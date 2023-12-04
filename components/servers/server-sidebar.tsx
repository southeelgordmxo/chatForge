import { authProfile } from "@/lib/auth-profile";
import { db } from "@/lib/db.prisma";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType, MemberType } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearchItems from "./server-search-items";
import {
  Hash,
  Headphones,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Video,
} from "lucide-react";

interface ServerSidebarProps {
  serverId: string;
}

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await authProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  // retrieve server along with channel and members data
  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const channelIcons = {
    [ChannelType.TEXT]: <Hash className="w-4 h-4 mr-2" />,
    [ChannelType.AUDIO]: <Headphones className="w-4 h-4 mr-2" />,
    [ChannelType.VIDEO]: <Video className="w-4 h-4 mr-2" />,
  };

  const memberIcons = {
    [MemberType.ADMIN]: <ShieldAlert className="w-4 h-4 mr-2 text-red-500" />,
    [MemberType.MODERATOR]: (
      <ShieldCheck className="w-4 h-4 mr-2 text-sky-500" />
    ),
    [MemberType.GUEST]: <Shield className="w-4 h-4 mr-2 " />,
  };

  if (!server) {
    return redirect("/");
  }

  // define channel types
  const textChannel = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannel = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannel = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  // retrieve members without current login user
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  const role = server?.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col items-center h-full text-primary w-full bg-[#1e1e22]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-2 w-full">
        <div className="my-4 w-full">
          <ServerSearchItems
            data={[
              {
                label: "Text channels",
                type: "channel",
                data: textChannel.map((txtCh) => {
                  return {
                    id: txtCh.id,
                    name: txtCh.name,
                    icon: channelIcons[txtCh.type],
                  };
                }),
              },
              {
                label: "Voice channels",
                type: "channel",
                data: audioChannel.map((auCh) => {
                  return {
                    id: auCh.id,
                    name: auCh.name,
                    icon: channelIcons[auCh.type],
                  };
                }),
              },
              {
                label: "Video channels",
                type: "channel",
                data: videoChannel.map((viCh) => {
                  return {
                    id: viCh.id,
                    name: viCh.name,
                    icon: channelIcons[viCh.type],
                  };
                }),
              },
              {
                label: "Members",
                type: "member",
                data: members.map((member) => {
                  return {
                    id: member.id,
                    name: member.profile.name,
                    icon: memberIcons[member.role],
                  };
                }),
              },
            ]}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
