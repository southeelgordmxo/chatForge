"use client";
import { useFriendQuery } from "@/hook/use-friend-query";
import { useModal } from "@/hook/use-modal-store";
import { cn } from "@/lib/utils";
import { Friend, Profile } from "@prisma/client";
import { ActivitySquare, Hourglass, UserPlus, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface FriendActionProps {
  users: Profile[];
  profileId: string;
  friends?: Friend[];
  directId: string;
}

const FriendAction = ({ users, profileId, directId }: FriendActionProps) => {
  const getFriendKey = `fri:${profileId}`;

  const router = useRouter();
  const path = usePathname();
  const currentPath = path?.split("/")[4];
  const { onOpen } = useModal();

  const { data: friends, status } = useFriendQuery({
    friendKey: getFriendKey,
    userId: profileId,
  });

  return (
    <div className="flex flex-col jun w-full gap-y-2 my-3 ">
      <button
        className={cn(
          "w-full flex items-center justify-between dark:bg-zinc-800 bg-[#cacacf] hover:bg-[#bcbcc9] p-2 dark:hover:bg-zinc-700 transition-colors rounded-md"
        )}
        onClick={() =>
          onOpen("addFriend", {
            users,
            profileId,
            friends: friends?.data,
            status,
          })
        }
      >
        {" "}
        <UserPlus className="w-5 h-5" /> Add friend
      </button>
      <button
        className={cn(
          "w-full flex items-center justify-between dark:bg-zinc-800 bg-[#cacacf] hover:bg-[#bcbcc9] p-2 dark:hover:bg-zinc-700 transition-colors rounded-md",
          currentPath === "friend-all" && "bg-[#bcbcc9]  dark:bg-zinc-700"
        )}
        onClick={() => router.push(`/direct/me/${directId}/friend-all`)}
      >
        <Users className="w-5 h-5" /> All friends
      </button>
      <button
        className={cn(
          "w-full flex items-center justify-between dark:bg-zinc-800 bg-[#cacacf] hover:bg-[#bcbcc9] p-2 dark:hover:bg-zinc-700 transition-colors rounded-md",
          currentPath === "online-friends" && "bg-[#bcbcc9]  dark:bg-zinc-700"
        )}
        onClick={() => router.push(`/direct/me/${directId}/online-friends`)}
      >
        <ActivitySquare className="w-5 h-5" /> Online friends
      </button>
      <button
        className={cn(
          "w-full flex items-center justify-between dark:bg-zinc-800 bg-[#cacacf] hover:bg-[#bcbcc9] p-2 dark:hover:bg-zinc-700 transition-colors rounded-md",
          currentPath === "pending-friends" && "bg-[#bcbcc9]  dark:bg-zinc-700"
        )}
        onClick={() => router.push(`/direct/me/${directId}/pending-friends`)}
      >
        <Hourglass className="w-5 h-5" /> Pending friends
      </button>
    </div>
  );
};

export default FriendAction;
