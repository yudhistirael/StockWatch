import type { Metadata } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "IDX Screener",
  description: "Stockbit-style IDX screener for BTST/BPJS watchlists"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sora.variable} ${jetbrains.variable} font-sans`}> 
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
