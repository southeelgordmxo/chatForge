"use client";

import { useEffect, useState } from "react";

type ChatScrollProps = {
  topChatRef: React.RefObject<HTMLDivElement>;
  bottomChatRef: React.RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadMoreMessages: () => void;
  count: number;
};

export function useChatScroll({
  bottomChatRef,
  count,
  loadMoreMessages,
  shouldLoadMore,
  topChatRef,
}: ChatScrollProps) {
  const [hasInitialized, setHasInitialized] = useState(false);
  // useEffect for scroll top to load more messages if have previous messages to view
  useEffect(() => {
    const topDiv = topChatRef?.current;

    function handScroll() {
      const scrollTop = topDiv?.scrollTop;

      if (scrollTop === 0 && shouldLoadMore) {
        loadMoreMessages();
      }
    }
    topDiv?.addEventListener("scroll", handScroll);

    return () => {
      topDiv?.removeEventListener("scroll", handScroll);
    };
  }, [loadMoreMessages, shouldLoadMore, topChatRef]);

  useEffect(() => {
    const bottomDiv = bottomChatRef?.current;
    const topDiv = topChatRef?.current;

    function shouldAutoScrollToBottom() {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }

      if (!topDiv) {
        return false;
      }

      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

      return distanceFromBottom <= 100;
    }

    if (shouldAutoScrollToBottom()) {
      if (!bottomChatRef?.current) {
        return;
      }
      setHasInitialized(false);

      setTimeout(() => {
        bottomChatRef?.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 150);
    }
  }, [bottomChatRef, topChatRef, hasInitialized, count]);
}
