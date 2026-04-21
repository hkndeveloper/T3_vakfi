import type { Metadata } from "next";
import { Lexend, Source_Sans_3 } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
});

export const metadata: Metadata = {
  title: "T3 Topluluk Yönetim Sistemi",
  description: "T3 Vakfı üniversite topluluk yönetim platformu",
};

import { SessionProvider } from "@/components/providers/SessionProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${lexend.variable} ${sourceSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-source-sans">
        <SessionProvider>
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Toaster richColors position="top-right" />
        </SessionProvider>
      </body>
    </html>
  );
}
