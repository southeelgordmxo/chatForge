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
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import { Separator } from "../ui/separator";
import ServerMembers from "./server-member";

interface ServerSidebarProps {
  serverId: string;
}

export enum ChannelLabel {
  TEXT_CHANNEL = "Text channels",
  VOICE_CHANNEL = "Voice channels",
  VIDEO_CHANNEL = "Video channels",
  MEMBERS = "Members",
}

export const channelIcons = {
  [ChannelType.TEXT]: <Hash className="w-4 h-4 mr-2" />,
  [ChannelType.AUDIO]: <Headphones className="w-4 h-4 mr-2" />,
  [ChannelType.VIDEO]: <Video className="w-4 h-4 mr-2" />,
};

export const memberIcons = {
  [MemberType.ADMIN]: <ShieldAlert className="w-4 h-4 mr-2 text-red-500" />,
  [MemberType.MODERATOR]: <ShieldCheck className="w-4 h-4 mr-2 text-sky-500" />,
  [MemberType.GUEST]: <Shield className="w-4 h-4 mr-2 " />,
};

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
    <div className="flex flex-col items-center h-full text-primary w-full dark:bg-[#1e1e22] bg-[#d5d5d7]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-2 w-full">
        <div className="my-4 w-full">
          <ServerSearchItems
            data={[
              {
                label: ChannelLabel.TEXT_CHANNEL,
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
                label: ChannelLabel.VOICE_CHANNEL,
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
                label: ChannelLabel.VIDEO_CHANNEL,
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
                label: ChannelLabel.MEMBERS,
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
        <Separator className="max-w-[w-58px] h-0.5 mx-auto dark:bg-zinc-700/50 bg-zinc-600/10" />
        {!!textChannel.length && (
          <div className="mb-3 mt-2">
            <ServerSection
              channelType={ChannelType.TEXT}
              label={ChannelLabel.TEXT_CHANNEL}
              role={role}
              sectionType={"channel"}
              server={server}
            />
            <div className="my-2 flex flex-col items-start gap-y-1">
              {textChannel.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioChannel.length && (
          <div className="mb-3 mt-2">
            <ServerSection
              channelType={ChannelType.AUDIO}
              label={ChannelLabel.VOICE_CHANNEL}
              role={role}
              sectionType={"channel"}
              server={server}
            />
            <div className="my-2 flex flex-col items-start gap-y-1">
              {audioChannel.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoChannel.length && (
          <div className="mb-3 mt-2">
            <ServerSection
              channelType={ChannelType.VIDEO}
              label={ChannelLabel.VIDEO_CHANNEL}
              role={role}
              sectionType={"channel"}
              server={server}
            />
            <div className="my-2 flex flex-col items-start gap-y-1">
              {videoChannel.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!members.length && (
          <div className="mb-3 mt-2">
            <ServerSection
              server={server}
              label={ChannelLabel.MEMBERS}
              role={role}
              sectionType={"member"}
            />
            <div className="my-2 flex flex-col items-start gap-y-1">
              {members.map((member) => (
                <ServerMembers
                  key={member.id}
                  member={member}
                  server={server}
                  role={member.role}
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
