import { db } from "../lib/db.prisma";

async function main() {
  const profile = await db.profile.create({
    data: {
      id: "admin123kei",
      userId: "admin_id1",
      imageUrl: "Admin image url",
      email: "admin@admin.com",
      name: "Admin",
    },
  });

  await db.server.create({
    data: {
      name: "ChatForge",
      imageUrl:
        "https://utfs.io/f/c3a972f4-8e6e-4150-ad00-a5bd483851aa-qeqk8f.png",
      invitationCode: "chatForgeServerCode",
      profileId: profile.id,
      members: {
        create: {
          profileId: profile.id,
          role: "ADMIN",
        },
      },
    },
  });
}

main();
