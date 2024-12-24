import prisma from "./prisma";

export async function fetchPosts(userId: string, username?: string) {
  // Fetch the posts of the user
  if (username) {
    return await prisma.post.findMany({
      where: {
        author: { name: username },
      },
      include: {
        author: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Fetch the posts of the user and the users they follow
  if (!username && userId) {
    // Fetch the posts of the user and the users they follow
    const following = await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    // Get the ids of the users the current user follows
    const followingIds = following.map((f) => f.followingId);
    const ids = [userId, ...followingIds];

    // Include the posts of the current user and the users they follow
    return await prisma.post.findMany({
      where: {
        authorId: {
          in: ids,
        },
      },
      include: {
        author: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
