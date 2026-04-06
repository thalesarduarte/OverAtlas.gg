import type { Metadata } from "next";
import "./globals.css";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteSidebar } from "@/components/layout/site-sidebar";
import { AppProviders } from "@/components/providers/app-providers";

export const metadata: Metadata = {
  title: "OverAtlas",
  description: "Hub de Overwatch com perfis, comparação, times, campeonatos e notícias."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="overflow-x-hidden">
        <AppProviders>
          <SiteHeader />
          <main className="mx-auto flex min-h-[calc(100vh-170px)] w-full max-w-[1500px] gap-8 px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex-1">
              <div className="space-y-8">{children}</div>
            </div>
            <SiteSidebar />
          </main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
