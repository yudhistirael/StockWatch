"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import type { ScanRow } from "@/lib/types";

interface ResultsTableProps {
  rows: ScanRow[];
  isLoading: boolean;
  onRowClick: (row: ScanRow) => void;
  weekendMode: boolean;
}

function formatNumber(value: number, digits = 2) {
  return value.toFixed(digits);
}

export function ResultsTable({ rows, isLoading, onRowClick, weekendMode }: ResultsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border/60 bg-card/60 p-4">
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-6 w-full animate-pulse rounded bg-muted/40" />
          ))}
        </div>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="rounded-lg border border-border/60 bg-card/60 p-8 text-center text-sm text-muted-foreground">
        Tidak ada hasil sesuai parameter. Coba longgarkan filter.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/60 bg-card/60">
      <Table className="table-dense">
        <TableHeader className="sticky top-0 z-10">
          <TableRow>
            <TableHead>Ticker</TableHead>
            <TableHead>Close</TableHead>
            <TableHead>Change %</TableHead>
            <TableHead>VWAPDist %</TableHead>
            <TableHead>Wick %</TableHead>
            <TableHead>Range %</TableHead>
            <TableHead>Value (B)</TableHead>
            <TableHead>Badge</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              className="cursor-pointer"
              onClick={() => onRowClick(row)}
            >
              <TableCell className="font-semibold">{row.name}</TableCell>
              <TableCell className="font-mono tabular-nums">{formatNumber(row.close)}</TableCell>
              <TableCell className="font-mono tabular-nums">
                <span className={row.change >= 0 ? "text-emerald-300" : "text-rose-300"}>
                  {formatNumber(row.change)}%
                </span>
              </TableCell>
              <TableCell className="font-mono tabular-nums">{formatNumber(row.vwapDistPct)}%</TableCell>
              <TableCell className="font-mono tabular-nums">{formatNumber(row.wickPct)}%</TableCell>
              <TableCell className="font-mono tabular-nums">{formatNumber(row.rangePct)}%</TableCell>
              <TableCell className="font-mono tabular-nums">{formatNumber(row.valueB)}</TableCell>
              <TableCell className="flex flex-wrap gap-1">
                {row.vwapDistPct >= 3 ? <Badge variant="positive">Strong</Badge> : null}
                {row.wickPct <= 0.3 ? <Badge variant="secondary">Clean Close</Badge> : null}
                {weekendMode ? <Badge variant="outline">Weekend</Badge> : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
