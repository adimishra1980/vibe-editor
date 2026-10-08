"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <button
      type="button"
      className="cursor-pointer"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Moon className="h-5 w-5 dark:hidden" />

      <Sun className="hidden h-5 w-5 dark:block" />
    </button>
  );
}
