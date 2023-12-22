"use client";

import React, { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import UserAvatar from "../user-avatar";
import { Profile } from "@prisma/client";
import { Hourglass, UserPlus } from "lucide-react";
import ActionTooltip from "../action-tooltip";
import { useModal } from "@/hook/use-modal-store";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

interface FriendCommandBoxProps {
  users?: Profile[];
}

const FriendCommandBox = ({ users }: FriendCommandBoxProps) => {
  const router = useRouter();
  const { onOpen, data } = useModal();
  const [isMounted, setIsMounted] = useState(false);
  const { profileId, friends } = data;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  async function handleOnClick(friendTwoId: string) {
    const res = await fetch("/api/friends", {
      method: "POST",
      body: JSON.stringify({ friendOneId: profileId, friendTwoId }),
    });

    const resData = await res.json();

    if (res.ok && resData.success) {
      router.refresh();
      toast({
        title: "Friend request sent.",
      });
      onOpen("addFriend", { users, profileId, friends: resData.data });
    } else {
      toast({
        title: resData.error,
      });
    }
  }

  return (
    <Command>
      <CommandInput placeholder="Find user..." />
      <CommandList>
        <CommandEmpty>No users found.</CommandEmpty>
        {users?.map((user) => (
          <CommandItem key={user.userId}>
            <UserAvatar
              name={user.name}
              imageUrl={user.imageUrl}
              className="w-10 h-10"
            />
            <h3 className="ml-2">{user.name}</h3>
            {!friends?.some(
              (friend) =>
                friend.friendOneId === user.id || friend.friendTwoId === user.id
            ) ? (
              <ActionTooltip description="Add Friend">
                <UserPlus
                  className="cursor-pointer w-5 h-5 ml-4 transition-colors hover:text-indigo-500"
                  onClick={() => handleOnClick(user.id)}
                />
              </ActionTooltip>
            ) : (
              <ActionTooltip description="Requested">
                <Hourglass className="w-5 h-5 ml-4 transition-colors hover:text-yellow-500" />
              </ActionTooltip>
            )}
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
};

export default FriendCommandBox;
