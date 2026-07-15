"use client";

import { type ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { AppShell } from "@/components/layout/AppShell";

/**
 * Combines all client-side providers (AuthProvider, AppShell) into a single
 * client component so the root layout can remain a server component.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}