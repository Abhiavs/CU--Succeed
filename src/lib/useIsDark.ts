"use client";

import { useEffect, useState } from "react";

/*
 * Tracks whether dark mode is active on <html>.
 *
 * SVG presentation attributes (fill=, stroke=) cannot carry var(), so
 * charts that must follow the theme read the mode here instead of using
 * CSS custom properties. The MutationObserver keeps every mounted chart
 * in sync when the theme toggle flips.
 *
 * The light default matches globals.css, so the first render is correct
 * before the effect runs.
 */
export function useIsDark() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setIsDark(root.classList.contains("dark"));

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return isDark;
}
