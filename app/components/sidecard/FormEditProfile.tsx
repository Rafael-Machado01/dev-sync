"use client";

import { useActionState, useState } from "react";
import { updateUserProfile } from "@/app/actions";
import Label from "@/app/components/ui/Label";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import { tailwindData } from "@/app/constants/tailwindData";
import Avatar from "@/app/components/ui/Avatar";
import Image from "next/image";
import { User } from "@/app/types/User";
import type { FormState } from "@/app/actions";
import Popup from "@/app/components/ui/Popup";
import { useEdgeStore } from "@/app/lib/edgestore";

export default function FormEditProfile({ user }: { user: User }) {
  const [formState, formAction] = useActionState(updateUserProfile, {
    message: "",
    type: "success",
  } as FormState);

  const [newBackground, setNewBackground] = useState<string | null>(null);
  const [newAvatar, setNewAvatar] = useState<string | null>(null);

  const { edgestore } = useEdgeStore();

  const handleBackgroundChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const res = await edgestore.publicFiles.upload({
      file,
    });

    setNewBackground(res.url);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const res = await edgestore.publicFiles.upload({
      file,
    });

    setNewAvatar(res.url);
  };

  return (
    <>
      {formState.message && (
        <Popup message={formState.message} type={formState.type} />
      )}

      <form action={formAction}>
        <input type="hidden" name="id" value={user.id} />

        <input type="hidden" name="imageUrl" value={newAvatar ?? ""} />

        <input type="hidden" name="backgroundUrl" value={newBackground ?? ""} />

        {/* CAPA */}
        <div className="relative h-19">
          <label
            className="absolute inset-0 cursor-pointer"
            htmlFor="background"
          >
            <input
              type="file"
              accept="image/*"
              id="background"
              name="background"
              className="hidden"
              onChange={handleBackgroundChange}
            />

            <Image
              className="object-cover opacity-35"
              src={newBackground ?? user?.background ?? "/bgsetup.jpg"}
              alt={`Foto de capa de ${user?.name}`}
              fill
            />

            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #a855f733, #ec489911, transparent)",
              }}
            />

            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 40%, #18181b)",
              }}
            />

            <span className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 text-sm text-white opacity-0 transition-opacity hover:opacity-100">
              📷 Alterar capa
            </span>
          </label>
        </div>

        {/* AVATAR */}
        <div className="-mt-8 px-5 pb-5">
          <div className="relative h-14 w-14">
            <label className="absolute inset-0 cursor-pointer" htmlFor="image">
              <input
                type="file"
                accept="image/*"
                id="image"
                name="image"
                className="hidden"
                onChange={handleAvatarChange}
              />

              <Avatar
                src={newAvatar ?? user?.image ?? "/avatar.png"}
                alt={`Foto de perfil de ${user?.name}`}
                size={56}
                className="h-14 w-14"
              />

              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-xs text-white opacity-0 transition-opacity hover:opacity-100">
                📷
              </span>
            </label>
          </div>
        </div>

        {/* CAMPOS */}
        <div className="m-2 px-2">
          <Label text="Nome" htmlFor="name" />

          <Input
            id="name"
            name="name"
            placeholder="Digite o seu Nome"
            defaultValue={user.name || ""}
          />

          <Label id="title" text="Cargo" htmlFor="title" />

          <Input
            id="title"
            name="title"
            placeholder="ex: Dev Front end"
            defaultValue={user.title || ""}
          />

          <Label id="bio" text="Bio" htmlFor="bio" />

          <Input
            id="bio"
            name="bio"
            placeholder="Fale um pouco sobre você..."
            defaultValue={user.bio || ""}
          />

          <Label id="location" text="Localização" htmlFor="location" />

          <Input
            id="location"
            name="location"
            placeholder="ex: São Paulo, SP"
            defaultValue={user.location || ""}
          />

          <div className={tailwindData.centered}>
            <Button className={`${tailwindData.saveButton} mt-2`} type="submit">
              Salvar
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
