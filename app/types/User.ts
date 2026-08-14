import { Like } from "./Like";
import { Post } from "./Post";

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  title: string | null;
  bio: string | null;
  stacks: string[];
  location: string | null;
  background: string | null;
  emailVerified: Date | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  posts?: Post[];
  likes?: Like[];
  comments?: Comment[];
}
