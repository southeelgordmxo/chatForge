import { Channel, ChannelType, Member } from "@prisma/client";
import { Hash, Headphones, Video } from "lucide-react";
import MobileToggle from "../mobile-toggle";

interface ChatHeaderProps {
  serverId: string;
  type: "channel" | "member";
  channel?: Channel;
  member?: Member;
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

const ChatHeader = ({ channel, serverId, type }: ChatHeaderProps) => {
  return (
    <div className="px-3 flex items-center gap-x-3 h-12 w-full bg-zinc-800 font-semibold">
      <MobileToggle serverId={serverId} />
      <p className="text-[19px] font-semibold flex items-center">
        {type === "channel" && channel && channelIcons[channel?.type]}
        {channel?.name}
      </p>
    </div>
  );
};

export default ChatHeader;
