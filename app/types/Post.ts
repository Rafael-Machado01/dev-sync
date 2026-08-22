import { User } from "./User";
import { Like } from "./Like";
import { Comment } from "./Comment";

export interface Post {
  id: string;
  visibleId: string;
  imageUrl?: string | null;
  caption?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  likes?: Like[] | [];
  comments?: Comment[] | [];
}
