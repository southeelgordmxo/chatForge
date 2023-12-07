import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  imageUrl: string;
  name: string;
  className?: string;
  onClick?: () => {} | void;
}

const UserAvatar = ({
  onClick,
  className,
  imageUrl,
  name,
}: UserAvatarProps) => {
  return (
    <Avatar>
      <AvatarImage
        onClick={onClick}
        className={cn("w-12 h-12", className)}
        src={imageUrl}
      />
      <AvatarFallback>{name}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
