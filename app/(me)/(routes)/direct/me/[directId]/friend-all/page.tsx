import FriendAll from "@/components/friend/friend-all";
import { authProfile } from "@/lib/auth-profile";
import { redirectToSignIn } from "@clerk/nextjs";

import React from "react";

interface AllFriendsPageProps {
  params: {
    directId: string;
  };
}

const AllFriendsPage = async ({ params }: AllFriendsPageProps) => {
  const profile = await authProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  return (
    <div className="flex flex-col px-5 py-3">
      <h2>All Friends</h2>

      <FriendAll profile={profile} directId={params.directId} />
    </div>
  );
};

export default AllFriendsPage;
