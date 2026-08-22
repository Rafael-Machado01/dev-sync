import Logo from "@/app/components/svg/Logo";
import Button from "@/app/components/ui/Button";
import { logout } from "@/app/actions";
import LogoutIcon from "./svg/LogoutIcon";
import { tailwindData } from "../constants/tailwindData";
import { User } from "../types/User";
interface NavBarProps {
  isAuth: User | null;
}
export default function NavBar({ isAuth }: NavBarProps) {
  return (
    <header
      className={
        "sticky top-0 z-50 bg-drac-darker backdrop-blur-xl border-b border-b-drac-line shadow-lg"
      }
    >
      <div className={`h-15.5 ${tailwindData.centered}`}>
        <Logo />
        {isAuth && (
          <Button
            type="button"
            onClick={logout}
            className="absolute right-8 text-drac-comment hover:text-drac-red"
            icon={<LogoutIcon className="size-5  hover:text-drac-red" />}
          >
            LOGOUT
          </Button>
        )}
      </div>
    </header>
  );
}
