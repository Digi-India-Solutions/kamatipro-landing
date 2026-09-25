"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string, fallback = false) {
  const [matches, setMatches] = useState(fallback);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}

export function useIsDesktop(min = 900) {
  return useMediaQuery(`(min-width: ${min}px)`, true);
}

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)", false);
}