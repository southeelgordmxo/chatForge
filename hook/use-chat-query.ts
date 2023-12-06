"use client";
import { useSocket } from "@/components/providers/socket-provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

export function useChatQuery({
  apiUrl,
  paramKey,
  paramValue,
  queryKey,
}: ChatQueryProps) {
  const { isConnected } = useSocket();

  async function fetchMessageFun({
    pageParam,
  }: {
    pageParam: undefined | string | null;
  }) {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    );

    const res = await fetch(url);
    return res.json();
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      initialPageParam: null,
      queryKey: [queryKey],
      queryFn: fetchMessageFun,
      getNextPageParam: (lastPage) => lastPage?.nextCursor || null,
      refetchInterval: isConnected ? false : 1000,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
}
