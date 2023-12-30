import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="h-full flex justify-center items-center flex-col  gap-4">
      <Loader2 className="text-center w-5 h-5 animate-spin" />
      <h2 className="text-lg md:text-xl text-center mb-4">
        Just a moment, <br />
        we&apos;re preparing your chat experience...
      </h2>
      <Image
        src={"/loadingKoala.png"}
        alt="loading image"
        width={200}
        height={150}
      />
    </div>
  );
}
