"use client";

import { BarChart3, ListFilter, Settings } from "lucide-react";

const navItems = [
  { label: "Scanner", icon: BarChart3 },
  { label: "Watchlist", icon: ListFilter },
  { label: "Settings", icon: Settings }
];

export function Sidebar() {
  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-border/60 bg-card/70 p-5 lg:flex">
      <div className="mb-6">
        <div className="text-sm uppercase tracking-[0.2em] text-muted-foreground">IDX Screener</div>
        <div className="text-2xl font-semibold">Stockbit-style</div>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-lg border border-transparent bg-accent/30 px-3 py-2 text-sm font-medium text-foreground"
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
              {item.label}
            </div>
          );
        })}
      </nav>
      <div className="mt-auto rounded-lg border border-border/60 bg-background/60 p-4 text-xs text-muted-foreground">
        TradingView scanner bukan tick-by-tick realtime. Gunakan hasil ini untuk watchlist,
        eksekusi final tetap di Stockbit.
      </div>
    </aside>
  );
}
