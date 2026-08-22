import TextArea from "../ui/TextArea";
import Button from "../ui/Button";
import Avatar from "../ui/Avatar";
import { tailwindData } from "@/app/constants/tailwindData";
import { useState } from "react";
import { addComment } from "@/app/actions";

import type { Post as PostType } from "@/app/types/Post";
import type { User as UserType } from "@/app/types/User";
import Popup from "../ui/Popup";

interface NewCommentProps {
  post: PostType;
  user: UserType | null;
}
export default function NewComment({ post, user }: NewCommentProps) {
  const [content, setContent] = useState("");
  const [popups, setPopups] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

  const handleAddComment = async () => {
    if (!user) {
      return null;
    }
    if (content.trim().length < 5) {
      setPopups({
        message: "O comentário não pode estar vazio.",
        type: "error",
      });
      return null;
    }
    await addComment(post.id, content);
    setPopups({
      message: "Comentário adicionado",
      type: "success",
    });
    setContent("");
  };
  return (
    <>
      {popups && <Popup message={popups.message} type={popups.type} />}
      <div className="flex items-center mt-1 gap-2">
        <Avatar
          src={user?.image || "/avatar.png"}
          size={44}
          alt="Sua imagem de perfi"
        />
        <TextArea
          rows={1}
          placeholder="// escreva um comentário"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button
          type="submit"
          className={
            content.length >= 5
              ? tailwindData.saveButton
              : tailwindData.disabledButton
          }
          onClick={handleAddComment}
        >
          {"Comentar"}
        </Button>
      </div>
    </>
  );
}
