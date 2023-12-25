"use client";

import React, { useState } from "react";
import UserAvatar from "../user-avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { checkFullName } from "@/lib/helper";
import { Loader2, MessageCircle, UserX } from "lucide-react";
import { Profile } from "@prisma/client";
import { useFriendQuery } from "@/hook/use-friend-query";
import { Skeleton } from "../ui/skeleton";
import { toast } from "../ui/use-toast";
import { useFriendSocket } from "@/hook/use-friend-socket";
import ActionTooltip from "../action-tooltip";

interface FriendAllProps {
  profile: Profile;
}

const FriendAll = ({ profile }: FriendAllProps) => {
  const getFriendKey = `fri:${profile.id}`;
  const createFriendKey = `fri:${profile.id}:create`;
  const resFriendKey = `fri:${profile.id}:res`;
  const cancelFriendKey = `fri:${profile.id}:cancel`;

  const [isLoading, setIsLoading] = useState(false);
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

  async function handleCancel(friendOneId: string, friendTwoId: string) {
    try {
      setIsLoading(true);
      const res = await fetch("/api/socket/friends", {
        method: "DELETE",
        body: JSON.stringify({ friendOneId, friendTwoId }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast({
          title: "Successfully unfriend!",
        });
      } else {
        toast({
          title: data.error,
        });
      }
    } catch (e: any) {
      setIsLoading(true);
      toast({
        title: "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollArea className="flex-1 my-6">
      {status === "pending" &&
        [1, 2, 3, 4, 5, 6, 7].map((n) => (
          <Skeleton key={n} className="w-full h-[30px] my-4" />
        ))}
      {friends?.data
        ?.filter((f) => f.status === "FRIENDED")
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
              <div className="flex items-center gap-x-3 ml-auto">
                <ActionTooltip description="Chat">
                  <MessageCircle className="cursor-pointer w-6 h-6 mr-1" />
                </ActionTooltip>

                <Button
                  disabled={isLoading}
                  size={"sm"}
                  className="transition-all bg-red-600 hover:bg-red-700"
                  onClick={() =>
                    handleCancel(friend.friendOneId, friend.friendTwoId)
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4 mr-1" />
                    </>
                  ) : (
                    <>
                      <UserX className="w-4 h-4 mr-1" />
                      Unfriend
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
    </ScrollArea>
  );
};

export default FriendAll;
