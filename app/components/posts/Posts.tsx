import type { Post as PostType } from "@/app/types/Post";
import type { User } from "@/app/types/User";

import Line from "../ui/Line";
import Post from "./Post";

interface PostsProps {
  isAuth: User | null;
  posts: PostType[];
}

export default function Posts({ isAuth, posts }: PostsProps) {
  return (
    <>
      <div className="flex items-center gap-1.5">
        <span className="text-drac-comment text-xs">FEED_RECENTE</span>
        <Line />
        <span className="text-drac-line text-xs"> {posts.length} posts </span>
      </div>
      {posts.map((post) => (
        <Post key={post.id} post={post} currentUserId={isAuth?.id} />
      ))}
    </>
  );
}
