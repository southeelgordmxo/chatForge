import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Menu } from "lucide-react";
import NavigationSidebar from "./navigation/navigation-sidebar";
import ServerSidebar from "./servers/server-sidebar";
import { Button } from "./ui/button";

interface MobileToggleProps {
  serverId: string;
}

const MobileToggle = ({ serverId }: MobileToggleProps) => {
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant={"ghost"} size={"sm"}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 gap-0 flex">
        <div className="h-full  w-[72px]">
          <NavigationSidebar />
        </div>
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
