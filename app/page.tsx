"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlarmClock,
  ArrowDownUp,
  BarChart3,
  ListFilter
} from "lucide-react";

import { DetailDialog } from "@/components/DetailDialog";
import { ResultsTable } from "@/components/ResultsTable";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { WatchlistPanel } from "@/components/WatchlistPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { defaultParams, loadParams, saveParams } from "@/lib/params";
import type { Mode, ScanRow, ScannerParams } from "@/lib/types";

const sortOptions = [
  { value: "valueB", label: "Value (B)" },
  { value: "change", label: "Change %" },
  { value: "vwapDistPct", label: "VWAPDist %" },
  { value: "wickPct", label: "Wick %" }
] as const;

type SortKey = (typeof sortOptions)[number]["value"];

type SortOrder = "asc" | "desc";

function useDebouncedValue(value: string, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);

  return debounced;
}

export default function Page() {
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("BTST");
  const [params, setParams] = useState<ScannerParams>(defaultParams.BTST);
  const [rows, setRows] = useState<ScanRow[]>([]);
  const [selectedRow, setSelectedRow] = useState<ScanRow | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastScanAt, setLastScanAt] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("valueB");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    setParams(loadParams(mode));
  }, [mode]);

  useEffect(() => {
    saveParams(mode, params);
  }, [mode, params]);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("watchlist") : null;
    if (stored) {
      try {
        setWatchlist(JSON.parse(stored));
      } catch {
        setWatchlist([]);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }
  }, [watchlist]);

  const effectiveParams = useMemo(() => {
    if (mode !== "BTST" || !params.weekendMode) {
      return params;
    }

    return {
      ...params,
      minValueB: Math.max(params.minValueB, 3),
      maxChange: Math.min(params.maxChange, 8),
      minVwapDist: Math.max(params.minVwapDist, 1.0),
      maxWick: Math.min(params.maxWick, 0.7),
      volMultiplier: Math.max(params.volMultiplier, 1.6)
    };
  }, [mode, params]);

  const filteredRows = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    const filtered = rows.filter((row) => {
      if (query && !row.name.toLowerCase().includes(query)) {
        return false;
      }

      if (row.valueB < effectiveParams.minValueB) {
        return false;
      }
      if (row.close < effectiveParams.minPrice) {
        return false;
      }
      if (row.change < effectiveParams.minChange || row.change > effectiveParams.maxChange) {
        return false;
      }
      if (row.volume < row.avgVol10 * effectiveParams.volMultiplier) {
        return false;
      }
      if (row.vwapDistPct < effectiveParams.minVwapDist) {
        return false;
      }
      if (mode === "BTST" && row.wickPct > effectiveParams.maxWick) {
        return false;
      }
      if (effectiveParams.rangeEnabled && row.rangePct > effectiveParams.maxRangePct) {
        return false;
      }
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      const delta = a[sortKey] - b[sortKey];
      return sortOrder === "asc" ? delta : -delta;
    });

    return sorted;
  }, [rows, debouncedSearch, effectiveParams, mode, sortKey, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortKey, sortOrder, pageSize, mode, params]);

  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  const handleScan = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/scan");
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        const message = data?.error || "Scan gagal";
        setError(message);
        toast({ title: "Scan gagal", description: message });
        setIsLoading(false);
        return;
      }
      setRows(data.rows || []);
      setLastScanAt(new Date().toLocaleString());
      toast({ title: "Scan sukses", description: `${data.rows.length} saham tersaring dari TradingView.` });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      toast({ title: "Scan gagal", description: message });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleCopyWatchlist = async () => {
    const value = watchlist.join(",");
    try {
      await navigator.clipboard.writeText(value);
      toast({ title: "Watchlist copied", description: value || "Watchlist kosong" });
    } catch {
      toast({ title: "Gagal copy", description: "Clipboard tidak tersedia." });
    }
  };

  const handlePin = (ticker: string) => {
    setWatchlist((prev) => (prev.includes(ticker) ? prev : [ticker, ...prev]));
    toast({ title: "Pinned", description: `${ticker} masuk watchlist.` });
  };

  const handleRemove = (ticker: string) => {
    setWatchlist((prev) => prev.filter((item) => item !== ticker));
    toast({ title: "Removed", description: `${ticker} dihapus dari watchlist.` });
  };

  const modeLabel = mode === "BTST" && params.weekendMode ? "BTST Weekend" : mode;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <Topbar modeLabel={modeLabel} lastScanAt={lastScanAt} isLoading={isLoading} onScan={handleScan} />
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <section id="scanner" className="flex flex-wrap items-center justify-between gap-4">
                <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
                  <TabsList>
                    <TabsTrigger value="BTST">BTST</TabsTrigger>
                    <TabsTrigger value="BPJS">BPJS</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleScan} disabled={isLoading}>
                    <BarChart3 className="h-4 w-4" />
                    Scan
                  </Button>
                </div>
              </section>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-full max-w-xs">
                  <Input
                    placeholder="Cari ticker..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    300ms
                  </span>
                </div>
                <Select value={sortKey} onValueChange={(value) => setSortKey(value as SortKey)}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Desc</SelectItem>
                    <SelectItem value="asc">Asc</SelectItem>
                  </SelectContent>
                </Select>
                <Badge variant="secondary" className="flex items-center gap-2">
                  <ArrowDownUp className="h-3 w-3" />
                  {filteredRows.length} results
                </Badge>
              </div>

              {error ? (
                <Card className="border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
                  Error: {error}
                </Card>
              ) : null}

              <section id="results" className="space-y-3">
                <ResultsTable
                  rows={pagedRows}
                  isLoading={isLoading}
                  onRowClick={(row) => setSelectedRow(row)}
                  weekendMode={mode === "BTST" && params.weekendMode}
                />

                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <AlarmClock className="h-4 w-4" />
                    Showing {pagedRows.length} of {filteredRows.length} rows
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Page size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    >
                      Prev
                    </Button>
                    <span>
                      Page {page} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </section>
            </div>

            <div id="watchlist" className="hidden lg:block">
              <WatchlistPanel
                tickers={watchlist}
                onCopy={handleCopyWatchlist}
                onRemove={handleRemove}
              />
            </div>
          </div>
        </main>
      </div>

      <div className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2 text-xs shadow-panel lg:hidden">
        <div className="flex items-center gap-2 text-muted-foreground">
          <BarChart3 className="h-4 w-4" />
          Scanner
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="xs">
              <ListFilter className="h-4 w-4" />
              Watchlist
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Watchlist</DialogTitle>
            </DialogHeader>
            <WatchlistPanel
              tickers={watchlist}
              onCopy={handleCopyWatchlist}
              onRemove={handleRemove}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DetailDialog
        row={selectedRow}
        mode={mode}
        weekendMode={mode === "BTST" && params.weekendMode}
        onClose={() => setSelectedRow(null)}
        onPin={handlePin}
      />
    </div>
  );
}
