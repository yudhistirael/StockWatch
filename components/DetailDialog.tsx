"use client";

import { CheckCircle2, Pin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import type { Mode, ScanRow } from "@/lib/types";

interface DetailDialogProps {
  row: ScanRow | null;
  mode: Mode;
  weekendMode: boolean;
  onClose: () => void;
  onPin: (ticker: string) => void;
}

function formatNumber(value: number, digits = 2) {
  return value.toFixed(digits);
}

export function DetailDialog({ row, mode, weekendMode, onClose, onPin }: DetailDialogProps) {
  const open = Boolean(row);
  const tpSl = weekendMode
    ? { tp: "1-2%", sl: "0.8-1.2%" }
    : { tp: "1.5-3%", sl: "1-1.5%" };

  return (
    <Dialog open={open} onOpenChange={(value) => (value ? null : onClose())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detail {row?.name ?? ""}</DialogTitle>
          <DialogDescription>
            Ringkasan metrik dan checklist eksekusi untuk {mode}.
          </DialogDescription>
        </DialogHeader>
        {row ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-border/60 bg-background/60 p-3 text-sm">
                <div className="text-xs text-muted-foreground">Close</div>
                <div className="font-mono text-lg tabular-nums">{formatNumber(row.close)}</div>
              </div>
              <div className="rounded-md border border-border/60 bg-background/60 p-3 text-sm">
                <div className="text-xs text-muted-foreground">VWAP</div>
                <div className="font-mono text-lg tabular-nums">{formatNumber(row.vwap)}</div>
              </div>
              <div className="rounded-md border border-border/60 bg-background/60 p-3 text-sm">
                <div className="text-xs text-muted-foreground">VWAP Dist</div>
                <div className="font-mono text-lg tabular-nums">{formatNumber(row.vwapDistPct)}%</div>
              </div>
              <div className="rounded-md border border-border/60 bg-background/60 p-3 text-sm">
                <div className="text-xs text-muted-foreground">Wick</div>
                <div className="font-mono text-lg tabular-nums">{formatNumber(row.wickPct)}%</div>
              </div>
              <div className="rounded-md border border-border/60 bg-background/60 p-3 text-sm">
                <div className="text-xs text-muted-foreground">Value</div>
                <div className="font-mono text-lg tabular-nums">{formatNumber(row.valueB)}B</div>
              </div>
              <div className="rounded-md border border-border/60 bg-background/60 p-3 text-sm">
                <div className="text-xs text-muted-foreground">Range</div>
                <div className="font-mono text-lg tabular-nums">{formatNumber(row.rangePct)}%</div>
              </div>
            </div>
            <div className="rounded-md border border-border/60 bg-card/80 p-3">
              <div className="mb-2 text-sm font-semibold">Checklist eksekusi Stockbit</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Konfirmasi VWAP di chart
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Cek order book bid/offer
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Hindari entry pre-closing
                </li>
              </ul>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary">Recommended TP {tpSl.tp}</Badge>
              <Badge variant="outline">Recommended SL {tpSl.sl}</Badge>
              {weekendMode ? <Badge variant="positive">Weekend</Badge> : null}
            </div>
          </div>
        ) : null}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {row ? (
            <Button onClick={() => onPin(row.name)}>
              <Pin className="h-4 w-4" />
              Pin to Watchlist
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
