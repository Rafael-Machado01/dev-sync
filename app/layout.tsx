import './globals.css'
import NavBar from '@/app/components/NavBar'
import SideCard from '@/app/components/SideCard'
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body className={"bg-drac-darker"}>
      <NavBar/>
      <SideCard/>
      {children}</body>
    </html>
  );
}
