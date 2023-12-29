import { authProfile } from "@/lib/auth-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import FriendAction from "./friend-action";
import { Separator } from "../ui/separator";
import { db } from "@/lib/db.prisma";
import FriendMembers from "./friend-members";
import { ScrollArea } from "../ui/scroll-area";

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
    include: {
      friendOne: true,
      friendTwo: true,
    },
  });

  const friendMembers = friends
    .filter((f) => f.status === "FRIENDED")
    .map((f) => {
      if (f.friendOne.id === profile.id) {
        return f.friendTwo;
      } else {
        return f.friendOne;
      }
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

      {friendMembers.length > 0 && (
        <ScrollArea className="flex-1 px-2 w-full">
          <div className="my-2 flex flex-col items-start gap-y-1">
            {friendMembers.length &&
              friendMembers?.map((f) => (
                <FriendMembers key={f.id} profile={f} server={directId} />
              ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default FriendSidebar;
