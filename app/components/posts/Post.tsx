"use client";
import type { Post as PostType } from "@/app/types/Post";
import type { User as UserType } from "@/app/types/User";

import Card from "@/app/components/ui/Card";
import Avatar from "@/app/components/ui/Avatar";
import Image from "next/image";
import Line from "../ui/Line";
import LikeButton from "./LikeButton";
import CommentButtonIcon from "../svg/CommentButtonIcon";

import { useState } from "react";
import CommentSection from "./CommentSection";
import NewComment from "./NewComment";

interface PostProps {
  post: PostType;
  user: UserType | null;
}

export default function Post({ post, user }: PostProps) {
  let isLiked = false;
  if (post.likes) {
    isLiked = post.likes.some((like) => like.userId == user?.id);
  }

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  return (
    <Card className="py-5 px-6">
      <div className="flex items-center gap-1.5 mb-3.5">
        <div className="w-1.5 h-1.5 rounded-full bg-drac-green shadow-md shadow-glow-green" />
        <span className="text-xs text-drac-comment">
          SYN_0x{post.visibleId}
        </span>
        <div className="flex-1 h-px bg-linear-to-r from-drac-line/40 to-transparent" />
        <span className="text-xs text-drac-line">
          {post.createdAt.toLocaleDateString()}
        </span>
      </div>
      <div className="flex gap-3 mb-2 items-start">
        <Avatar
          src={post.user.image || "/avatar.png"}
          alt={`Foto de perfil de ${post.user.name}`}
          size={44}
          className="size-11"
          ring
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-bold text-sm text-drac-fg">
              {post.user.name}
            </span>
            <span className="text-xs text-drac-comment">{post.user.title}</span>
          </div>
          {post.imageUrl ? (
            <Image
              src={post.imageUrl || ""}
              alt={post.caption || "Post sem descrição"}
              width={400}
              height={250}
              className="rounded-xl m-2 w-100 h-62.5 object-fill"
            />
          ) : (
            ""
          )}
          <p className="mt-2.5 text-sm text-drac-fg ">{post.caption}</p>
        </div>
      </div>
      <Line />
      <div className="flex items-center">
        <LikeButton
          postId={post.id}
          initialLikesCount={post.likes?.length ? post.likes.length : 0}
          isLiked={isLiked}
          currentUserId={user?.id}
        />
        <button
          onClick={() => setIsCommentModalOpen(!isCommentModalOpen)}
          className="mt-2 ml-1 flex items-center cursor-pointer"
        >
          <CommentButtonIcon className="text-drac-comment hover:text-drac-yellow size-4.5" />
          <span className="text-drac-comment text-xs">
            {post.comments ? post.comments.length : 0}
          </span>
        </button>
      </div>

      {isCommentModalOpen && (
        <>
          {(post.comments?.length ?? 0) > 0 && <CommentSection posts={post} />}

          {user && <NewComment post={post} user={user} />}
        </>
      )}
    </Card>
  );
}
