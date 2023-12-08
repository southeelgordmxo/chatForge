"use client";

import "@livekit/components-styles";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export default function MediaRoom({ audio, chatId, video }: MediaRoomProps) {
  // TODO: get user input for room and name
  const [token, setToken] = useState("");
  const { user } = useUser();

  const name =
    user?.lastName === null
      ? `${user?.firstName}`
      : `${user?.firstName} ${user?.lastName}`;

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(
          `/api/get-participant-token?room=${chatId}&username=${name}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  if (!token) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
        <h3 className="text-muted-foreground">Loading...</h3>
      </div>
    );
  }
  return (
    <LiveKitRoom
      video={video}
      audio={audio}
      token={token}
      connect={true}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
    >
      <VideoConference />
    </LiveKitRoom>
  );
}
