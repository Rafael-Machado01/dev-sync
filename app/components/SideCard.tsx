import {getUserByEmail} from "@/app/actions";
import {auth} from 'auth';
import SideCardLoginButtons from "@/app/components/SideCardLoginButtons";

export default async function SideCard() {

    const session = await auth();
    console.log(session);
    const user = await getUserByEmail(session?.user.email);
    console.log(user);
    return (
        <main className={"bg-drac-card "}>
            {user ? (
                <h1>A</h1>
            ): (
                <SideCardLoginButtons/>
            )}
        </main>
    )
}