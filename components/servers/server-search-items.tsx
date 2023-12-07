"use client";

import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { checkFullName } from "@/lib/helper";
import { useParams, useRouter } from "next/navigation";
import { ChannelLabel } from "./server-sidebar";

interface ServerSearchItemsProps {
  data: {
    label: ChannelLabel;
    type: "channel" | "member";
    data: {
      id: string;
      icon: React.ReactNode;
      name: string;
    }[];
  }[];
}

const ServerSearchItems = ({ data }: ServerSearchItemsProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    setIsMounted(true);
    // keyboard key event to open search items
    function down(e: KeyboardEvent) {
      if (e.key === "q" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((isOpen) => !isOpen);
      }
    }

    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
    };
  }, []);

  function handleClick({
    id,
    type,
  }: {
    id: string;
    type: "member" | "channel";
  }) {
    if (type === "channel") {
      setIsOpen(false);
      return router.push(`/servers/${params?.serverId}/channels/${id}`);
    }
    if (type === "member") {
      setIsOpen(false);
      return router.push(`/servers/${params?.serverId}/conversations/${id}`);
    }
  }

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <button
        className="w-full flex items-center justify-between dark:bg-zinc-800 bg-[#cacacf] hover:bg-[#bcbcc9] p-2 dark:hover:bg-zinc-700 transition-colors rounded-md"
        onClick={() => setIsOpen(true)}
      >
        <Search className="w-4 h-4 " />
        <p className="font-semibold">
          Search
          <kbd className="ml-1 rounded-md p-1 dark:bg-zinc-800 bg-zinc-300">
            <small className="text-xs">ctrl + q</small>
          </kbd>
        </p>
      </button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder="Search all channels and members" />
        <CommandList>
          <CommandEmpty>No results found!</CommandEmpty>
          {data.length &&
            data.map(({ label, data, type }) => {
              if (!data.length) {
                return null;
              }
              return (
                <CommandGroup key={label} heading={label}>
                  {data.map((item) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() => {
                        handleClick({
                          id: item.id,
                          type,
                        });
                      }}
                      className="cursor-pointer"
                    >
                      {item.icon}
                      <span>{checkFullName(item.name)}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default ServerSearchItems;
