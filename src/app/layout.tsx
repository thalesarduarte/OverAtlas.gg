import type { Metadata } from "next";
import "./globals.css";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AppProviders } from "@/components/providers/app-providers";

export const metadata: Metadata = {
  title: "OverAtlas",
  description: "Hub de Overwatch com perfis, comparação, times, campeonatos e notícias."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <AppProviders>
          <SiteHeader />
          <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-7xl flex-col gap-8 px-6 py-8">
            {children}
          </main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
