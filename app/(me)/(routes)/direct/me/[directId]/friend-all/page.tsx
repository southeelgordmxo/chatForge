import FriendAll from "@/components/friend/friend-all";
import { authProfile } from "@/lib/auth-profile";
import { redirectToSignIn } from "@clerk/nextjs";

import React from "react";

const AllFriendsPage = async () => {
  const profile = await authProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  return (
    <div className="flex flex-col px-5 py-3">
      <h2>All Friends</h2>

      <FriendAll profile={profile} />
    </div>
  );
};

export default AllFriendsPage;
