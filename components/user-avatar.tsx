import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  imageUrl: string;
  name: string;
  className?: string;
}

const UserAvatar = ({ className, imageUrl, name }: UserAvatarProps) => {
  return (
    <Avatar>
      <AvatarImage className={cn("w-12 h-12", className)} src={imageUrl} />
      <AvatarFallback>{name}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
