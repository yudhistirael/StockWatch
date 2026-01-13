"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, SlidersHorizontal } from "lucide-react";

const navItems = [
  { label: "Scanner", icon: BarChart3, href: "/" },
  { label: "Parameters", icon: SlidersHorizontal, href: "/parameters" }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-border/60 bg-card/70 p-5 lg:flex">
      <div className="mb-6">
        <div className="text-sm uppercase tracking-[0.2em] text-muted-foreground">IDX Screener</div>
        <div className="text-2xl font-semibold">Stockbit-style</div>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href.startsWith("/#")
            ? pathname === "/"
            : pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
                  : "border-transparent bg-accent/30 text-foreground hover:border-border/60 hover:bg-accent/50"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-emerald-300" : "text-muted-foreground"}`} />
              {item.label}
            </Link>
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
