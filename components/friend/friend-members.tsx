"use client";
import { cn } from "@/lib/utils";
import { Profile } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import UserAvatar from "../user-avatar";
import { checkFullName } from "@/lib/helper";

interface FriendMembersProps {
  profile: Profile;
  server: string;
}

const FriendMembers = ({ profile, server }: FriendMembersProps) => {
  const router = useRouter();
  const params = useParams();

  function onClick() {
    return router.push(
      `/direct/me/${server}/friend-conversation/${profile.id}`
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-sm flex items-center group w-full dark:hover:bg-zinc-700/50 hover:bg-zinc-400/50  p-[4px] px-2 transition-all",
        params?.friendId === profile.id && "dark:bg-zinc-700/50 bg-zinc-400/50"
      )}
    >
      <UserAvatar
        name={profile.name}
        imageUrl={profile.imageUrl}
        className="w-10 h-10 "
      />
      <p
        className={cn(
          "ml-1 font-semibold line-clamp-1 flex items-center dark:text-zinc-300 text-zinc-800  dark:group-hover:text-zinc-100 group-hover:text-zinc-700",
          params?.friendId === profile.id && "dark:text-zinc-100 text-zinc-700"
        )}
      >
        {checkFullName(profile.name)}
      </p>
    </button>
  );
};

export default FriendMembers;
