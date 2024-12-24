"use client";

import React, { useOptimistic } from "react";
import { Button } from "@/components/ui/button";
import { followAction } from "@/lib/actions";

interface FollowButtonProps {
  isCurrentUser: boolean;
  isFollowing: boolean;
  userId: string;
}

const FollowButton = ({
  isCurrentUser,
  isFollowing,
  userId,
}: FollowButtonProps) => {
  const [optimisticFollow, addOptimisticFollow] = useOptimistic<
    { isFollowing: boolean },
    void
  >(
    {
      isFollowing,
    },
    (currentState) => ({
      isFollowing: !currentState.isFollowing,
    })
  );

  const getButtonContent = () => {
    if (isCurrentUser) {
      return "Edit Profile";
    }
    if (optimisticFollow.isFollowing) {
      return "Unfollow";
    }
    return "Follow";
  };

  const getButtonVariant = () => {
    if (isCurrentUser) {
      return "secondary";
    }
    if (optimisticFollow.isFollowing) {
      return "outline";
    }
    return "default";
  };

  const handleFollowAction = async () => {
    if (isCurrentUser) {
      return;
    }

    try {
      addOptimisticFollow();
      await followAction(userId);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form action={handleFollowAction}>
      <Button variant={getButtonVariant()} className="w-full">
        {getButtonContent()}
      </Button>
    </form>
  );
};

export default FollowButton;
