import Image from "next/image";
import Avatar from "@/app/components/ui/Avatar";
import React from "react";
import LocationIcon from "@/app/components/svg/LocationIcon";
import { User } from "@/app/types/User";
import Line from "@/app/components/ui/Line";

interface ProfileDataProps {
  children: React.ReactNode;
  user: User;
}

export default async function ProfileData({
  children,
  user,
}: ProfileDataProps) {
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
          src={user?.image ?? "/avatar.png"}
          alt={`Foto de perfil de ${user?.name}`}
          size={56}
          className={`w-[56] h-[56] `}
          ring
        />

        <div className="mt-2.5">
          <p className="text-sm font-bold text-drac-fg">{user?.name}</p>

          <p className="mt-0.5 text-xs text-drac-comment">
            {user?.title ?? "Newbie"}
          </p>
          <Line className="mt-1.5" />
          <p className="mt-1 text-xs text-drac-comment">
            {user?.bio ?? "Make a edit profile"}
          </p>
          <p className="mt-0.5 text-xs text-drac-comment">
            <LocationIcon className="inline-block size-2.5 text-drac-green mr-1" />
            {user?.location ?? "Earth"}
          </p>
        </div>
        {children}
      </div>
    </>
  );
}
