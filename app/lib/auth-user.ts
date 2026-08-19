import { auth } from "@/auth";
import type { User } from "../types/User";
import { prisma } from "./prisma";

export default async function getCurrentUser(): Promise<User | null> {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  return user;
}
