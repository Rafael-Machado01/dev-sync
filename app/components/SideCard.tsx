import getCurrentUser from "@/app/lib/auth-user";
import SideCardProfile from "./SideCardProfile";
import SideCardLoginButtons from "./SideCardLoginButtons";
import Card from "@/app/components/Card";

export default async function SideCard() {
  const isLoggedIn = await getCurrentUser();
  console.log(isLoggedIn);
  return (
    <Card>{isLoggedIn ? <SideCardProfile /> : <SideCardLoginButtons />}</Card>
  );
}
