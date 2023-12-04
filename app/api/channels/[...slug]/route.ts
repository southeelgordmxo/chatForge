import { authProfile } from "@/lib/auth-profile";
import { db } from "@/lib/db.prisma";
import { MemberType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: ["channelId", "serverId"] } }
) {
  try {
    const profile = await authProfile();

    const { name, type } = await req.json();

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

    if (!params.slug["0"]) {
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

    if (!params.slug["1"]) {
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

    const server = await db.server.update({
      where: {
        id: params.slug["1"],
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberType.MODERATOR, MemberType.ADMIN],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: params.slug["0"],
            },
            data: {
              name,
              type,
            },
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
        status: 200,
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
