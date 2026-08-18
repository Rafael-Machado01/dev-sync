"use client";
import { likePost } from "@/app/actions";
import LikeButtonIcon from "../svg/LikeButtonIcon";
import LikedButtonIcon from "../svg/LikedButtonIcon";
import { useState } from "react";
import Button from "../ui/Button";

interface likeButtonProps {
  postId: string;
  initialLikesCount: number;
  isLiked: boolean;
  currentUserId?: string;
}

export default function LikeButton({
  postId,
  initialLikesCount,
  isLiked,
  currentUserId,
}: likeButtonProps) {
  const [likesCount, setLikeCount] = useState(initialLikesCount);
  const [liked, setLiked] = useState(isLiked);

  const handleLike = async () => {
    if (!currentUserId) {
      return null;
    }
    await likePost(postId, currentUserId);

    setLiked(!liked);
    setLikeCount(liked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <div className="flex items-center mt-2">
      <button onClick={handleLike} className="mx-1.5 cursor-pointer">
        {liked ? (
          <LikedButtonIcon className="text-drac-red size-3.5 hover:text-drac-comment" />
        ) : (
          <LikeButtonIcon className="text-drac-comment size-3.5 hover:text-drac-red" />
        )}
      </button>
      <span className="text-drac-comment text-xs">{likesCount}</span>
    </div>
  );
}
