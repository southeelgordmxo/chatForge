import { auth } from "@clerk/nextjs";
import { db } from "./db.prisma";

export async function authProfile() {
  const { userId } = auth();

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
