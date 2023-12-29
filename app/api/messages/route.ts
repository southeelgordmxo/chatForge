import { NextResponse } from "next/server";
import { Message } from "@prisma/client";
import { authProfile } from "@/lib/auth-profile";
import { db } from "@/lib/db.prisma";

// default retrieve item limit
const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await authProfile();
    const { searchParams } = new URL(req.url);

    // cursor mean message id or direct message id
    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Unauthorized user!",
        }),
        {
          status: 401,
          statusText: "Unauthorized",
        }
      );
    }

    if (!channelId) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Missing channel id!",
        }),
        {
          status: 400,
          statusText: "Bad Request",
        }
      );
    }

    let messages: Message[] = [];

    // for initial fetching there will not be cursor value
    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    // lastPage nextCursor value in useChatQuery
    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        data: messages,
        nextCursor,
      })
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: "Something went wrong with server!",
      }),
      {
        status: 500,
        statusText: "Internal server error",
      }
    );
  }
}
