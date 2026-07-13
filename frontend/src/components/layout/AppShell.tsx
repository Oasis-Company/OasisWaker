"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";

const APP_ROUTES = new Set([
  "/dashboard",
  "/nodes",
  "/connections",
  "/settings",
]);

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAppRoute =
    APP_ROUTES.has(pathname) || pathname.startsWith("/nodes/");

  if (isAppRoute) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-3xl max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    );
  }

  return <>{children}</>;
}