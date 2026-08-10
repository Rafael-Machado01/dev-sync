import ProfileData from "@/app/components/sidecard/ProfileData";
import EditProfile from "@/app/components/sidecard/EditProfile";

export default function SideCardProfile() {
  return (
    <div className="overflow-hidden rounded-xl">
      <ProfileData>
        <EditProfile />
      </ProfileData>
    </div>
  );
}
