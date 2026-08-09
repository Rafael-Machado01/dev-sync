import Image from "next/image";
import { auth } from "auth";
import { getUserByEmail } from "@/app/actions";
import Avatar from "@/app/components/Avatar";
import Button from "@/app/components/Button";

export default async function SideCardProfile() {
  const session = await auth();
  const user = await getUserByEmail(session?.user?.email);

  return (
    <div className="overflow-hidden rounded-xl">
      <div className="relative h-19">
        <Image
          className="object-cover opacity-35"
          src="/bgsetup.jpg"
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

          <p className="mt-0.5 text-xs text-drac-comment">Devloper</p>
        </div>

        <Button className="mt-3.5 w-full text-sm rounded-lg border border-drac-purple bg-transparent text-drac-purple hover:bg-drac-darker hover:text-drac-cyan">
          [ EDITAR PERFIL ]
        </Button>
      </div>
    </div>
  );
}
