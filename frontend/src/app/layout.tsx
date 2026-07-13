import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "OasisWaker v2.0 — Network Dashboard",
  description: "Central coordination dashboard for the OasisWaker decentralized edge storage network",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-3xl max-w-7xl mx-auto">{children}</div>
        </main>
      </body>
    </html>
  );
}