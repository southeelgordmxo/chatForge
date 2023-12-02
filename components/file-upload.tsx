import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
interface FileUploadProps {
  value: string;
  onChange: (url?: string) => void;
  endpoint: "messageUpload" | "serverUpload";
}

const fileUpload = ({ endpoint, onChange, value }: FileUploadProps) => {
  const fileType = value.split(".").pop();

  if (value && fileType !== "pdf") {
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
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res[0].url);
      }}
      onUploadError={(error) => {
        console.log(error.message);
      }}
    />
  );
};

export default fileUpload;
