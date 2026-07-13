"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  LayoutDashboard,
  Server,
  Link2,
  Settings,
  BookOpen,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/nodes", label: "Nodes", icon: Server },
  { href: "/connections", label: "Connections", icon: Link2 },
  { href: "/docs", label: "Docs", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-60 border-r border-swiss-gray-300 flex flex-col bg-swiss-white flex-shrink-0">
      {/* Logo */}
      <div className="h-16 border-b border-swiss-gray-300 flex items-center px-lg gap-md">
        <Activity className="w-5 h-5 text-swiss-black" />
        <span className="text-body-bold text-swiss-black">OasisWaker</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-lg" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive(item.href) ? "nav-item-active" : ""}`}
              aria-current={isActive(item.href) ? "page" : undefined}
              tabIndex={0}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-swiss-gray-300 p-lg">
        <div className="flex items-center gap-md mb-md">
          <div className="w-8 h-8 bg-swiss-black flex items-center justify-center">
            <User className="w-4 h-4 text-swiss-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-caption text-swiss-black truncate">
              {user?.full_name || user?.email || "User"}
            </p>
            <p className="text-caption text-swiss-gray-400 truncate">
              {user?.email || ""}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="nav-item w-full text-swiss-gray-500 hover:text-swiss-red"
          aria-label="Sign out"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}