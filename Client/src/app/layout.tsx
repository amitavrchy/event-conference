import type { Metadata } from "next";
import { Suspense } from "react";
import {
  DM_Sans,
  Inter,
  JetBrains_Mono,
  Instrument_Serif,
} from "next/font/google";
import { Providers } from "@/providers/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import "./globals.css";

const display = DM_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
});

const editorial = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NEXUS Conf 2026",
    template: "%s · NEXUS Conf 2026",
  },
  description:
    "NEXUS Conf 2026 — three days that reshape how you build. Design×tech festival in Dhaka, Sep 18–20.",
  openGraph: {
    title: "NEXUS Conf 2026",
    description: "Three days that reshape how you build.",
    type: "website",
  },
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <PageTransition>
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </PageTransition>
    </Providers>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${inter.variable} ${mono.variable} ${editorial.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-text">
        <Suspense
          fallback={
            <div className="flex min-h-full flex-1 items-center justify-center bg-bg text-muted">
              Loading NEXUS…
            </div>
          }
        >
          <Shell>{children}</Shell>
        </Suspense>
      </body>
    </html>
  );
}
