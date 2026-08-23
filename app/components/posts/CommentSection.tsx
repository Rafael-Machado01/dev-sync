import type { Post as PostType } from "@/app/types/Post";
import type { User as UserType } from "@/app/types/User";

import Avatar from "@/app/components/ui/Avatar";
import TrashIcon from "../svg/TrashIcon";
import { deleteComment } from "@/app/actions";

interface CommentSectionProps {
  posts: PostType;
  user: UserType | null;
}
export default function CommentSection({ posts, user }: CommentSectionProps) {
  if (!posts.comments) {
    return null;
  }
  return (
    <div className="mt-0.5 mx-2">
      {posts.comments.map((comment) => {
        const isMyComment = comment.user.id === user?.id;
        const handleDelete = async () => {
          await deleteComment(comment.id);
        };
        return (
          <div
            className="bg-drac-bg p-2 mx-1 my-2 rounded-2xl shadow-2xl"
            key={comment.id}
          >
            <div className="flex items-center gap-2">
              <Avatar
                src={comment.user.image || "/avatar.png"}
                size={33}
                alt={`Imagem de perfil de ${comment.user.name}`}
              />
              <span className="text-drac-fg font-bold text-xs">
                {comment.user.name}
              </span>
              <span className="text-drac-line text-xs ml-50">
                {comment.createdAt.toLocaleDateString()}
              </span>
              {isMyComment && (
                <span onClick={handleDelete}>
                  <TrashIcon className="size-3.5 text-drac-red cursor-pointer hover:text-red-600 transition-all duration-200" />
                </span>
              )}
            </div>
            <p className="m-2 text-gray-300 text-sm">{comment.content}</p>
          </div>
        );
      })}
    </div>
  );
}
