import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { File, X } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import Link from "next/link";
interface FileUploadProps {
  value: string;
  onChange: (url?: string) => void;
  endpoint: "messageUpload" | "serverUpload";
}

// check the type of image
export function checkImageType(fileType?: string) {
  return (
    fileType == "jpeg" ||
    fileType == "jpg" ||
    fileType == "png" ||
    fileType == "gif" ||
    fileType == "svg" ||
    fileType == "raw" ||
    fileType == "webp"
  );
}

const fileUpload = ({ endpoint, onChange, value }: FileUploadProps) => {
  const fileType = value.split(".").pop();

  if (value && checkImageType(fileType)) {
    return (
      <div className="relative h-24 w-24">
        <Image src={value} alt="Upload image" fill className=" rounded-full" />
        <Button
          variant={"destructive"}
          size={"badge"}
          className="rounded-full absolute top-0 right-0"
          onClick={() => {
            onChange("");
          }}
        >
          <X />
        </Button>
      </div>
    );
  } else {
    if (value) {
      return (
        <div className="relative h-28 w-full">
          <div className="px-4 bg-zinc-800 flex items-center justify-center w-full h-full">
            <File className="w-14 h-14 text-indigo-500" />
            <Link href={value} target="_blank" className="line-clamp-3">
              {value}
            </Link>
          </div>
          <Button
            type="button"
            variant={"destructive"}
            size={"badge"}
            className="rounded-full absolute -top-3 -right-2"
            onClick={() => {
              onChange("");
            }}
          >
            <X />
          </Button>
        </div>
      );
    }
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res[0].url);
      }}
      onUploadError={(error) => {
        toast({ title: "Could not upload the file! Try again" });
      }}
    />
  );
};

export default fileUpload;
