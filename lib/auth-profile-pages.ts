import { NextApiRequest } from "next";
import { db } from "./db.prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function authProfilePages(req: NextApiRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });

  if (!profile) {
    return null;
  }
  return profile;
}
