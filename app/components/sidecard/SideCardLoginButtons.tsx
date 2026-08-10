import { signInWithProvider } from "@/app/actions";
import Button from "@/app/components/ui/Button";
import Logo from "@/app/components/svg/Logo";
import { tailwindData } from "@/app/constants/tailwindData";
import { loginProviders } from "@/app/constants/login-providers";

export default function SideCardLoginButtons() {
  return (
    <main
      className={
        "flex flex-col gap-2 border-none p-2 justify-center  items-center"
      }
    >
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
              className={`${tailwindData.signInButton} shadow-2xl `}
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
