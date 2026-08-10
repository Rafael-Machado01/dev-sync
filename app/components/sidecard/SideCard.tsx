import getCurrentUser from "@/app/lib/auth-user";
import SideCardProfile from "./SideCardProfile";
import SideCardLoginButtons from "./SideCardLoginButtons";
import Card from "@/app/components/ui/Card";

export default async function SideCard() {
  const isLoggedIn = await getCurrentUser();
  return (
    <Card>{isLoggedIn ? <SideCardProfile /> : <SideCardLoginButtons />}</Card>
  );
}
