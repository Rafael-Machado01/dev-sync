import Logo from '@/app/components/svg/Logo'
export default function NavBar() {
    return (
        <header className={"sticky top-0 z-50 bg-drac-darker backdrop-blur-xl border-b border-b-drac-line shadow-lg"}>
            <div className="height-[62px] flex items-center justify-center">
                <Logo/>
            </div>
        </header>
    )
}