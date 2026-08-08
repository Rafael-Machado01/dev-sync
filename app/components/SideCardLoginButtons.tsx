import { signInWithProvider } from "@/app/actions";
import Button from "@/app/components/Button";
import Logo from "@/app/components/svg/Logo";
import { tailwindData } from "@/app/constants/tailwindData";
import { loginProviders } from "@/app/constants/login-providers";

export default function SideCardLoginButtons() {
  return (
    <main className={"flex flex-col gap-2 justify-center items-center"}>
      <Logo />
      {loginProviders.map((provider) => {
        const Icon = provider.icon;
        return (
          <form
            key={provider.provider}
            action={signInWithProvider.bind(null, provider.provider)}
          >
            <Button
              type="submit"
              className={tailwindData.signInButton}
              icon={<Icon className="size-5" />}
            >
              Entre com {provider.name}
            </Button>
          </form>
        );
      })}
    </main>
  );
}
