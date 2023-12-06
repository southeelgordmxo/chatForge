import { authProfile } from "@/lib/auth-profile";
import { db } from "@/lib/db.prisma";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async ({
  params,
}: {
  params: { slug: ["inviteId", "serverId"] };
}) => {
  const profile = await authProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.slug["0"]) {
    return redirect("/");
  }

  if (!params.slug["1"]) {
    return redirect("/");
  }

  const existingServer = await db.server.findFirst({
    where: {
      invitationCode: params.slug["0"],
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const addMemberToInvitedServer = await db.server.update({
    where: {
      id: params.slug["1"],
      invitationCode: params.slug["0"],
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (addMemberToInvitedServer) {
    return redirect(`/servers/${addMemberToInvitedServer.id}`);
  }

  return null;
};

export default page;
