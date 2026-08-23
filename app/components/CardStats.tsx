import Card from "@/app/components/ui/Card";
import Line from "@/app/components/ui/Line";
import type { Post as PostType } from "../types/Post";
import type { User as UserType } from "../types/User";
interface CardStatsProps {
  posts: PostType[];
  user: UserType | null;
}

export default function CardStats({ posts, user }: CardStatsProps) {
  const totalComments = posts.reduce(
    (total, post) => total + (post.comments?.length ?? 0),
    0,
  );
  const totalLikes = posts.reduce(
    (total, post) => total + (post.likes?.length ?? 0),
    0,
  );
  return (
    <Card className="text-sm p-2 m-2 font-bold shadow-glow-purple">
      <h4 className="text-drac-comment">SYN_STATUS</h4>
      <Line />
      <p className="text-drac-pink mt-1">Posts : {posts.length}</p>
      <p className="text-drac-orange">Comentários: {totalComments}</p>
      <p className="text-drac-red">Likes: {totalLikes}</p>
      <p className="text-drac-cyan ">
        Status da Conta:
        {user ? (
          <span className="text-drac-green shadow-glow-green">Online</span>
        ) : (
          <span className="text-drac-red shadow-glow-red">Offline</span>
        )}
      </p>
    </Card>
  );
}
