import type { ComponentType, SVGProps } from "react";
import GoogleLogo from "@/app/components/svg/GoogleLogo";
import GitHubLogo from "@/app/components/svg/GitHubLogo";

interface LoginProvider {
  name: "Google" | "GitHub";
  provider: "google" | "github";
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const loginProviders: LoginProvider[] = [
  { name: "Google", provider: "google", icon: GoogleLogo },
  { name: "GitHub", provider: "github", icon: GitHubLogo },
];
