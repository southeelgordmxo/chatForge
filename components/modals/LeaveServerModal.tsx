"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, LogOut, X } from "lucide-react";
import { useModal } from "@/hook/use-modal-store";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";

const LeaveServerModal = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose, onOpen, type, data } = useModal();
  const { server } = data;
  const isModalOpen = isOpen && type === "leaveServer";

  async function handleLeaveServer() {
    try {
      setIsLoading(true);
      const resServer = await fetch(`/api/servers/${server?.id}/leave`, {
        method: "DELETE",
        cache: "no-cache",
      });
      const dataServer = await resServer.json();

      if (resServer.ok && dataServer.success) {
        router.refresh();
        toast({ title: `Successfully leave from the server` });
        router.push("/");
      } else {
        toast({ title: dataServer.error });
      }
    } catch (e: any) {
      setIsLoading(true);
      toast({ title: e.message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl flex items-center gap-2 justify-center">
            Leave Server
            <LogOut className="w-5 h-5 md:w-9 md:h-9 text-red-500" />
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            Are you sure you want to leave from server&apos;s{" "}
            <span className="text-indigo-500">{server?.name}</span>
          </DialogDescription>
          <div className="flex flex-col items-start">
            <DialogFooter className="w-full gap-y-3 mt-4">
              <Button onClick={onClose} disabled={isLoading}>
                Cancel <X className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant={"destructive"}
                disabled={isLoading}
                onClick={handleLeaveServer}
              >
                Confirm
                {isLoading ? (
                  <Loader2 className="animate-spin w-4 h-4 ml-2" />
                ) : (
                  <LogOut className="w-4 h-4 ml-2" />
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveServerModal;
