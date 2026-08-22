"use client";
import { likePost } from "@/app/actions";
import LikeButtonIcon from "../svg/LikeButtonIcon";
import LikedButtonIcon from "../svg/LikedButtonIcon";
import { useState } from "react";
import Popup from "../ui/Popup";

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
  const [showPopup, setShowPopup] = useState(false);

  const handleLike = async () => {
    if (!currentUserId) {
      setShowPopup(true);
      return null;
    }
    await likePost(postId);

    setLiked(!liked);
    setLikeCount(liked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <div className="flex items-center mt-2">
      {showPopup && (
        <Popup
          message="Entre em sua conta para curtir este post."
          type="error"
        />
      )}
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
