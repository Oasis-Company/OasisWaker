import React from "react";

interface StatsCardProps {
  label: string;
  value: string | number;
  sub?: string;
}

export function StatsCard({ label, value, sub }: StatsCardProps) {
  return (
    <div className="card">
      <p className="text-caption text-swiss-gray-500 mb-xs uppercase tracking-wider">
        {label}
      </p>
      <p className="text-h1 text-swiss-black">{value}</p>
      {sub && (
        <p className="text-caption text-swiss-gray-400 mt-xs">{sub}</p>
      )}
    </div>
  );
}