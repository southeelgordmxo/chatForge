import { authProfile } from "@/lib/auth-profile";
import { redirectToSignIn, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import FriendAction from "./friend-action";
import { Separator } from "../ui/separator";
import { db } from "@/lib/db.prisma";

interface FriendSidebarProps {
  serverId: string;
  directId: string;
}

const FriendSidebar = async ({ serverId, directId }: FriendSidebarProps) => {
  const adminID = process.env.NEXT_PUBLIC_ADMIN_ID as string;
  const profile = await authProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const users = await db.profile.findMany({
    where: {
      NOT: [
        {
          userId: profile.userId,
        },
        {
          userId: adminID,
        },
      ],
    },
  });

  const friends = await db.friend.findMany({
    where: {
      OR: [{ friendOneId: profile.id }, { friendTwoId: profile.id }],
    },
  });

  if (!serverId) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col items-center h-full text-primary w-full dark:bg-[#1e1e22] bg-[#d5d5d7] px-2">
      <FriendAction
        users={users}
        profileId={profile.id}
        friends={friends}
        directId={directId}
      />
      <Separator className="max-w-[w-58px] h-0.5 mx-auto dark:bg-zinc-700/50 bg-zinc-600/10" />
    </div>
  );
};

export default FriendSidebar;
