import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ISE2 - Dashboard Marges de Transport",
  description: "Application locale de suivi et analyse des enquetes Kobo ISE2"
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
