"use client";

import { Copy, PinOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WatchlistPanelProps {
  tickers: string[];
  onCopy: () => void;
  onRemove: (ticker: string) => void;
}

export function WatchlistPanel({ tickers, onCopy, onRemove }: WatchlistPanelProps) {
  return (
    <Card className="h-full border-border/60 bg-card/80">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Watchlist</CardTitle>
        <Button variant="outline" size="xs" onClick={onCopy} disabled={!tickers.length}>
          <Copy className="h-4 w-4" />
          Copy
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {tickers.length === 0 ? (
          <div className="rounded-md border border-border/60 bg-background/60 p-4 text-xs text-muted-foreground">
            Belum ada ticker dipin. Klik row lalu Pin to Watchlist.
          </div>
        ) : (
          tickers.map((ticker) => (
            <div key={ticker} className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2 text-sm">
              <span className="font-semibold">{ticker}</span>
              <Button variant="ghost" size="xs" onClick={() => onRemove(ticker)}>
                <PinOff className="h-4 w-4" />
                Remove
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
