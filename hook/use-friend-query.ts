"use client";
import { useSocket } from "@/components/providers/socket-provider";
import { FriendsWithFriendOneAndFriendTwo } from "@/type";
import { useQuery } from "@tanstack/react-query";

interface ChatQueryProps {
  friendKey: string;
  userId: string;
}

export function useFriendQuery({ friendKey, userId }: ChatQueryProps) {
  const { isConnected } = useSocket();

  async function fetchFriendFun(): Promise<{
    success: boolean;
    data: FriendsWithFriendOneAndFriendTwo;
  }> {
    const res = await fetch(`/api/socket/friends?userId=${userId}`, {});
    return res.json();
  }

  // pagination
  const { data, status } = useQuery({
    queryKey: [friendKey],
    queryFn: fetchFriendFun,
    refetchInterval: isConnected ? false : 1000,
  });

  return {
    data,
    status,
  };
}
