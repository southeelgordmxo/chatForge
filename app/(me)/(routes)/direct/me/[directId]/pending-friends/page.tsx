import { ScrollArea } from "@/components/ui/scroll-area";
import UserAvatar from "@/components/user-avatar";
import { authProfile } from "@/lib/auth-profile";
import { db } from "@/lib/db.prisma";
import { redirectToSignIn } from "@clerk/nextjs";
import React from "react";

const PendingFriends = async () => {
  const profile = await authProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const friends = await db.friend.findMany({
    where: {
      OR: [{ friendOneId: profile.id }, { friendTwoId: profile.id }],
    },
    include: {
      friendOne: true,
      friendTwo: true,
    },
  });

  return (
    <div className="flex flex-col px-5 py-3">
      <h2>
        Pending {friends.length > 1 ? "friends" : "friend"}: {friends.length}
      </h2>

      <ScrollArea className="flex-1 my-6">
        {friends?.map((friend) => {
          const f =
            friend.friendOne.id === profile.id
              ? friend.friendTwo
              : friend.friendOne;

          return (
            <div key={friend.id}>
              <UserAvatar name={f.name} imageUrl={f.imageUrl} />
              <h2>{f.name}</h2>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
};

export default PendingFriends;
