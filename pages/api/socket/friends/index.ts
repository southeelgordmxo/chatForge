import { authProfilePages } from "@/lib/auth-profile-pages";
import { db } from "@/lib/db.prisma";
import { NextApiResponseWithSocketIo } from "@/type";
import { FriendStatus } from "@prisma/client";
import { NextApiRequest } from "next";

async function createFriendReq(
  req: NextApiRequest,
  res: NextApiResponseWithSocketIo
) {
  try {
    const { friendOneId, friendTwoId } = JSON.parse(req.body);

    if (!friendOneId) {
      return res.status(400).json({
        success: false,
        error: "Missing friend one id!",
      });
    }

    if (!friendTwoId) {
      return res.status(400).json({
        success: false,
        error: "Missing friend two id!",
      });
    }

    const existingRelationship =
      (await db.friend.findUnique({
        where: {
          friendOneId_friendTwoId: {
            friendOneId,
            friendTwoId,
          },
          status: FriendStatus["PENDING"],
        },
      })) ||
      (await db.friend.findUnique({
        where: {
          friendOneId_friendTwoId: {
            friendOneId,
            friendTwoId,
          },
          status: FriendStatus["PENDING"],
        },
      }));

    if (existingRelationship) {
      return res.status(400).json({
        success: false,
        error: "Already sent friend request to this user!",
      });
    }

    const friends = await db.friend.create({
      data: {
        friendOneId,
        friendTwoId,
        status: FriendStatus["PENDING"],
      },
      include: {
        friendOne: true,
        friendTwo: true,
      },
    });

    const friendOneKey = `fri:${friendOneId}:create`;
    res?.socket?.server?.io.emit(friendOneKey, friends);

    const friendTwoKey = `fri:${friendTwoId}:create`;
    res?.socket?.server?.io.emit(friendTwoKey, friends);

    return res.status(200).json({ success: true, data: friends });
  } catch (e: any) {
    return res.status(500).json({ success: false, error: e.message });
  }
}

async function getFriendsRequest(
  req: NextApiRequest,
  res: NextApiResponseWithSocketIo
) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "Missing user id!",
      });
    }

    const friends = await db.friend.findMany({
      where: {
        OR: [
          { friendOneId: userId as string },
          { friendTwoId: userId as string },
        ],
      },
      include: {
        friendOne: true,
        friendTwo: true,
      },
    });

    if (!friends) {
      return res.status(400).json({
        success: false,
        error: "No friends yet!",
      });
    }

    return res.status(200).json({ success: true, data: friends });
  } catch (e: any) {
    return res.status(500).json({ success: false, error: e.message });
  }
}

async function confirmFriendsRequest(
  req: NextApiRequest,
  res: NextApiResponseWithSocketIo,
  profileId: string
) {
  try {
    const { friendOneId, friendTwoId, directId } = JSON.parse(req.body);

    if (!friendOneId) {
      return res.status(400).json({
        success: false,
        error: "Missing friend one id!",
      });
    }

    if (!friendTwoId) {
      return res.status(400).json({
        success: false,
        error: "Missing friend two id!",
      });
    }

    const friends = await db.friend.update({
      where: {
        friendOneId_friendTwoId: {
          friendOneId,
          friendTwoId,
        },
        status: FriendStatus["PENDING"],
      },
      data: {
        status: FriendStatus["FRIENDED"],
      },
      include: {
        friendOne: true,
        friendTwo: true,
      },
    });

    if (!friends) {
      return res.status(400).json({
        success: false,
        error: "No friends yet!",
      });
    }

    const friendOneKey = `fri:${friendOneId}:res`;
    res?.socket?.server?.io.emit(friendOneKey, friends);

    const friendTwoKey = `fri:${friendTwoId}:res`;
    res?.socket?.server?.io.emit(friendTwoKey, friends);

    return res.status(200).json({ success: true, data: friends });
  } catch (e: any) {
    return res.status(500).json({ success: false, error: e.message });
  }
}

async function cancelFriendsRequest(
  req: NextApiRequest,
  res: NextApiResponseWithSocketIo
) {
  try {
    const { friendOneId, friendTwoId } = JSON.parse(req.body);

    if (!friendOneId) {
      return res.status(400).json({
        success: false,
        error: "Missing friend one id!",
      });
    }

    if (!friendTwoId) {
      return res.status(400).json({
        success: false,
        error: "Missing friend two id!",
      });
    }

    const friend = await db.friend.delete({
      where: {
        friendOneId_friendTwoId: {
          friendOneId,
          friendTwoId,
        },
        OR: [
          { status: FriendStatus["FRIENDED"] },
          { status: FriendStatus["PENDING"] },
        ],
      },
    });

    const friendOneKey = `fri:${friendOneId}:cancel`;
    res?.socket?.server?.io.emit(friendOneKey, friend);

    const friendTwoKey = `fri:${friendTwoId}:cancel`;
    res?.socket?.server?.io.emit(friendTwoKey, friend);

    return res.status(200).json({ success: true });
  } catch (e: any) {
    return res.status(500).json({ success: false, error: e.message });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocketIo
) {
  const profile = await authProfilePages(req);

  if (!profile) {
    return res
      .status(401)
      .json({ success: false, error: "Unauthorized user!" });
  }

  if (req.method === "GET") {
    getFriendsRequest(req, res);
  }

  if (req.method === "POST") {
    await createFriendReq(req, res);
  }

  if (req.method === "PUT") {
    await confirmFriendsRequest(req, res, profile.id);
  }

  if (req.method === "DELETE") {
    await cancelFriendsRequest(req, res);
  }
}
