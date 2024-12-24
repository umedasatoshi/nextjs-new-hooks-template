"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import prisma from "./prisma";
import { revalidatePath } from "next/cache";

type State = {
  error?: string | undefined;
  success: boolean;
};

export async function addPostAction(
  prevState: State,
  formdata: FormData
): Promise<State> {
  try {
    const { userId } = auth();
    if (!userId) {
      return {
        error: "You must be logged in to post",
        success: false,
      };
    }

    const postText = formdata.get("post") as string;
    const postTextSchema = z
      .string()
      .min(1, "Your post must contain at least 1 character")
      .max(140, "Your post must contain at most 140 characters");

    const validatePostText = postTextSchema.parse(postText);

    await prisma.post.create({
      data: {
        content: validatePostText,
        authorId: userId,
      },
    });

    revalidatePath("/");

    return {
      error: undefined,
      success: true,
    };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        error: err.errors.map((e) => e.message).join(", "),
        success: false,
      };
    } else if (err instanceof Error) {
      return {
        error: err.message,
        success: false,
      };
    } else {
      return {
        error: "An error occurred",
        success: false,
      };
    }
  }
}

export const likeAction = async (postId: string) => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("You must be logged in to like a post");
  }

  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        postId: postId,
        userId: userId,
      },
    });

    // If the user has not liked the post, create a new like
    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      revalidatePath("/");
    }
    // If the user has liked the post, delete the like
    else {
      await prisma.like.create({
        data: {
          postId: postId,
          userId: userId,
        },
      });
      revalidatePath("/");
    }
  } catch (err) {
    console.log(err);
  }
};

export const followAction = async (userId: string) => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) {
    throw new Error("You must be logged in to like a post");
  }

  try {
    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: currentUserId,
        followingId: userId,
      },
    });

    // If the user is already following the target user, delete the follow
    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: userId,
          },
        },
      });
    } else {
      await prisma.follow.create({
        data: {
          followerId: currentUserId,
          followingId: userId,
        },
      });
    }

    revalidatePath(`/profile/${userId}}`);
  } catch (err) {
    console.log(err);
  }
};
