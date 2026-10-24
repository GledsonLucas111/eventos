import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Eventos | Gerenciamento",
  description: "Cadastro e gerenciamento de eventos",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
