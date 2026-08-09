import { auth } from "@/auth";

export default async function getCurrentUser() {
  const session = await auth();
  if (!session) return null;
  return session.user;
}
