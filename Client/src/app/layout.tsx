import type { Metadata } from "next";
import { Suspense } from "react";
import { Archivo_Black, Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/providers/Providers";
import { Preloader } from "@/components/layout/Preloader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import "./globals.css";

const display = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
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
      <Preloader />
      <Header />
      <PageTransition>
        <main className="flex-1">{children}</main>
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
      className={`${display.variable} ${inter.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="grain flex min-h-full flex-col bg-bg text-text">
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
