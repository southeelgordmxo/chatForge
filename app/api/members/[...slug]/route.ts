import { authProfile } from "@/lib/auth-profile";
import { db } from "@/lib/db.prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      slug: ["memberId", "serverId"];
    };
  }
) {
  try {
    const profile = await authProfile();
    const { role } = await req.json();
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
    if (!params.slug["0"]) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Missing member id!",
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
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.slug["0"],
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
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

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      slug: ["memberId", "serverId"];
    };
  }
) {
  try {
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
    if (!params.slug["0"]) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Missing member id!",
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
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.slug["0"],
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
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
