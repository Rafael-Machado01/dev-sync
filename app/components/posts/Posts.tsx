import getCurrentUser from "@/app/lib/auth-user";
import NewPost from "./NewPost";
import { getAllPosts, getUserByEmail } from "@/app/actions";
import Line from "../ui/Line";
import Post from "./Post";
import Button from "../ui/Button";
export default async function Posts() {
  const session = await getCurrentUser();
  if (!session) return null;
  const user = await getUserByEmail(session?.email ?? null);
  if (!user) return null;
  const posts = await getAllPosts();
  return (
    <>
      {session && <NewPost user={user} />}
      <div className="flex items-center gap-1.5">
        <span className="text-drac-comment text-xs">FEED_RECENTE</span>
        <Line />
        <span className="text-drac-line text-xs"> {posts.length} posts </span>
      </div>
      {posts.map((post) => (
        <Post key={post.id} post={post} currentUserId={user.id} />
      ))}
    </>
  );
}
