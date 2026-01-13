"use client";

import { useEffect, useMemo, useState } from "react";

import { ParameterPanel } from "@/components/ParameterPanel";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { defaultParams, loadParams, saveParams } from "@/lib/params";
import type { Mode, ScannerParams } from "@/lib/types";

export default function ParametersPage() {
  const [mode, setMode] = useState<Mode>("BTST");
  const [params, setParams] = useState<ScannerParams>(defaultParams.BTST);

  useEffect(() => {
    setParams(loadParams(mode));
  }, [mode]);

  useEffect(() => {
    saveParams(mode, params);
  }, [mode, params]);

  const weekendActive = mode === "BTST" && params.weekendMode;
  const modeLabel = weekendActive ? "BTST Weekend" : mode;

  const summary = useMemo(() => {
    return [
      { label: "Min Value (B)", value: params.minValueB },
      { label: "Min Price", value: params.minPrice },
      { label: "Min Change %", value: params.minChange },
      { label: "Max Change %", value: params.maxChange },
      { label: "Vol Multiplier", value: params.volMultiplier },
      { label: "Min VWAP Dist %", value: params.minVwapDist },
      { label: "Max Wick %", value: params.maxWick },
      { label: "Range Filter", value: params.rangeEnabled ? `On (${params.maxRangePct}%)` : "Off" }
    ];
  }, [params]);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <Topbar modeLabel={modeLabel} isLoading={false} onScan={() => null} showScan={false} showStatus={false} />
          <div className="space-y-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
                <TabsList>
                  <TabsTrigger value="BTST">BTST</TabsTrigger>
                  <TabsTrigger value="BPJS">BPJS</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Disimpan otomatis</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setParams(defaultParams[mode])}
                >
                  Reset ke default
                </Button>
              </div>
            </div>

            <ParameterPanel
              mode={mode}
              params={params}
              onChange={(patch) => setParams((prev) => ({ ...prev, ...patch }))}
            />

            {weekendActive ? (
              <Card className="border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                Weekend BTST punya risk gap & news risk; gunakan SL ketat.
              </Card>
            ) : null}

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Panduan Parameter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <div className="font-semibold text-foreground">Yang disaring</div>
                  <p>
                    Filter di sini fokus ke likuiditas, kualitas penutupan, dan posisi harga terhadap VWAP.
                    Tujuannya untuk membentuk shortlist yang lebih rapi dan disiplin.
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-md border border-border/60 bg-card/70 p-3">
                    <div className="font-semibold text-foreground">Min Value (B)</div>
                    <p>Minimal nilai transaksi harian (dalam miliar IDR). Menghindari saham yang sepi.</p>
                  </div>
                  <div className="rounded-md border border-border/60 bg-card/70 p-3">
                    <div className="font-semibold text-foreground">Min Price</div>
                    <p>Batas harga minimum agar tidak masuk saham dengan risiko harga terlalu rendah.</p>
                  </div>
                  <div className="rounded-md border border-border/60 bg-card/70 p-3">
                    <div className="font-semibold text-foreground">Min/Max Change %</div>
                    <p>Range kenaikan harian. Terlalu kecil = kurang momentum, terlalu besar = rawan overheat.</p>
                  </div>
                  <div className="rounded-md border border-border/60 bg-card/70 p-3">
                    <div className="font-semibold text-foreground">Vol Multiplier</div>
                    <p>Perbandingan volume hari ini vs rata-rata 10 hari. Makin tinggi = makin kuat.</p>
                  </div>
                  <div className="rounded-md border border-border/60 bg-card/70 p-3">
                    <div className="font-semibold text-foreground">Min VWAP Dist %</div>
                    <p>Jarak harga ke VWAP. Semakin di atas VWAP biasanya momentum lebih sehat.</p>
                  </div>
                  <div className="rounded-md border border-border/60 bg-card/70 p-3">
                    <div className="font-semibold text-foreground">Max Wick %</div>
                    <p>Batasi upper shadow agar close lebih kuat. Wick besar sering tanda distribusi.</p>
                  </div>
                  <div className="rounded-md border border-border/60 bg-card/70 p-3 md:col-span-2">
                    <div className="font-semibold text-foreground">Range Filter</div>
                    <p>Opsional. Membatasi range harian supaya tidak masuk candle terlalu ekstrem.</p>
                  </div>
                </div>
                <div className="rounded-md border border-border/60 bg-background/60 p-3">
                  <div className="font-semibold text-foreground">Ringkasan aktif ({modeLabel})</div>
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                    {summary.map((item) => (
                      <div key={item.label} className="flex items-center justify-between text-xs">
                        <span>{item.label}</span>
                        <span className="font-mono text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Data berasal dari TradingView scanner (bukan tick-by-tick realtime). Gunakan untuk screening
                  dan final check tetap di platform trading.
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
