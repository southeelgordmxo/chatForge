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
import { FriendStatus, Profile } from "@prisma/client";
import { Hourglass, User, UserPlus } from "lucide-react";
import ActionTooltip from "../action-tooltip";
import { useModal } from "@/hook/use-modal-store";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { checkFullName } from "@/lib/helper";
import { Skeleton } from "../ui/skeleton";

interface FriendCommandBoxProps {
  users?: Profile[];
  status?: "error" | "success" | "pending";
}

const FriendCommandBox = ({ users, status }: FriendCommandBoxProps) => {
  const router = useRouter();
  const { onOpen, data, onClose } = useModal();
  const [isMounted, setIsMounted] = useState(false);
  const { profileId, friends = [] } = data;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  async function handleOnClick(friendTwoId: string) {
    const res = await fetch("/api/socket/friends", {
      method: "POST",
      body: JSON.stringify({ friendOneId: profileId, friendTwoId }),
    });

    const resData = await res.json();

    if (res.ok && resData.success) {
      router.refresh();
      toast({
        title: "Friend request sent.",
      });
      onClose();
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
        {status === "pending"
          ? [1, 2, 3].map((n) => (
              <Skeleton key={n} className="w-full h-[40px]" />
            ))
          : users?.map((user) => (
              <CommandItem key={user.userId}>
                <UserAvatar
                  name={user.name}
                  imageUrl={user.imageUrl}
                  className="w-10 h-10"
                />
                <h3 className="ml-2">{checkFullName(user.name)}</h3>
                {friends &&
                !friends?.some(
                  (friend) =>
                    friend.friendOneId === user.id ||
                    friend.friendTwoId === user.id
                ) ? (
                  <ActionTooltip description="Add Friend">
                    <UserPlus
                      className="cursor-pointer w-5 h-5 ml-4 transition-colors hover:text-emerald-500"
                      onClick={() => handleOnClick(user.id)}
                    />
                  </ActionTooltip>
                ) : friends?.some(
                    (friend) => friend.status === FriendStatus["FRIENDED"]
                  ) ? (
                  <ActionTooltip description="Friend">
                    <User className="w-5 h-5 ml-4 transition-colors text-indigo-500" />
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
