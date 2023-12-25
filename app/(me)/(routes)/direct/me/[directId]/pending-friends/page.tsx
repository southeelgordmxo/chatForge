import FriendPending from "@/components/friend/friend-pending";
import { authProfile } from "@/lib/auth-profile";
import { redirectToSignIn } from "@clerk/nextjs";

import React from "react";

interface PendingFriendsPageProps {
  params: {
    directId: string;
  };
}

const PendingFriendsPage = async ({ params }: PendingFriendsPageProps) => {
  const profile = await authProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  return (
    <div className="flex flex-col px-5 py-3">
      <h2>Friends status</h2>

      <FriendPending profile={profile} directId={params.directId} />
    </div>
  );
};

export default PendingFriendsPage;
