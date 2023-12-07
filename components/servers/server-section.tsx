"use client";

import { ChannelType, MemberType, Server } from "@prisma/client";
import { ChannelLabel } from "./server-sidebar";
import ActionTooltip from "../action-tooltip";
import { Plus, UserCog } from "lucide-react";
import { useModal } from "@/hook/use-modal-store";

interface ServerSectionProps {
  sectionType: "channel" | "member";
  channelType?: ChannelType;
  role?: MemberType;
  label: ChannelLabel;
  server?: Server;
}

const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModal();
  return (
    <div className="flex items-center p-2">
      <h3 className="font-semibold">{label}</h3>
      {role !== MemberType.GUEST && sectionType === "channel" && (
        <ActionTooltip
          description="Create channel"
          side={"top"}
          align={"center"}
        >
          <Plus
            className="ml-auto cursor-pointer hover:text-indigo-500"
            onClick={() => onOpen("createChannels", { channelType, server })}
          />
        </ActionTooltip>
      )}
      {role === MemberType.ADMIN && sectionType === "member" && (
        <ActionTooltip
          description="Manage members"
          side={"top"}
          align={"center"}
        >
          <UserCog
            className="ml-auto cursor-pointer transition-colors hover:text-indigo-500"
            onClick={() => onOpen("manageMembers", { server })}
          />
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
