"use client";
import { useSocket } from "@/components/providers/socket-provider";
import type { MessageWithMemberWithProfile } from "@/type";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  addKey: string;
  queryKey: string;
  updateKey: string;
};

export function useChatSocket({
  addKey,
  queryKey,
  updateKey,
}: ChatSocketProps) {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            data: page.data.map((item: MessageWithMemberWithProfile) => {
              if (item.id === message.id) {
                return message;
              }
              return item;
            }),
          };
        });

        const newResult = {
          ...oldData,
          pages: newData,
        };

        return newResult;
      });
    });

    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                data: [message],
              },
            ],
          };
        }

        const newData = [...oldData.pages];
        newData[0] = {
          ...newData[0],
          data: [message, ...newData[0].data],
        };

        const newResult = {
          ...oldData,
          pages: newData,
        };
        return newResult;
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [socket, addKey, queryClient, queryKey, updateKey]);
}
