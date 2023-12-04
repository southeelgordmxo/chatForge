"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldQuestion,
  UserRoundCog,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useModal } from "@/hook/use-modal-store";
import { ServerWithChannelAndMembers } from "@/type";
import { ScrollArea } from "../ui/scroll-area";
import UserItem from "../user-item";
import ActionTooltip from "../action-tooltip";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useToast } from "../ui/use-toast";
import { MemberType } from "@prisma/client";

const ManageMembersModal = () => {
  const [loadingId, setLoadingId] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { isOpen, onClose, type, onOpen, data } = useModal();
  const { server } = data as { server: ServerWithChannelAndMembers };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isModalOpen = isOpen && type === "manageMembers";

  async function onRoleChange({
    memberId,
    serverId,
    role,
  }: {
    memberId: string;
    serverId: string;
    role: MemberType;
  }) {
    try {
      setLoadingId(memberId);
      const resServer = await fetch(`/api/members/${memberId}/${serverId}`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
        cache: "no-cache",
      });
      const dataServer = await resServer.json();

      if (resServer.ok && dataServer.success) {
        router.refresh();
        onOpen("manageMembers", { server: dataServer.data });
        toast({ title: `Successfully change role` });
      } else {
        toast({ title: dataServer.error });
      }
    } catch (e: any) {
      setLoadingId(memberId);
      toast({ title: e.message });
    } finally {
      setLoadingId("");
    }
  }
  async function onKickMembers({
    memberId,
    serverId,
  }: {
    memberId: string;
    serverId: string;
  }) {
    try {
      setLoadingId(memberId);
      const resServer = await fetch(`/api/members/${memberId}/${serverId}`, {
        method: "DELETE",
        cache: "no-cache",
      });
      const dataServer = await resServer.json();

      if (resServer.ok && dataServer.success) {
        router.refresh();
        onOpen("manageMembers", { server: dataServer.data });
        toast({ title: `Successfully kick the user` });
      } else {
        toast({ title: dataServer.error });
      }
    } catch (e: any) {
      setLoadingId(memberId);
      toast({ title: e.message });
    } finally {
      setLoadingId("");
    }
  }

  if (!isMounted) {
    return false;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl flex items-center gap-2 justify-center">
            Manage members{" "}
            <UserRoundCog className="w-5 h-5 md:w-9 md:h-9 text-sky-500" />
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            <p className="flex items-center justify-center">
              {server?.members && server?.members.length} Members{" "}
              <Users className="w-5 h-5 ml-2" />
            </p>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[450px]">
          {server?.members &&
            server?.members.map((member) => (
              <div key={member.id} className="flex items-center my-4">
                <UserItem
                  email={member.profile.email}
                  imageUrl={member.profile.imageUrl}
                  name={member.profile.name}
                  role={member.role}
                />
                {server.profileId !== member.profileId &&
                  loadingId !== member.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="ml-auto ">
                        <ActionTooltip
                          description="edit"
                          align="center"
                          side="top"
                        >
                          <MoreVertical className="w-5 h-5 cursor-pointer" />
                        </ActionTooltip>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="cursor-pointer">
                            Role <ShieldQuestion className="w-5 h-5 ml-1" />
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() =>
                                  onRoleChange({
                                    memberId: member.id,
                                    serverId: server.id,
                                    role: "GUEST",
                                  })
                                }
                              >
                                Guest <Shield className="w-5 h-5 ml-1 mr-8" />
                                {member.role === "GUEST" && (
                                  <Check className="w-5 h-5 ml-auto" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() =>
                                  onRoleChange({
                                    memberId: member.id,
                                    serverId: server.id,
                                    role: "MODERATOR",
                                  })
                                }
                              >
                                Moderator{" "}
                                <ShieldCheck className="w-5 h-5 ml-1 mr-8" />
                                {member.role === "MODERATOR" && (
                                  <Check className="w-5 h-5 ml-auto" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            onKickMembers({
                              memberId: member.id,
                              serverId: server.id,
                            });
                          }}
                        >
                          Kick off{" "}
                          <Gavel className="w-5 h-5 ml-1 text-red-500/80" />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                {loadingId === member.id && (
                  <Loader2 className="animate-spin w-5 h-5 ml-auto" />
                )}
              </div>
            ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ManageMembersModal;
