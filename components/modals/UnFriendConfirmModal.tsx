"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, UserX } from "lucide-react";
import { useModal } from "@/hook/use-modal-store";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "../ui/use-toast";

const UnFriendConfirmModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose, type, data } = useModal();
  const { unfriends } = data;
  const isModalOpen = isOpen && type === "unFriend";

  async function handleCancel(friendOneId?: string, friendTwoId?: string) {
    try {
      setIsLoading(true);
      const res = await fetch("/api/socket/friends", {
        method: "DELETE",
        body: JSON.stringify({ friendOneId, friendTwoId }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast({
          title: "Successfully unfriend!",
        });
        onClose();
      } else {
        toast({
          title: data.error,
        });
      }
    } catch (e: any) {
      setIsLoading(true);
      toast({
        title: "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl flex items-center gap-2 justify-center">
            Unfriend
            <UserX className="w-5 h-5 md:w-9 md:h-9 text-red-500" />
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            <p>Are you sure you want to unfriend?</p>
            <h3 className="text-red-500 text-center">
              This will delete all data!
            </h3>
          </DialogDescription>
          <div className="flex flex-col items-start">
            <DialogFooter className="w-full gap-y-3 mt-4">
              <Button onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                variant={"destructive"}
                disabled={isLoading}
                onClick={async () =>
                  await handleCancel(
                    unfriends?.friendOneId,
                    unfriends?.friendTwoId
                  )
                }
              >
                Confirm
                {isLoading ? (
                  <Loader2 className="animate-spin w-4 h-4 ml-2" />
                ) : (
                  <UserX className="w-4 h-4 ml-2" />
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UnFriendConfirmModal;
