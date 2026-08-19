import { getUserPosts } from "@/app/actions";
import getCurrentUser from "@/app/lib/auth-user";
export default async function MyPosts() {
  const logged = await getCurrentUser();
  if (!logged) {
    return null;
  }
  const userId = logged.id;
  
  if (!userId) {
    return null;
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
