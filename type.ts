import { Server as NetServer, Socket } from "net";
import { Server as SocketIoServer } from "socket.io";
import { NextApiResponse } from "next";
import { Member, Profile, Server } from "@prisma/client";

export type ServerWithChannelAndMembers = Server & {
  members: (Member & { profile: Profile })[];
};

export type NextApiResponseWithSocketIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIoServer;
    };
  };
};
