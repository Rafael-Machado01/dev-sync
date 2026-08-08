import Logo from "@/app/components/svg/Logo";
import Button from "@/app/components/Button";
import { logout } from "@/app/actions";
import LogoutIcon from "./svg/LogoutIcon";
export default function NavBar() {
  return (
    <header
      className={
        "sticky top-0 z-50 bg-drac-darker backdrop-blur-xl border-b border-b-drac-line shadow-lg"
      }
    >
      <div className="h-15.5 flex items-center justify-center">
        <Logo />
        <Button
          type="button"
          onClick={logout}
          className="absolute right-8 hover:text-drac-red"
          icon={<LogoutIcon className="size-5 hover:text-drac-red" />}
        >
          LOGOUT
        </Button>
      </div>
    </header>
  );
}
