import { getUserPosts } from "@/app/actions";
import { auth } from "auth";
export default async function MyPosts() {
  const session = await auth();
  let userId = null;
  if (session) {
    userId = session.user.userId;
  }
  const posts = await getUserPosts(userId);

  return (
    <div>
      {posts.map((post) => (
        <p key={post.id}>{post.caption}</p>
      ))}
    </div>
  );
}
