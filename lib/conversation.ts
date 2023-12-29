import { db } from "./db.prisma";

// find conversation or it is not found create new conversation
export async function findOrCreateConversation(
  memberOneId: string,
  memberTwoId: string
) {
  const existingConversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId));

  if (!existingConversation) {
    const newConversation = await createNewConversation(
      memberOneId,
      memberTwoId
    );

    return newConversation;
  }

  return existingConversation;
}

// create new conversation
export async function createNewConversation(
  memberOneId: string,
  memberTwoId: string
) {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (e) {
    return null;
  }
}

// find conversation between two users
export async function findConversation(
  memberOneId: string,
  memberTwoId: string
) {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId }, { memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (e) {
    return null;
  }
}
