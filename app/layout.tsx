import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import { AuthProvider } from "@/components/auth/auth-provider";
import { ProtectedApp } from "@/components/auth/protected-app";
import { ToastProvider } from "@/components/ui/toast";
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
        {/* A6: ProtectedApp gates the app. When Supabase is configured it
            requires sign-in and backs the dashboard with per-user cloud data;
            otherwise it falls back to local-only mode (Gate 1). Store
            hydration/migration is handled by the sync controller. */}
        <ToastProvider>
          <AuthProvider>
            <ProtectedApp>{children}</ProtectedApp>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
