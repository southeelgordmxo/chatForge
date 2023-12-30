import FriendAll from "@/components/friend/friend-all";
import FriendHeader from "@/components/friend/friend-header";
import { authProfile } from "@/lib/auth-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { LucideUsers } from "lucide-react";

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
      <FriendHeader directId={params.directId} serverId={params.directId} />

      <h2 className="mt-4 flex items-center gap-2">
        <LucideUsers className="w-5 h-5" /> Friends
      </h2>

      <FriendAll profile={profile} directId={params.directId} />
    </div>
  );
};

export default AllFriendsPage;
