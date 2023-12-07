import { authProfilePages } from "@/lib/auth-profile-pages";
import { db } from "@/lib/db.prisma";
import { NextApiResponseWithSocketIo } from "@/type";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocketIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed! Expected to be POST method",
    });
  }

  try {
    const profile = await authProfilePages(req);
    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;

    if (!profile) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized user!" });
    }

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        error: "Missing conversation id!",
      });
    }

    if (!content) {
      return res.status(400).json({
        success: false,
        error: "Missing content!",
      });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: "Conversation not found!",
      });
    }

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return res.status(400).json({
        success: false,
        error: "Member not found!",
      });
    }

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${conversationId}:messages`;

    res?.socket?.server.io.emit(channelKey, message);

    return res.status(201).json({ success: true, data: message });
  } catch (e: any) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
