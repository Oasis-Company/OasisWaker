"use client";

import { useState, useEffect } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   useReducedMotion — Detects user's prefers-reduced-motion preference
   Returns true when the user has requested reduced motion.
   Falls back to false during SSR.
   ────────────────────────────────────────────────────────────────────────── */

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}