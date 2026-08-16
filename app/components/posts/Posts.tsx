import getCurrentUser from "@/app/lib/auth-user";
import NewPost from "./NewPost";
import { getUserByEmail } from "@/app/actions";
export default async function Posts() {
  const session = await getCurrentUser();
  if (!session) return null;
  const user = await getUserByEmail(session?.email ?? null);
  if (!user) return null;
  return <>{session ? <NewPost user={user} /> : <NewPost user={user} />}</>;
}
