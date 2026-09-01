import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SahayakDock } from "@/components/ai/SahayakDock";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto-devanagari",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Jan Ganana 2027 · Census 2027 Digital Enumeration Platform",
  description:
    "India's first fully digital national census platform. Secure self-enumeration, two-phase breakdown, state survey schedules, legal privacy safeguards under Census Act 1948 Section 15, and demographic analytics.",
  keywords: [
    "Census 2027",
    "Digital Census India",
    "Jan Ganana 2027",
    "Self-Enumeration Portal",
    "House Listing Operations",
    "Population Enumeration",
    "Census Act 1948",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoDevanagari.variable}`}>
      <body className="min-h-screen flex flex-col bg-background font-sans antialiased selection:bg-saffron/20 selection:text-saffron-dark">
        <LanguageProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <SahayakDock />
        </LanguageProvider>
      </body>
    </html>
  );
}
