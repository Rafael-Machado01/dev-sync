import {getUserByEmail} from "@/app/actions";
import {auth} from 'auth';

export default async function SideCard() {

    const session = await auth();
    const user = await getUserByEmail(session?.user.email);

    return (
        <main>
            {user ? (
                <h1>Logado</h1>
            ) : (
                <h1>Login</h1>
            )}
        </main>
    )
}