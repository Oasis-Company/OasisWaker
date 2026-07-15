import React from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface StatsCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  delay?: number;
}

/**
 * Swiss Style stat card with optional red accent bar, trend indicator,
 * and staggered entrance animation.
 */
export const StatsCard = React.memo(function StatsCard({
  label,
  value,
  sub,
  accent = false,
  trend,
  trendValue,
  delay = 0,
}: StatsCardProps) {
  const trendColor =
    trend === "up"
      ? "text-swiss-red"
      : trend === "down"
        ? "text-swiss-gray-600"
        : "text-swiss-gray-400";

  const trendArrow =
    trend === "up" ? "↑" : trend === "down" ? "↓" : "→";

  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? { y: 0, opacity: 1 } : { y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.4, delay: delay / 1000, ease: "easeOut" }}
      className="card flex flex-col relative"
      role="region"
      aria-label={`${label}: ${value}`}
    >
      {/* Red accent bar */}
      {accent && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-swiss-red" />
      )}

      <p className="text-caption text-swiss-gray-500 mb-xs uppercase tracking-wider">
        {label}
      </p>

      <div className="flex items-baseline gap-md">
        <span className="text-hero-stat text-swiss-black" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </span>
        {trend && trendValue && (
          <span className={`${trendColor} text-body-bold`}>
            {trendArrow} {trendValue}
          </span>
        )}
      </div>

      {sub && (
        <p className="text-caption text-swiss-gray-400 mt-xs">{sub}</p>
      )}
    </motion.div>
  );
});