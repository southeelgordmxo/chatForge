import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign-in page",
  description: "User sign in page",
};

export default function Page() {
  return <SignIn />;
}
