"use client";
import { cn } from "@/lib/utils";
import { Member, MemberType, Profile, Server } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { memberIcons } from "./server-sidebar";
import UserAvatar from "../user-avatar";
import ActionTooltip from "../action-tooltip";

interface ServerMembersProps {
  member: Member & { profile: Profile };
  server: Server;
  role?: MemberType;
}

const ServerMembers = ({ member, server, role }: ServerMembersProps) => {
  const params = useParams();
  const router = useRouter();

  function onClick() {
    return router.push(`/servers/${server.id}/conversations/${member.id}`);
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-sm flex items-center group w-full hover:bg-zinc-700/50 p-[2px] transition-all",
        params.memberId === member.id && "bg-zinc-700/50"
      )}
    >
      <UserAvatar
        name={member.profile.name}
        imageUrl={member.profile.imageUrl}
        className="w-10 h-10"
      />
      <p
        className={cn(
          "font-semibold line-clamp-1  ml-2 flex items-center gap-x-[2px] text-zinc-300 group-hover:text-zinc-100",
          params.memberId === member.id && "text-zinc-100"
        )}
      >
        {member.profile.name}
        <ActionTooltip description={role ?? ""} align="center" side="top">
          {role && memberIcons[role]}
        </ActionTooltip>
      </p>
    </button>
  );
};

export default ServerMembers;
