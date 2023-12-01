import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign-up page",
  description: "User sign up page",
};

export default function Page() {
  return <SignUp />;
}
