import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

function checkAuth() {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return {
    userId,
  };
}

export const ourFileRouter = {
  serverUpload: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(() => checkAuth())
    .onUploadError(() => {
      throw new Error("Could not upload!");
    })
    .onUploadComplete(() => {}),
  messageUpload: f(["image", "pdf", "image/gif"])
    .middleware(() => checkAuth())
    .onUploadError(() => {
      throw new Error("Could not upload!");
    })
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
