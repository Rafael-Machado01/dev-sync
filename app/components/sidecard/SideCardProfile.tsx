import ProfileData from "@/app/components/sidecard/ProfileData";
import EditProfile from "@/app/components/sidecard/EditProfile";
import { getUserByEmail } from "@/app/actions";
import getCurrentUser from "@/app/lib/auth-user";

export default async function SideCardProfile() {
  const session = await getCurrentUser();
  if (!session) return null;
  const user = await getUserByEmail(session.email ?? null);
  if (!user) return null;
  return (
    <div className="overflow-hidden rounded-xl">
      <ProfileData user={user}>
        <EditProfile user={user} />
      </ProfileData>
    </div>
  );
}
