"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/context/AuthContext";

/* ── App routes that show the sidebar ────────────────────────────────────── */
const APP_ROUTES = [
  "/dashboard",
  "/nodes",
  "/connections",
  "/docs",
  "/settings",
  "/settings/api-keys",
];

function isAppRoute(path: string): boolean {
  return APP_ROUTES.some((route) => path.startsWith(route));
}

/* ── Auth routes that have their own layout (no sidebar) ─────────────────── */
const AUTH_ROUTES = ["/login", "/signup", "/auth/callback"];

function isAuthRoute(path: string): boolean {
  return AUTH_ROUTES.some((route) => path.startsWith(route));
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  // Landing page — no sidebar, no auth guard
  if (pathname === "/") {
    return <>{children}</>;
  }

  // Auth routes (login, signup, callback) — no sidebar
  if (isAuthRoute(pathname)) {
    return <>{children}</>;
  }

  // App routes — show sidebar with auth guard
  if (isAppRoute(pathname)) {
    // Show loading state while checking auth
    if (isLoading) {
      return (
        <div className="flex h-screen items-center justify-center bg-swiss-white">
          <div className="text-center">
            <div className="w-10 h-1 bg-swiss-black mb-md mx-auto" />
            <p className="text-body text-swiss-gray-500">Loading...</p>
          </div>
        </div>
      );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      // Use window.location for a hard redirect (clears any stale state)
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return null;
    }

    return (
      <div className="flex h-screen bg-swiss-white">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-lg py-2xl">{children}</div>
        </main>
      </div>
    );
  }

  // Fallback — render children as-is
  return <>{children}</>;
}