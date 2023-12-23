"use client";

import React from "react";
import UserAvatar from "../user-avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { checkFullName } from "@/lib/helper";
import { Check, Gavel, Hourglass } from "lucide-react";
import { Friend, Profile } from "@prisma/client";
import { useFriendQuery } from "@/hook/use-friend-query";
import { Skeleton } from "../ui/skeleton";
import { toast } from "../ui/use-toast";
import { useFriendSocket } from "@/hook/use-friend-socket";

interface FriendPendingProps {
  profile: Profile;
}

const FriendPending = ({ profile }: FriendPendingProps) => {
  const getFriendKey = `fri:${profile.id}`;
  const createFriendKey = `fri:${profile.id}:create`;
  const resFriendKey = `fri:${profile.id}:res`;
  const cancelFriendKey = `fri:${profile.id}:cancel`;

  const { data: friends, status } = useFriendQuery({
    friendKey: getFriendKey,
    userId: profile.id,
  });

  useFriendSocket({
    getFriendKey,
    resFriendKey,
    createFriendKey,
    cancelFriendKey,
  });

  async function handleConfirm(friendOneId: string, friendTwoId: string) {
    const res = await fetch("/api/socket/friends", {
      method: "PUT",
      body: JSON.stringify({ friendOneId, friendTwoId }),
    });
    const data = await res.json();

    if (res.ok && data.success) {
      toast({
        title: "Successfully confirm",
      });
    } else {
      toast({
        title: data.error,
      });
    }
  }

  async function handleCancel(friendOneId: string, friendTwoId: string) {
    const res = await fetch("/api/socket/friends", {
      method: "DELETE",
      body: JSON.stringify({ friendOneId, friendTwoId }),
    });
    const data = await res.json();

    if (res.ok && data.success) {
      toast({
        title: "Successfully cancel request",
      });
    } else {
      toast({
        title: data.error,
      });
    }
  }

  return (
    <ScrollArea className="flex-1 my-6">
      {status === "pending" &&
        [1, 2, 3, 4, 5, 6, 7].map((n) => (
          <Skeleton key={n} className="w-full h-[30px] my-4" />
        ))}
      {friends?.data
        ?.filter((f) => f.status === "PENDING")
        .map((friend) => {
          const f =
            friend.friendOne.id === profile.id
              ? friend.friendTwo
              : friend.friendOne;

          return (
            <div
              key={friend.id}
              className="w-full flex items-center dark:bg-zinc-900 bg-[#e8e8ea] hover:bg-[#dddde7] p-2 dark:hover:bg-zinc-800 transition-colors rounded-md gap-x-2 my-4"
            >
              <UserAvatar name={f.name} imageUrl={f.imageUrl} />
              <h2>{checkFullName(f.name)}</h2>
              {friend.friendOneId === profile.id ? (
                <Button
                  size={"sm"}
                  className="ml-4 transition-all bg-yellow-400 hover:bg-yellow-400"
                >
                  <Hourglass className="w-4 h-4 mr-1" /> Pending
                </Button>
              ) : (
                <div className="flex items-center gap-x-2 ml-4">
                  <Button
                    size={"sm"}
                    className="transition-all bg-emerald-500 hover:bg-emerald-600"
                    onClick={() =>
                      handleConfirm(friend.friendOneId, friend.friendTwoId)
                    }
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Confirm
                  </Button>
                  <Button
                    size={"sm"}
                    className="transition-all bg-red-600 hover:bg-red-700"
                    onClick={() =>
                      handleCancel(friend.friendOneId, friend.friendTwoId)
                    }
                  >
                    <Gavel className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          );
        })}
    </ScrollArea>
  );
};

export default FriendPending;
