import { authProfile } from "@/lib/auth-profile";
import { db } from "@/lib/db.prisma";
import { UserButton, redirectToSignIn } from "@clerk/nextjs";
import NavigationAction from "./navigation-action";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import NavigationItem from "./navigation-item";
import { ModeToggle } from "../mode-toggle";

const NavigationSidebar = async () => {
  const profile = await authProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-2 text-primary h-full w-full flex flex-col items-center dark:bg-zinc-900 bg-zinc-200">
      <NavigationAction />
      <Separator className="max-w-[47px] h-0.5 mx-auto dark:bg-zinc-800 bg-zinc-300" />
      <ScrollArea className="w-full flex-1">
        {server.map((server) => (
          <NavigationItem
            key={server.id}
            id={server.id}
            imageUrl={server.imageUrl}
            name={server.name}
          />
        ))}
      </ScrollArea>
      <Separator className="max-w-[47px] h-0.5 mx-auto" />
      <div className="pb-4 flex flex-col items-center gap-y-4">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-[50px] h-[50px]",
            },
          }}
        />
      </div>
    </div>
  );
};

export default NavigationSidebar;
