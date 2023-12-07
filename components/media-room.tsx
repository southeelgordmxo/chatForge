"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  VideoConference,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

const MediaRoom = ({ audio, chatId, video }: MediaRoomProps) => {
  const [token, setToken] = useState();
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
      } catch (e: any) {
        toast({
          title: e.message,
        });
      }
    })();
  }, [user?.firstName, user?.lastName, chatId, name]);

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
      data-lk-theme="default"
      video={video}
      audio={audio}
      token={token}
      connect={true}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
    >
      <MyVideoConference />

      <RoomAudioRenderer />

      <ControlBar />
    </LiveKitRoom>
  );
};

export default MediaRoom;

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  return (
    <GridLayout tracks={tracks}>
      <ParticipantTile />
    </GridLayout>
  );
}
