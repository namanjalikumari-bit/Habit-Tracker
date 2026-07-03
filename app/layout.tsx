import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import { StoreHydrator } from "@/components/providers/store-hydrator";
import "./globals.css";

/**
 * Roboto is the reference-confirmed typeface (Master-Design-Spec §7).
 * Weights map to the type scale: 400 (body/xs), 500 (small), 700 (everything
 * else — headings, labels, KPI numbers).
 */
const roboto = Roboto({
  variable: "--font-roboto-variable",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Smart Habit Tracker",
  description: "Track your daily habits and visualise your monthly progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <StoreHydrator />
        {children}
      </body>
    </html>
  );
}
