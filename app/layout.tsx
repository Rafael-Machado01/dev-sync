import "./globals.css";
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body className={"bg-drac-darker"}>{children}</body>
    </html>
  );
}
