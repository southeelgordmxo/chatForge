"use client";

import { ServerWithChannelAndMembers } from "@/type";
import { MemberType } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  ChevronDown,
  ChevronUp,
  LogOut,
  Plus,
  Settings,
  Trash,
  User,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useModal } from "@/hook/use-modal-store";

interface ServerHeaderProps {
  server: ServerWithChannelAndMembers;
  role?: MemberType;
}

const ServerHeader = ({ role, server }: ServerHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { onOpen } = useModal();
  const [isMounted, setIsMounted] = useState(false);
  const isAdmin = role === MemberType.ADMIN;
  const isModerator = isAdmin || role === MemberType.MODERATOR;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild className="focus:outline-none">
        <button className="text-base px-4 py-2 w-full flex items-center justify-between rounded-none bg-zinc-800 font-semibold border-zinc-900">
          {server.name}
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 font-medium space-y-[3px] p-0">
        {isModerator && (
          <DropdownMenuItem
            onClick={() => {
              onOpen("inviteServer", { server });
            }}
            className="text-base text-indigo-600 px-4 py-2 cursor-pointer"
          >
            Invite people
            <UserPlus className="w-5 h-5 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => {
              onOpen("editServer", { server });
            }}
            className="px-4 py-2 cursor-pointer"
          >
            Server setting
            <Settings className="w-5 h-5 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => {
              onOpen("manageMembers", { server });
            }}
            className="px-4 py-2 cursor-pointer"
          >
            Manage members
            <User className="w-5 h-5 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => {
              onOpen("createChannels", { server });
            }}
            className="px-4 py-2 cursor-pointer"
          >
            Create channel
            <Plus className="w-5 h-5 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            className="text-red-500 px-4 py-2 cursor-pointer"
            onClick={() => {
              onOpen("deleteServer", { server });
            }}
          >
            Delete Server
            <Trash className="w-5 h-5 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => {
              onOpen("leaveServer", { server });
            }}
            className="text-red-500 px-4 py-2 cursor-pointer"
          >
            Leave Server
            <LogOut className="w-5 h-5 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
