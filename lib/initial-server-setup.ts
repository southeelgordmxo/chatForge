import { db } from "./db.prisma";
import { IProfile } from "./initial-setup";
import { MemberType } from "@prisma/client";

export async function initialServerSetup(user: IProfile) {
  const server = await db.server.findFirst({
    where: {
      name: `ChatForge`,
      invitationCode: "chatForgeServerCode",
      members: {
        some: {
          profileId: user.id,
        },
      },
    },
  });

  if (server) {
    return server;
  }

  try {
    return await db.server.update({
      where: {
        name: "ChatForge",
        invitationCode: "chatForgeServerCode",
      },
      data: {
        members: {
          create: {
            profileId: user.id,
            role: MemberType["GUEST"],
          },
        },
      },
    });
  } catch (e: any) {
    return null;
  }
}
