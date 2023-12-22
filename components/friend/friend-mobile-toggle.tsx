"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import NavigationSidebar from "../navigation/navigation-sidebar";
import FriendSidebar from "./friend-sidebar";
import { useEffect, useState } from "react";

interface FriendMobileToggleProps {
  directMessageName: string;
}

const FriendMobileToggle = ({ directMessageName }: FriendMobileToggleProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="md:hidden" />
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 gap-0 flex">
        <div className="h-full  w-[72px]">
          <NavigationSidebar />
        </div>
        <FriendSidebar directMessageName={directMessageName} />
      </SheetContent>
    </Sheet>
  );
};

export default FriendMobileToggle;
