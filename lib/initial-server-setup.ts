import { v4 as UUID4 } from "uuid";
import { db } from "./db.prisma";
import { IProfile } from "./initial-setup";

export async function initialServerSetup(user: IProfile) {
  const server = await db.server.findFirst({
    where: {
      name: `Direct Message.${user.userId}`,
    },
  });

  if (server) {
    return server;
  }

  try {
    return await db.server.create({
      data: {
        name: `Direct Message.${user.userId}`,
        invitationCode: UUID4(),
        imageUrl:
          "https://utfs.io/f/c3a972f4-8e6e-4150-ad00-a5bd483851aa-qeqk8f.png",
        profileId: user.id,
      },
    });
  } catch (e: any) {
    return null;
  }
}
