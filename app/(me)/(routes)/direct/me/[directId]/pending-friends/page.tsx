import FriendPending from "@/components/friend/friend-pending";
import { authProfile } from "@/lib/auth-profile";
import { db } from "@/lib/db.prisma";
import { redirectToSignIn } from "@clerk/nextjs";
import { FriendStatus } from "@prisma/client";

import React from "react";

const PendingFriends = async () => {
  const profile = await authProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const friends = await db.friend.findMany({
    where: {
      OR: [{ friendOneId: profile.id }, { friendTwoId: profile.id }],
      status: FriendStatus["PENDING"],
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

      <FriendPending profile={profile} />
    </div>
  );
};

export default PendingFriends;
