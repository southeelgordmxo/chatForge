// import { Server as NetServer } from "http";
// import { NextApiRequest } from "next";
// import { Server as ServerIO } from "socket.io";
// import type { NextApiResponseWithSocketIo } from "@/type";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const ioHandler = (req: NextApiRequest, res: NextApiResponseWithSocketIo) => {
//   if (!res.socket.server.io) {
//     const path = "/api/socket/io";
//     const httpServer: NetServer = res.socket.server as any;
//     const io = new ServerIO(httpServer, {
//       path: path,
//       addTrailingSlash: false,
//     });

//     res.socket.server.io = io;
//   }

//   res.end();
// };

// export default ioHandler;

// server/ioHandler.ts

import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO, Socket } from "socket.io";
import type { NextApiResponseWithSocketIo } from "@/type";

// Maintain a Map to track active users and their corresponding socket connections
const activeUsers = new Map<string, Socket>();

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseWithSocketIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      socket.on("connectToServer", (userId: string) => {
        activeUsers.set(userId, socket);
        console.log(userId);

        io.emit("listenActiveUser", Array.from(activeUsers.values()));
      });

      socket.on("disconnectUser", (userId: string) => {
        activeUsers.delete(userId);
        io.emit("listenActiveUser", Array.from(activeUsers.values()));
      });
    });

    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;
