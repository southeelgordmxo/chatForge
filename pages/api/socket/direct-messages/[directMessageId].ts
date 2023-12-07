import { authProfilePages } from "@/lib/auth-profile-pages";
import { db } from "@/lib/db.prisma";
import { NextApiResponseWithSocketIo } from "@/type";
import { MemberType } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocketIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res
      .status(405)
      .json({ success: false, error: "Method is not allowed!" });
  }

  try {
    const profile = await authProfilePages(req);
    const { conversationId, directMessageId } = req.query;
    const { content } = req.body;

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

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile?.id,
            },
          },
          {
            memberTwo: {
              profileId: profile?.id,
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

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!directMessage || directMessage.deleted) {
      return res.status(400).json({
        success: false,
        error: "Could not found the message!",
      });
    }

    const isMessageOwner = member.id === directMessage.memberId;
    const isAdmin = member.role === MemberType.ADMIN;
    const isModerator = member.role === MemberType.MODERATOR;
    const editable = isAdmin || isModerator || isMessageOwner;

    if (!editable) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized attempt to modify the message!",
      });
    }

    if (req.method === "DELETE") {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted!",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized attempt to modify the message!",
        });
      }

      if (!content) {
        return res.status(400).json({
          success: false,
          error: "Missing content!",
        });
      }

      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updatedKey = `chat:${conversationId}:messages:updated`;

    res?.socket?.server?.io?.emit(updatedKey, directMessage);

    return res.status(201).json({ success: true, data: directMessage });
  } catch (e: any) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
