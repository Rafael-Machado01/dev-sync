"use client";
import type { Post as PostType } from "@/app/types/Post";
import type { User } from "@/app/types/User";

import Line from "../ui/Line";
import Post from "./Post";
import { useState } from "react";
import Button from "../ui/Button";

interface PostsProps {
  isAuth: User | null;
  posts: PostType[];
  userPosts: PostType[];
}

export default function Posts({ isAuth, posts, userPosts }: PostsProps) {
  const [onlyPostsUser, setOnlyPostsUser] = useState(false);
  return (
    <>
      <div className="flex items-center gap-1.5">
        <span className="text-drac-comment text-xs">FEED_RECENTE</span>
        <Line />
        {isAuth && userPosts.length > 0 ? (
          <Button
            onClick={() => setOnlyPostsUser(!onlyPostsUser)}
            className="text-xs bg-drac-darker p-1.5 text-drac-comment rounded-xl "
          >
            {onlyPostsUser ? "Todos os Posts" : "Meus Posts"}
          </Button>
        ) : (
          <span className="text-xs text-drac-comment ">
            {posts.length} Posts
          </span>
        )}
      </div>
      {onlyPostsUser
        ? userPosts.map((post) => (
            <Post key={post.id} post={post} user={isAuth} />
          ))
        : posts.map((post) => <Post key={post.id} post={post} user={isAuth} />)}
    </>
  );
}
