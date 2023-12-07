import {
  Channel,
  ChannelType,
  Member,
  MemberType,
  Profile,
} from "@prisma/client";
import {
  Hash,
  Headphones,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Video,
} from "lucide-react";
import MobileToggle from "../mobile-toggle";
import UserAvatar from "../user-avatar";
import SocketIndicator from "../socket-indicator";
import { checkFullName } from "@/lib/helper";

interface ChatHeaderProps {
  serverId: string;
  type: "channel" | "member";
  channel?: Channel;
  member?: Member & { profile: Profile };
}

const channelIcons = {
  [ChannelType.TEXT]: (
    <Hash className="font-semibold text-zinc-700 dark:text-zinc-300  w-6  h-6 mr-2" />
  ),
  [ChannelType.AUDIO]: (
    <Headphones className="font-semibold text-zinc-700 dark:text-zinc-300  w-6  h-6 mr-2" />
  ),
  [ChannelType.VIDEO]: (
    <Video className="font-semibold text-zinc-700 dark:text-zinc-300  w-6  h-6 mr-2" />
  ),
};

const memberIcons = {
  [MemberType.ADMIN]: <ShieldAlert className="w-4 h-4 ml-1 text-red-500" />,
  [MemberType.MODERATOR]: <ShieldCheck className="w-4 h-4 ml-1 text-sky-500" />,
  [MemberType.GUEST]: <Shield className="w-4 h-4 ml-1 " />,
};

const ChatHeader = ({ channel, serverId, type, member }: ChatHeaderProps) => {
  return (
    <div className="px-3 flex items-center gap-x-3 h-12 w-full font-semibold border-b border-b-neutral-700">
      <MobileToggle serverId={serverId} />
      <p className="text-[19px] font-semibold flex items-center">
        {type === "channel" && channel && channelIcons[channel?.type]}
        {type === "member" && member && (
          <UserAvatar
            imageUrl={member.profile.imageUrl}
            name={member.profile.name}
            className="w-10 h-10 rounded-full"
          />
        )}
        {channel && channel?.name}

        {member && (
          <p className="ml-2 flex items-center">
            {member && member.profile && checkFullName(member.profile.name)}
            {member && memberIcons[member.role]}
          </p>
        )}
      </p>

      <div className="ml-auto">
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;
