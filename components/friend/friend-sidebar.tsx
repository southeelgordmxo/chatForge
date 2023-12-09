import { authProfile } from "@/lib/auth-profile";
import { findFriend } from "@/lib/find-friend";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface FriendSidebarProps {
  directMessageName: string;
}

const FriendSidebar = async ({ directMessageName }: FriendSidebarProps) => {
  const profile = await authProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const friends = await findFriend(profile.userId);

  if (!directMessageName) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col items-center h-full text-primary w-full dark:bg-[#1e1e22] bg-[#d5d5d7]">
      {friends?.map((fri) => {
        if (fri.friendOneId !== profile.userId) {
          return <div key={fri.id}>{fri.friendOne.name}</div>;
        }
        if (fri.friendTwoId !== profile.userId) {
          return <div key={fri.id}>{fri.friendTwo.name}</div>;
        }
      })}
    </div>
  );
};

export default FriendSidebar;
