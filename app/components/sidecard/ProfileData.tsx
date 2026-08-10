import { auth } from "auth";
import { getUserByEmail } from "@/app/actions";
import Image from "next/image";
import Avatar from "@/app/components/ui/Avatar";
import React from "react";
import LocationIcon from "@/app/components/svg/LocationIcon";

interface ProfileDataProps {
  children: React.ReactNode;
}

export default async function ProfileData({ children }: ProfileDataProps) {
  const session = await auth();
  const user = await getUserByEmail(session?.user?.email);

  return (
    <>
      <div className="relative h-19">
        <Image
          className="object-cover opacity-35"
          src={user?.background ?? "/bgsetup.jpg"}
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
            background: "linear-gradient(to bottom, transparent 40%, #18181b)",
          }}
        />
      </div>

      <div className="-mt-8 px-5 pb-5 pt-0">
        <Avatar
          src={user?.image}
          alt={`Foto de perfil de ${user?.name}`}
          size={56}
          ring
        />

        <div className="mt-2.5">
          <p className="text-sm font-bold text-drac-fg">{user?.name}</p>

          <p className="mt-0.5 text-xs text-drac-comment">
            {user?.title ?? "Newbie"}
          </p>
          <p className="mt-0.5 text-xs text-drac-comment">
            <LocationIcon className="inline-block size-2.5 text-drac-cyan mr-1" />
            {user?.location ?? "Earth"}
          </p>
          <div className="flex gap-2 mt-2"></div>
        </div>
        {children}
      </div>
    </>
  );
}
