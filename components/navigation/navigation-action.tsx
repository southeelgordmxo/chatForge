"use client";
import { useModal } from "@/hook/use-modal-store";
import ActionTooltip from "../action-tooltip";

import { Plus } from "lucide-react";

const NavigationAction = () => {
  const { onOpen } = useModal();
  return (
    <div className="mt-4 mb-2">
      <ActionTooltip description="Create server" align="center" side="right">
        <button
          className="group flex items-center"
          onClick={() => onOpen("createServer")}
        >
          <div className="mx-4 overflow-hidden flex items-center justify-center w-[55px] h-[55px] rounded-[25px] bg-background transition-all group-hover:rounded-[19px] group-hover:bg-indigo-500/90">
            <Plus
              className="font-bold text-indigo-500 group-hover:text-primary transition"
              size={28}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default NavigationAction;
