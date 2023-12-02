"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

interface ActionTooltipProps {
  children: React.ReactNode;
  description: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "center" | "start" | "end";
}

const ActionTooltip = ({
  children,
  description,
  align,
  side,
}: ActionTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={60}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className="capitalize text-sm font-semibold">
            {description.toLowerCase()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ActionTooltip;
