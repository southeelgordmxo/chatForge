import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db.prisma";

export interface IProfile {
  id: string;
  userId: string;
  imageUrl: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// check profile data exist in database and if not create one and it exist return that data
export async function initialSetup(): Promise<IProfile | null> {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const existingUser = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (existingUser) {
    return existingUser;
  }

  const newUser = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      imageUrl: user.imageUrl,
    },
  });

  return newUser;
}
