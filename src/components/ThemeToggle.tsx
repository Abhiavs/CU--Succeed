"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sa_theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(saved);
    } else {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = isDark ? "dark" : "light";
      setTheme(initial);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(initial);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("sa_theme", nextTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(nextTheme);
  };

  if (!mounted) {
    return (
      <div className="h-8 w-8 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900" />
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="h-8 w-8 rounded-lg border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-amber-400" />
      ) : (
        <Moon className="h-4 w-4 text-slate-800" />
      )}
    </Button>
  );
}
