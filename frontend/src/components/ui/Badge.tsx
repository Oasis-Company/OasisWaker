import React from "react";

const variantStyles: Record<string, string> = {
  online: "bg-swiss-black text-swiss-white",
  offline: "bg-swiss-gray-200 text-swiss-gray-500",
  error: "bg-swiss-red text-swiss-white",
  default: "bg-swiss-gray-100 text-swiss-gray-600",
};

interface BadgeProps {
  variant?: "online" | "offline" | "error" | "default";
  children: React.ReactNode;
}

export const Badge = React.memo(function Badge({
  variant = "default",
  children,
}: BadgeProps) {
  const label = typeof children === "string" ? children : String(children);

  return (
    <span
      className={`inline-block px-sm py-2xs text-caption font-medium ${variantStyles[variant]}`}
      role="status"
      aria-label={`Status: ${label}`}
      aria-live="polite"
      tabIndex={0}
    >
      {children}
    </span>
  );
});