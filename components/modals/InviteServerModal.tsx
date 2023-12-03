"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Copy, RefreshCw, UserPlus } from "lucide-react";
import { useModal } from "@/hook/use-modal-store";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import useOrigin from "@/hook/use-origin";
import { useState } from "react";

const InviteServerModal = () => {
  const [isCopy, setIsCopy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose, onOpen, type, data } = useModal();
  const { server } = data;
  const isModalOpen = isOpen && type === "inviteServer";
  const origin = useOrigin();
  const inviteURL = `${origin}/invite/${server?.invitationCode}/${server?.id}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteURL);
    setIsCopy(true);
    setTimeout(() => {
      setIsCopy(false);
    }, 2000);
  }

  async function handleGenerateNewInviteCode() {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/servers/${server?.id}`, {
        method: "PATCH",
        cache: "no-cache",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        onClose();
        onOpen("inviteServer", { server: data.data });
      } else {
        console.log(data.error);
      }
    } catch (e: any) {
      setIsLoading(true);
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl flex items-center gap-2 justify-center">
            Invite Friends
            <UserPlus className="w-7 h-7 md:w-9 md:h-9 text-indigo-500" />
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            Invite your friends to your server to extend network and
            collaboration
          </DialogDescription>
          <div className="flex flex-col items-start">
            <Label className="text-base">Server invitation link</Label>
            <div className="flex items-center my-2 w-full">
              <Input
                readOnly
                value={inviteURL}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 border-0 focus:outline-none ring-0 bg-zinc-700 text-blue-500 font-bold text-[16px] cursor-copy"
              />
              <Button
                disabled={isCopy || isLoading}
                variant={"outline"}
                size={"icon"}
                onClick={handleCopy}
              >
                {isCopy ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </Button>
            </div>
            <Button
              disabled={isLoading}
              variant={"outline"}
              onClick={handleGenerateNewInviteCode}
            >
              Generate new invite code
              <RefreshCw className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default InviteServerModal;
