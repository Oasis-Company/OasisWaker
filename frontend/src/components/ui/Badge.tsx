import React from "react";

interface BadgeProps {
  variant?: "online" | "offline" | "error" | "default";
  children: React.ReactNode;
}

export function Badge({ variant = "default", children }: BadgeProps) {
  const styles = {
    online: "bg-swiss-black text-swiss-white",
    offline: "bg-swiss-gray-200 text-swiss-gray-500",
    error: "bg-swiss-red text-swiss-white",
    default: "bg-swiss-gray-100 text-swiss-gray-500",
  };

  return (
    <span
      className={`inline-block text-caption px-sm py-2xs font-semibold ${styles[variant]}`}
    >
      {children}
    </span>
  );
}