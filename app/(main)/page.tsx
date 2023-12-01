import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main>
      <h1>This is protected route</h1>
      <p>Hello</p>
      <UserButton afterSignOutUrl="/" />
      <ModeToggle />
    </main>
  );
}
