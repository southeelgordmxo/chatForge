import { authProfile } from "@/lib/auth-profile";
import { db } from "@/lib/db.prisma";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ServerIDPageProps {
  params: {
    serverId: string;
  };
}

const ServerIDPage = async ({ params }: ServerIDPageProps) => {
  const profile = await authProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.serverId) {
    return redirect("/");
  }

  const server = await db.server.findFirst({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
      channels: {
        some: {
          name: "general",
        },
      },
    },
    include: {
      channels: true,
    },
  });

  if (server?.channels[0].name !== "general") {
    return redirect("/");
  }

  return redirect(`/servers/${server.id}/channels/${server?.channels[0].id}`);
};

export default ServerIDPage;
