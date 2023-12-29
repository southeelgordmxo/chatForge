"use client";
import { useSocket } from "@/components/providers/socket-provider";
import { FriendsWithFriendOneAndFriendTwo } from "@/type";
import { Friend } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  getFriendKey: string;
  resFriendKey: string;
  createFriendKey: string;
  cancelFriendKey: string;
};

export function useFriendSocket({
  getFriendKey,
  resFriendKey,
  createFriendKey,
  cancelFriendKey,
}: ChatSocketProps) {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    // res friend relationship
    socket.on(resFriendKey, (friend: FriendsWithFriendOneAndFriendTwo) => {
      queryClient.setQueryData([getFriendKey], (oldData: any) => {
        if (!oldData || !oldData.data || oldData.data.length === 0) {
          return oldData;
        }

        const newData = oldData.data.map(
          (f: FriendsWithFriendOneAndFriendTwo) => {
            if (f.id === friend.id) {
              return friend;
            }
            return f;
          }
        );

        const newResult = {
          data: newData,
        };

        return newResult;
      });
    });

    // cancel friend relationship
    socket.on(cancelFriendKey, (friend: Friend) => {
      queryClient.setQueryData([getFriendKey], (oldData: any) => {
        if (!oldData || !oldData.data || oldData.data.length === 0) {
          return oldData;
        }

        const newData = oldData.data.filter(
          (f: FriendsWithFriendOneAndFriendTwo) => f.id !== friend.id
        );

        const newResult = {
          data: newData,
        };

        return newResult;
      });
    });

    // create new friend relationship
    socket.on(createFriendKey, (friend: FriendsWithFriendOneAndFriendTwo) => {
      queryClient.setQueryData([getFriendKey], (oldData: any) => {
        if (!oldData || !oldData.data || oldData.data.length === 0) {
          return {
            data: [friend],
          };
        }

        const newData = [...oldData.pages];
        newData[0] = {
          ...newData[0],
          data: [friend, ...newData[0].data],
        };

        const newResult = {
          ...oldData,
          pages: newData,
        };

        return newResult;
      });
    });

    return () => {
      socket.off(resFriendKey);
      socket.off(createFriendKey);
      socket.off(cancelFriendKey);
    };
  }, [
    socket,
    getFriendKey,
    queryClient,
    resFriendKey,
    createFriendKey,
    cancelFriendKey,
  ]);
}
