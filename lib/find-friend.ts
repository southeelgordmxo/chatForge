import { FriendStatus } from "@prisma/client";
import { db } from "./db.prisma";

export async function findFriend(userId: string) {
  try {
    const friends = await db.friend.findMany({
      where: {
        OR: [{ friendOneId: userId }, { friendTwoId: userId }],
        status: FriendStatus.FRIENDED,
      },
      include: {
        friendOne: true,
        friendTwo: true,
      },
    });

    return friends;
  } catch (e: any) {
    return null;
  }
}
