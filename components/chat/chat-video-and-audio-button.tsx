"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ActionTooltip from "../action-tooltip";
import { Video, VideoOff } from "lucide-react";
import qs from "query-string";

const ChatVideoAndAudioButton = () => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const isVideo = params?.get("video");
  const isAudio = params?.get("audio");
  const labelForVideo = isVideo ? "End video call" : "Start video call";
  const labelForAudio = isAudio ? "End voice call" : "Start voice call";

  function onClick() {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
          // audio: isAudio ? undefined : true,
        },
      },
      { skipNull: true }
    );

    router.push(url);
  }

  return (
    <div className="flex items-center gap-x-2">
      <ActionTooltip description={labelForVideo} side="bottom">
        {isVideo ? (
          <VideoOff
            className="w-6 h-6 cursor-pointer  text-zinc-300 transition-colors  dark:hover:text-sky-600"
            onClick={() => onClick()}
          />
        ) : (
          <Video
            className="w-6 h-6 cursor-pointer  text-zinc-300 transition-colors  dark:hover:text-sky-600"
            onClick={() => onClick()}
          />
        )}
      </ActionTooltip>
      {/* {!isAudio && (
      )} */}
      {/* 
      <ActionTooltip description={labelForVideo} side="bottom">
        {isAudio ? (
          <Unplug
            className="w-6 h-6 cursor-pointer  text-zinc-300 transition-colors  dark:hover:text-emerald-600"
            onClick={() => onClick("AUDIO")}
          />
        ) : (
          <Headphones
            className="w-6 h-6 cursor-pointer  text-zinc-300 transition-colors  dark:hover:text-emerald-600"
            onClick={() => onClick("AUDIO")}
          />
        )}
      </ActionTooltip> */}
    </div>
  );
};

export default ChatVideoAndAudioButton;
