"use client";
import { cn } from "@/lib/utils";
import { Member, MemberType, Profile, Server } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { memberIcons } from "./server-sidebar";
import UserAvatar from "../user-avatar";
import ActionTooltip from "../action-tooltip";
import { checkFullName } from "@/lib/helper";

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
        "rounded-sm flex items-center group w-full dark:hover:bg-zinc-700/50 hover:bg-zinc-400/50  p-[4px] px-2 transition-all",
        params?.memberId === member.id && "dark:bg-zinc-700/50 bg-zinc-400/50"
      )}
    >
      <UserAvatar
        name={member.profile.name}
        imageUrl={member.profile.imageUrl}
        className="w-10 h-10 "
      />
      <p
        className={cn(
          "ml-1 font-semibold line-clamp-1 flex items-center dark:text-zinc-300 text-zinc-800  dark:group-hover:text-zinc-100 group-hover:text-zinc-700",
          params?.memberId === member.id && "dark:text-zinc-100 text-zinc-700"
        )}
      >
        {checkFullName(member.profile.name)}
        <ActionTooltip description={role ?? ""} align="center" side="top">
          {role && memberIcons[role]}
        </ActionTooltip>
      </p>
    </button>
  );
};

export default ServerMembers;
