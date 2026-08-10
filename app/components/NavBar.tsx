import Logo from "@/app/components/svg/Logo";
import Button from "@/app/components/ui/Button";
import { logout } from "@/app/actions";
import LogoutIcon from "./svg/LogoutIcon";
import getCurrentUser from "@/app/lib/auth-user";
import { tailwindData } from "../constants/tailwindData";
export default async function NavBar() {
  const isLoggedIn = await getCurrentUser();
  return (
    <header
      className={
        "sticky top-0 z-50 bg-drac-darker backdrop-blur-xl border-b border-b-drac-line shadow-lg"
      }
    >
      <div className={`h-15.5 ${tailwindData.centered}`}>
        <Logo />
        {isLoggedIn ? (
          <Button
            type="button"
            onClick={logout}
            className="absolute right-8 text-drac-comment hover:text-drac-red"
            icon={<LogoutIcon className="size-5  hover:text-drac-red" />}
          >
            LOGOUT
          </Button>
        ) : (
          <></>
        )}
      </div>
    </header>
  );
}
