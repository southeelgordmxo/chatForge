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
    const { serverId, channelId } = req.query;

    if (!profile) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized user!" });
    }

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

    if (!content) {
      return res.status(400).json({
        success: false,
        error: "Missing content!",
      });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
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
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return res.status(400).json({
        success: false,
        error: "Member not found!",
      });
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channel.id,
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

    const channelKey = `chat:${channel.id}:messages`;

    res?.socket?.server.io.emit(channelKey, message);

    return res.status(201).json({ success: true, data: message });
  } catch (e: any) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
