"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Server,
  Link2,
  Settings,
  Activity,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/nodes", label: "Nodes", icon: Server },
  { href: "/connections", label: "Connections", icon: Link2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 h-screen border-r border-swiss-gray-300 bg-swiss-white flex flex-col">
      {/* Logo */}
      <div className="px-lg py-xl border-b border-swiss-gray-300">
        <Link href="/dashboard" className="flex items-center gap-md">
          <Activity className="w-6 h-6 text-swiss-black" />
          <span className="text-h3 font-bold text-swiss-black">OasisWaker</span>
        </Link>
        <span className="text-caption text-swiss-gray-400 mt-xs block">
          v2.0 — Network Dashboard
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-md">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? "nav-item-active" : "nav-item"}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-lg py-md border-t border-swiss-gray-300">
        <div className="flex items-center gap-md">
          <div className="w-2 h-2 bg-swiss-black rounded-none" />
          <span className="text-caption text-swiss-gray-500">
            All systems nominal
          </span>
        </div>
      </div>
    </aside>
  );
}