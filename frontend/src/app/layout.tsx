import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "OasisWaker — Crowdsourced Edge Infrastructure",
  description:
    "Your free cloud quotas, aggregated into infrastructure no single company controls.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}