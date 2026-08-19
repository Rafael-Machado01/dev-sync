import SideCardProfile from "./SideCardProfile";
import SideCardLoginButtons from "./SideCardLoginButtons";
import Card from "@/app/components/ui/Card";
import type { User } from "next-auth";

interface SideCardProps {
  isAuth: User | null;
}

export default async function SideCard({ isAuth }: SideCardProps) {
  return <Card>{isAuth ? <SideCardProfile /> : <SideCardLoginButtons />}</Card>;
}
