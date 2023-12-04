import React from "react";
import UserAvatar from "./user-avatar";
import ActionTooltip from "./action-tooltip";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { MemberType } from "@prisma/client";
import { checkFullName } from "@/lib/helper";

interface UserItemProps {
  name: string;
  imageUrl: string;
  email: string;
  role?: MemberType;
}

const UserItem = ({ email, name, imageUrl, role }: UserItemProps) => {
  return (
    <div className="flex items-center">
      <UserAvatar name={name} imageUrl={imageUrl} />
      <div className="ml-2">
        <div className="flex items-center gap-x-2">
          <h2 className="font-bold text-base">{checkFullName(name)}</h2>
          {role === "ADMIN" && (
            <ActionTooltip description="admin" align="center" side="top">
              <ShieldAlert className="text-red-500 w-5 h-5 " />
            </ActionTooltip>
          )}
          {role === "GUEST" && (
            <ActionTooltip description="guest" align="center" side="top">
              <Shield className=" w-5 h-5 " />
            </ActionTooltip>
          )}
          {role === "MODERATOR" && (
            <ActionTooltip description="moderator" align="center" side="top">
              <ShieldCheck className="text-sky-500 w-5 h-5 " />
            </ActionTooltip>
          )}
        </div>
        <h4 className="text-zinc-400 ">{email}</h4>
      </div>
    </div>
  );
};

export default UserItem;
