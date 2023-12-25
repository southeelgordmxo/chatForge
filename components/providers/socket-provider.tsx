"use client";
import { io as SocketIoClient } from "socket.io-client";
import React, { createContext, useContext, useEffect, useState } from "react";

type SocketIoInitStateType = {
  isConnected: boolean;
  socket: any | null;
  activeUsers: Array<string>;
};

const initialSocketState: SocketIoInitStateType = {
  isConnected: false,
  socket: null,
  activeUsers: [],
};

const SocketContext = createContext<SocketIoInitStateType>(initialSocketState);

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId?: string;
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [activeUsers, setActiveUsers] = useState<Array<string>>([]);

  useEffect(() => {
    const socketInstance = new (SocketIoClient as any)(
      process.env.NEXT_PUBLIC_SITE_URL,
      {
        path: "/api/socket/io",
        addTrailingSlash: false,
      }
    );

    socketInstance.on("listenActiveUser", (activeUsers: Array<string>) => {
      console.log(activeUsers);
    });

    socketInstance.on("connect", () => {
      socketInstance.emit("connectToServer", userId);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      socketInstance.emit("disconnectUser", userId);
      setIsConnected(false);
    });

    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, [activeUsers, userId]);

  return (
    <SocketContext.Provider value={{ isConnected, socket, activeUsers }}>
      {children}
    </SocketContext.Provider>
  );
}
