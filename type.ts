import { Server as NetServer, Socket } from "net";
import { Server as SocketIoServer } from "socket.io";
import { NextApiResponse } from "next";
import { Friend, Member, Message, Profile, Server } from "@prisma/client";

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

export type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

export type FriendsWithFriendOneAndFriendTwo = Friend & {
  friendOne: Profile;
  friendTwo: Profile;
};
