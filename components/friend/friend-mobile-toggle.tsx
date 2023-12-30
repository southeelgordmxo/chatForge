import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import NavigationSidebar from "../navigation/navigation-sidebar";
import FriendSidebar from "./friend-sidebar";

interface FriendMobileToggleProps {
  serverId: string;
  directId: string;
}

const FriendMobileToggle = ({
  directId,
  serverId,
}: FriendMobileToggleProps) => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="md:hidden" />
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 gap-0 flex">
        <div className="h-full  w-[72px]">
          <NavigationSidebar />
        </div>
        <FriendSidebar serverId={serverId} directId={directId} />
      </SheetContent>
    </Sheet>
  );
};

export default FriendMobileToggle;
