import { initialServerSetup } from "@/lib/initial-server-setup";
import { initialSetup } from "@/lib/initial-setup";
import { redirect } from "next/navigation";

export default async function SetupPage() {
  const user = await initialSetup();

  if (!user) {
    return redirect("/");
  }

  const directMe = await initialServerSetup(user);

  if (directMe) {
    return redirect(`/direct/me/${directMe?.id}`);
  }
}
