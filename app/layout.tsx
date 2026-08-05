import SideCard from '@/app/components/SideCard'
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body className={"bg-drac-darker"}>
      <SideCard/>
      {children}</body>
    </html>
  );
}
