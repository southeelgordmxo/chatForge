import InitialModal from "@/components/modals/InitialModal";
import { db } from "@/lib/db.prisma";
import { initialSetup } from "@/lib/initial-setup";
import { redirect } from "next/navigation";

export default async function SetupPage() {
  const user = await initialSetup();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: user?.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <InitialModal />;
}
