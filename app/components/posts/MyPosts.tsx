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
  const usersposts = await getUserPosts(userId);

  return (
    <div>
      {usersposts.map((post) => (
        <p key={post.id}>{post.caption}</p>
      ))}
    </div>
  );
}
