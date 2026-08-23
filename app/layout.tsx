import "./globals.css";
import { EdgeStoreProvider } from "@/app/lib/edgestore";
import { jetbrains_mono } from "./fonts";
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body className={`bg-drac-darker ${jetbrains_mono.className}`}>
        <EdgeStoreProvider>{children}</EdgeStoreProvider>
      </body>
    </html>
  );
}
