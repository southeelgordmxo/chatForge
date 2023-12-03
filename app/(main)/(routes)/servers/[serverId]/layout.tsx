import ServerSidebar from "@/components/servers/server-sidebar";
import { authProfile } from "@/lib/auth-profile";
import { db } from "@/lib/db.prisma";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const ServerIDLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    serverId: string;
  };
}) => {
  const profile = await authProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="hidden h-full w-64 z-20 md:flex flex-col items-center fixed inset-y-0">
        <ServerSidebar serverId={server.id} />
      </div>
      <div className="h-full md:pl-64">{children}</div>
    </div>
  );
};

export default ServerIDLayout;
