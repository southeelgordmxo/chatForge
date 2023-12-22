import UserAvatar from "../user-avatar";
import SocketIndicator from "../socket-indicator";
import { checkFullName } from "@/lib/helper";
import FriendMobileToggle from "./friend-mobile-toggle";
import { authProfile } from "@/lib/auth-profile";

interface FriendHeaderProps {
  directMessageName: string;
}

const FriendHeader = async ({ directMessageName }: FriendHeaderProps) => {
  const user = await authProfile();

  return (
    <div className="px-3 flex items-center gap-x-3 h-12 w-full font-semibold border-b dark:border-b-neutral-700 border-b-neutral-400">
      <FriendMobileToggle directMessageName={directMessageName} />
      <div className="text-[19px] font-semibold flex items-center">
        {user && (
          <UserAvatar
            imageUrl={user.imageUrl}
            name={user.name}
            className="w-10 h-10 rounded-full"
          />
        )}

        {user && (
          <p className="ml-2 flex items-center">{checkFullName(user.name)}</p>
        )}
      </div>

      <div className="ml-auto flex items-center gap-x-2">
        <SocketIndicator />
      </div>
    </div>
  );
};

export default FriendHeader;
