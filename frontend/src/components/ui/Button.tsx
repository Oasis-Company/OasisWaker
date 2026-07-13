import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base = "font-semibold transition-colors cursor-pointer";

  const variants = {
    primary: "bg-swiss-black text-swiss-white hover:bg-swiss-gray-700",
    secondary: "bg-swiss-white text-swiss-black border border-swiss-black hover:bg-swiss-gray-100",
    ghost: "bg-transparent text-swiss-gray-500 hover:text-swiss-black hover:bg-swiss-gray-100",
    danger: "bg-swiss-red text-swiss-white hover:bg-red-700",
  };

  const sizes = {
    sm: "text-caption px-sm py-xs",
    md: "text-body px-md py-sm",
    lg: "text-body px-lg py-md",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}