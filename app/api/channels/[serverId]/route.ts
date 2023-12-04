import { authProfile } from "@/lib/auth-profile";
import { db } from "@/lib/db.prisma";
import { MemberType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      serverId: string;
    };
  }
) {
  try {
    const { name, type } = await req.json();

    const profile = await authProfile();

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

    if (!params.serverId) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Missing server id!",
        }),
        {
          status: 400,
          statusText: "Bad Request",
        }
      );
    }

    if (name === "general") {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Channel name could not be general!",
        }),
        {
          status: 400,
          statusText: "Bad Request",
        }
      );
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberType.ADMIN, MemberType.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        data: server,
      }),
      {
        status: 201,
      }
    );
  } catch (e: any) {
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
