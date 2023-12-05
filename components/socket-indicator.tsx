"use client";

import { useSocket } from "./providers/socket-provider";
import { Badge } from "./ui/badge";

const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge className="bg-yellow-500 text-white hover:bg-yellow-500/80">
        Connection timeout! Reconnecting!
      </Badge>
    );
  }

  return (
    <Badge className="cursor-pointer bg-emerald-500 text-white hover:bg-emerald-500/80">
      Connected! Live-communication
    </Badge>
  );
};

export default SocketIndicator;
