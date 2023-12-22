import { authProfile } from "@/lib/auth-profile";
import { db } from "@/lib/db.prisma";
import { FriendStatus } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const profile = await authProfile();
    const { friendOneId, friendTwoId } = await req.json();

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

    if (!friendOneId) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Friend one id is required",
        }),
        {
          status: 400,
          statusText: "Bad request!",
        }
      );
    }

    if (!friendTwoId) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Friend two id is required",
        }),
        {
          status: 400,
          statusText: "Bad request!",
        }
      );
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
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Friend request already sent.",
        }),
        {
          status: 400,
          statusText: "Bad request!",
        }
      );
    }

    const friends = await db.friend.create({
      data: {
        friendOneId,
        friendTwoId,
        status: FriendStatus["PENDING"],
      },
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        data: friends,
      })
    );
  } catch (e: any) {
    console.log(e);

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
