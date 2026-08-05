import {signInWithProvider} from "@/app/actions"
import Button from "@/app/components/Button"
import GoogleLogo from "@/app/components/svg/GoogleLogo";
import GitHubLogo from "@/app/components/svg/GitHubLogo";
import Logo from '@/app/components/svg/Logo'
import {tailwindData} from "@/app/constants/tailwindData";

export default function SideCardLoginButtons() {
    return(
        <main className={"flex flex-col gap-2 justify-center items-center"}>
                <Logo/>
            <form action={signInWithProvider.bind(null, "google")}>
                <Button type={"submit"} icon={<GoogleLogo className={"size-5"}/>} className={tailwindData.signInButton}>
                    Entre com google</Button>
            </form>
            <form action={signInWithProvider.bind(null,"github")}>
                <Button type={"submit"} icon={<GitHubLogo className={"size-5"}/>} className={tailwindData.signInButton}>
                    Entre com GitHub</Button>
            </form>

        </main>
    )
}