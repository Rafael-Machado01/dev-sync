"use client";
import { User } from "@/app/types/User";
import { useActionState, useState, useEffect } from "react";
import Card from "@/app/components/ui/Card";
import Popup from "../ui/Popup";
import Avatar from "@/app/components/ui/Avatar";
import TextArea from "@/app/components/ui/TextArea";
import ImagePreview from "../ui/ImagePreview";
import Button from "../ui/Button";
import { tailwindData } from "@/app/constants/tailwindData";
import { FormState, newPost } from "@/app/actions";

interface NewPostProps {
  isAuth: User;
}

export default function NewPost({ isAuth }: NewPostProps) {
  const [imageKey, setImageKey] = useState(0);
  const [canPost, setCanPost] = useState("");

  const initialState: FormState = {
    message: "",
    type: "success",
  }; // Isso cria uma const tipada FormState

  const [formState, formAction] = useActionState(newPost, initialState);
  useEffect(() => {
    if (!formState.message || formState.type !== "success") {
      return;
    }
    setCanPost("");
    setImageKey((prev) => prev + 1);
  }, [formState.message, formState.type]);

  return (
    <Card hover={true} className={`p-2`}>
      <div>
        {formState.message && (
          <Popup message={formState.message} type={formState.type} />
        )}
      </div>
      <form className="flex flex-col p-2" action={formAction}>
        <input type="hidden" name="id" id="id" value={isAuth.id} />
        <div className="flex gap-3">
          <Avatar
            size={44}
            src={isAuth.image ?? "/avatar.png"}
            alt={`Foto de perfil de ${isAuth.name}`}
            className="w-[44] h-[44]"
            ring
          />
          <TextArea
            onChange={(e) => setCanPost(e.target.value)}
            minLength={5}
            maxLength={225}
            name="caption"
            rows={5}
            cols={33}
            placeholder="// compartilhe conhecimento com a rede... "
          />
        </div>
        <div className="flex items-end justify-between mt-2">
          <ImagePreview key={imageKey} />
          <Button
            className={
              canPost.length >= 5
                ? tailwindData.saveButton
                : tailwindData.disabledButton
            }
          >
            Publicar
          </Button>
        </div>
      </form>
    </Card>
  );
}
