"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  modeLabel: string;
  lastScanAt?: string;
  isLoading: boolean;
  onScan: () => void;
  showScan?: boolean;
  showStatus?: boolean;
}

export function Topbar({
  modeLabel,
  lastScanAt,
  isLoading,
  onScan,
  showScan = true,
  showStatus = true
}: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 bg-background/80 px-6 py-4 backdrop-blur">
      <div className="flex flex-col gap-1">
        <div className="text-xl font-semibold">IDX Screener</div>
        {showStatus ? (
          <div className="text-xs text-muted-foreground">
            Last scan: {lastScanAt ?? "Belum ada"}
          </div>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="secondary">Mode: {modeLabel}</Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {mounted ? (
            <>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {isDark ? "Light" : "Dark"}
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              Theme
            </>
          )}
        </Button>
        {showScan ? (
          <Button onClick={onScan} disabled={isLoading}>
            {isLoading ? "Scanning..." : "Scan"}
          </Button>
        ) : null}
      </div>
    </header>
  );
}
