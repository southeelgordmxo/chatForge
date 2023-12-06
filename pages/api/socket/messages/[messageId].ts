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
    const { messageId, serverId, channelId } = req.query;
    const { content } = req.body;

    if (!serverId) {
      return res.status(400).json({
        success: false,
        error: "Missing server id!",
      });
    }

    if (!channelId) {
      return res.status(400).json({
        success: false,
        error: "Missing channel id!",
      });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile?.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(400).json({
        success: false,
        error: "Server not found!",
      });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res.status(400).json({
        success: false,
        error: "Channel not found!",
      });
    }

    const member = server.members.find(
      (member) => member.profileId === profile?.id
    );

    if (!member) {
      return res.status(400).json({
        success: false,
        error: "Member not found!",
      });
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return res.status(400).json({
        success: false,
        error: "Could not found the message!",
      });
    }

    const isMessageOwner = member.id === message.memberId;
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
      message = await db.message.update({
        where: {
          id: messageId as string,
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

      message = await db.message.update({
        where: {
          id: messageId as string,
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

    const updatedKey = `chat:${channelId}:messages:updated`;

    res?.socket?.server?.io?.emit(updatedKey, message);

    return res.status(201).json({ success: true, data: message });
  } catch (e: any) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
