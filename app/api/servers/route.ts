import { v4 as UUID4 } from "uuid";
import { authProfile } from "@/lib/auth-profile";
import { db } from "@/lib/db.prisma";
import { NextRequest, NextResponse } from "next/server";
import { MemberType } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { name, imageUrl } = await req.json();

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
    if (name === "Direct Message") {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Serve name cannot be 'Direct Message'",
        }),
        {
          status: 400,
          statusText: "Bad request!",
        }
      );
    }

    const server = await db.server.create({
      data: {
        name,
        imageUrl,
        profileId: profile.id,
        invitationCode: UUID4(),
        channels: {
          create: {
            name: "general",
            profileId: profile.id,
          },
        },
        members: {
          create: {
            role: MemberType.ADMIN,
            profileId: profile.id,
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
