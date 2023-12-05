"use client";
import { io as SocketIoClient } from "socket.io-client";
import React, { createContext, useContext, useEffect, useState } from "react";

type SocketIoInitStateType = {
  isConnected: boolean;
  socket: any | null;
};

const initialSocketState: SocketIoInitStateType = {
  isConnected: false,
  socket: null,
};

const SocketContext = createContext<SocketIoInitStateType>(initialSocketState);

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = new (SocketIoClient as any)(
      process.env.NEXT_PUBLIC_SITE_URL,
      {
        path: "/api/socket/io",
        addTrailingSlash: false,
      }
    );

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ isConnected, socket }}>
      {children}
    </SocketContext.Provider>
  );
}
