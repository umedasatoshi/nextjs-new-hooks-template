"use client";

import React, { useOptimistic } from "react";
import { Button } from "@/components/ui/button";
import { HeartIcon, MessageCircleIcon, Share2Icon } from "./Icons";
import { likeAction } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";

interface LikeState {
  likeCount: number;
  isLiked: boolean;
}

type PostInteractionProps = {
  postId: string;
  initiallikes: string[];
  commentsNumber: number;
};

const PostInteraction = ({
  postId,
  initiallikes,
  commentsNumber,
}: PostInteractionProps) => {
  const { userId } = useAuth();

  const initialState = {
    likeCount: initiallikes.length,
    isLiked: userId ? initiallikes.includes(userId) : false,
  };

  const [optimisticlike, addOptimisticLike] = useOptimistic<LikeState, void>(
    initialState,
    (currentState) => ({
      likeCount: currentState.isLiked
        ? currentState.likeCount - 1
        : currentState.likeCount + 1,
      isLiked: !currentState.isLiked,
    })
  );

  const handleLikeSubmit = async () => {
    try {
      addOptimisticLike();
      await likeAction(postId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <form action={handleLikeSubmit}>
        <Button variant="ghost" size="icon">
          <HeartIcon
            className={`h-5 w-5 text-muted-foreground ${
              optimisticlike.isLiked
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
          />
        </Button>
      </form>
      <span
        className={`-ml-1 ${
          optimisticlike.isLiked ? "text-destructive" : "text-muted-foreground"
        }`}
      >
        {optimisticlike.likeCount}
      </span>
      <Button variant="ghost" size="icon">
        <MessageCircleIcon className="h-5 w-5 text-muted-foreground" />
      </Button>
      <span className="-ml-1">{commentsNumber}</span>
      <Button variant="ghost" size="icon">
        <Share2Icon className="h-5 w-5 text-muted-foreground" />
      </Button>
    </div>
  );
};

export default PostInteraction;
