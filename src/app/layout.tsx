import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Migración Odoo 17 → 19 · MacStation",
  description:
    "Control compartido de migración de módulos web-macstation de Odoo 17 a 19",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
