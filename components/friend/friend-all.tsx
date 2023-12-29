"use client";

import React from "react";
import UserAvatar from "../user-avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { checkFullName } from "@/lib/helper";
import { MessageCircle, UserX } from "lucide-react";
import { Profile } from "@prisma/client";
import { useFriendQuery } from "@/hook/use-friend-query";
import { Skeleton } from "../ui/skeleton";
import { useFriendSocket } from "@/hook/use-friend-socket";
import ActionTooltip from "../action-tooltip";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useModal } from "@/hook/use-modal-store";

interface FriendAllProps {
  profile: Profile;
  directId?: string;
}

const FriendAll = ({ profile, directId }: FriendAllProps) => {
  const getFriendKey = `fri:${profile.id}`;
  const createFriendKey = `fri:${profile.id}:create`;
  const resFriendKey = `fri:${profile.id}:res`;
  const cancelFriendKey = `fri:${profile.id}:cancel`;

  const { onOpen } = useModal();
  const router = useRouter();
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

  if (friends?.data.filter((f) => f.status === "FRIENDED").length) {
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
                    <MessageCircle
                      className="cursor-pointer w-6 h-6 mr-1"
                      onClick={() =>
                        router.push(
                          `/direct/me/${directId}/friend-conversation/${f.id}`
                        )
                      }
                    />
                  </ActionTooltip>

                  <Button
                    size={"sm"}
                    className="transition-all bg-red-600 hover:bg-red-700"
                    onClick={() =>
                      onOpen("unFriend", {
                        unfriends: {
                          friendOneId: friend.friendOneId,
                          friendTwoId: friend.friendTwoId,
                        },
                      })
                    }
                  >
                    <UserX className="w-4 h-4 mr-1" />
                    Unfriend
                  </Button>
                </div>
              </div>
            );
          })}
      </ScrollArea>
    );
  } else {
    return (
      <div className="flex-1 my-12 md:my-28 flex justify-center items-center flex-col ">
        <Image src={"/koala1.png"} alt="koala image" width={200} height={150} />
        <h2 className="mt-4 text-muted-foreground">No friends yet!</h2>
      </div>
    );
  }
};

export default FriendAll;
