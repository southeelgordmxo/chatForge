import FriendPending from "@/components/friend/friend-pending";
import { authProfile } from "@/lib/auth-profile";
import { redirectToSignIn } from "@clerk/nextjs";

import React from "react";

const PendingFriendsPage = async () => {
  const profile = await authProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  return (
    <div className="flex flex-col px-5 py-3">
      <h2>Friends status</h2>

      <FriendPending profile={profile} />
    </div>
  );
};

export default PendingFriendsPage;
