import { initialServerSetup } from "@/lib/initial-server-setup";
import { initialSetup } from "@/lib/initial-setup";
import { redirect } from "next/navigation";

export default async function SetupPage() {
  const user = await initialSetup();

  if (!user) {
    return redirect("/");
  }

  const server = await initialServerSetup(user);

  if (server) {
    return redirect(`/direct/me/${server?.id}`);
  }
}
