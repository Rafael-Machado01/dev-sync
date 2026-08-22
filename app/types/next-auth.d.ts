import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      userId: string | undefined;
    } & DefaultSession["user"];
  }
}
