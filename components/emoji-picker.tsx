"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface EmojiPickerProps {
  onChange: (emoji: string) => void;
}

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Smile
          className="cursor-pointer w-8 h-8 p-1 rounded-full absolute top-2.5 right-3 transition-colors  hover:text-yellow-500/60 "
          onClick={() => setIsOpen(true)}
        />
      </PopoverTrigger>
      <PopoverContent
        className="mb-16 bg-transparent border-none shadow-none"
        side="right"
        sideOffset={45}
      >
        <Picker
          theme={resolvedTheme}
          data={data}
          onEmojiSelect={(emoji: any) => {
            onChange(emoji.native);
            setIsOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
