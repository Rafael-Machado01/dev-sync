"use client";
import { useFormState } from "react-dom";
import { updateUserProfile } from "@/app/actions";
import Label from "@/app/components/ui/Label";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import { tailwindData } from "@/app/constants/tailwindData";
import Avatar from "@/app/components/ui/Avatar";
import Image from "next/image";
import { useState } from "react";

import { User } from "@/app/types/User";

export default function FormEditProfile({ user }: { user: User }) {
  const [formState, formAction] = useFormState(updateUserProfile, {
    message: "",
    type: "success",
  });
  const [newBackground, setNewBackground] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null);

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setNewBackground(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      <div>{formState.message && <p>{formState.message}</p>}</div>

      <form action={formAction}>
        <div className="relative h-19">
          <label
            className="absolute inset-0 cursor-pointer"
            htmlFor="background"
          >
            <input
              type="file"
              id="background"
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
          </label>
        </div>
        <div className="relative mb-9">
          <label className="absolute inset-0 cursor-pointer" htmlFor="avatar">
            <input
              type="file"
              id="avatar"
              className="hidden"
              onChange={handleAvatarChange}
            />

            <div className="-mt-8 px-5 pb-5 pt-0">
              <Avatar
                src={newAvatar ?? user?.image ?? "/avatar.png"}
                alt={`Foto de perfil de ${user?.name}`}
                size={56}
              />
            </div>
          </label>
        </div>

        <div className="px-2 m-2">
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
            <Button
              className="bg-drac-purple text-drac-fg rounded-xl mt-2"
              type="submit"
            >
              Salvar
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
