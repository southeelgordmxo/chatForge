import { NextResponse } from "next/server";
import { DirectMessage } from "@prisma/client";
import { authProfile } from "@/lib/auth-profile";
import { db } from "@/lib/db.prisma";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await authProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

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

    if (!conversationId) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Missing conversation id!",
        }),
        {
          status: 400,
          statusText: "Bad Request",
        }
      );
    }

    let messages: DirectMessage[] = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
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
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId,
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
