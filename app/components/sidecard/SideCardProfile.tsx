import ProfileData from "@/app/components/sidecard/ProfileData";
import EditProfile from "@/app/components/sidecard/EditProfile";
import getCurrentUser from "@/app/lib/auth-user";

export default async function SideCardProfile() {
  const user = await getCurrentUser();
  return (
    <div className="overflow-hidden rounded-xl">
      <ProfileData user={user}>
        <EditProfile user={user} />
      </ProfileData>
    </div>
  );
}
