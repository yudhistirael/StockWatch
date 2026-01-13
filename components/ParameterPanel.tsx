"use client";

import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Mode } from "@/lib/types";

export interface ScannerParams {
  minValueB: number;
  minPrice: number;
  minChange: number;
  maxChange: number;
  volMultiplier: number;
  minVwapDist: number;
  maxWick: number;
  rangeEnabled: boolean;
  maxRangePct: number;
  weekendMode: boolean;
}

interface ParameterPanelProps {
  mode: Mode;
  params: ScannerParams;
  onChange: (patch: Partial<ScannerParams>) => void;
}

export function ParameterPanel({ mode, params, onChange }: ParameterPanelProps) {
  const [open, setOpen] = useState(true);
  const showWeekend = mode === "BTST";

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">Parameter</CardTitle>
          <Badge variant="secondary">{mode}</Badge>
        </div>
        <Button variant="ghost" size="xs" onClick={() => setOpen((prev) => !prev)}>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CardHeader>
      {open ? (
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <label className="space-y-1 text-xs text-muted-foreground">
              Min Value (B)
              <Input
                type="number"
                step="0.1"
                value={params.minValueB}
                onChange={(e) => onChange({ minValueB: Number(e.target.value) })}
                placeholder="Min Value (B)"
              />
            </label>
            <label className="space-y-1 text-xs text-muted-foreground">
              Min Price
              <Input
                type="number"
                step="1"
                value={params.minPrice}
                onChange={(e) => onChange({ minPrice: Number(e.target.value) })}
                placeholder="Min Price"
              />
            </label>
            <label className="space-y-1 text-xs text-muted-foreground">
              Min Change %
              <Input
                type="number"
                step="0.1"
                value={params.minChange}
                onChange={(e) => onChange({ minChange: Number(e.target.value) })}
                placeholder="Min Change %"
              />
            </label>
            <label className="space-y-1 text-xs text-muted-foreground">
              Max Change %
              <Input
                type="number"
                step="0.1"
                value={params.maxChange}
                onChange={(e) => onChange({ maxChange: Number(e.target.value) })}
                placeholder="Max Change %"
              />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <label className="space-y-1 text-xs text-muted-foreground">
              Vol Multiplier
              <Input
                type="number"
                step="0.1"
                value={params.volMultiplier}
                onChange={(e) => onChange({ volMultiplier: Number(e.target.value) })}
                placeholder="Vol Multiplier"
              />
            </label>
            <label className="space-y-1 text-xs text-muted-foreground">
              Min VWAP Dist %
              <Input
                type="number"
                step="0.1"
                value={params.minVwapDist}
                onChange={(e) => onChange({ minVwapDist: Number(e.target.value) })}
                placeholder="Min VWAP Dist %"
              />
            </label>
            <label className="space-y-1 text-xs text-muted-foreground">
              Max Wick %
              <Input
                type="number"
                step="0.1"
                value={params.maxWick}
                onChange={(e) => onChange({ maxWick: Number(e.target.value) })}
                placeholder="Max Wick %"
              />
            </label>
            <div className="flex items-center gap-3 rounded-md border border-border/60 bg-background px-3 py-2 text-sm">
              <Switch
                checked={params.rangeEnabled}
                onCheckedChange={(checked) => onChange({ rangeEnabled: checked })}
              />
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Range filter</span>
                <Input
                  type="number"
                  step="0.1"
                  value={params.maxRangePct}
                  onChange={(e) => onChange({ maxRangePct: Number(e.target.value) })}
                  className="h-8 w-24"
                  disabled={!params.rangeEnabled}
                />
              </div>
            </div>
          </div>
          {showWeekend ? (
            <div className="flex flex-wrap items-center gap-3 rounded-md border border-border/60 bg-accent/30 px-3 py-2 text-sm">
              <Switch
                checked={params.weekendMode}
                onCheckedChange={(checked) => onChange({ weekendMode: checked })}
              />
              <div className="flex items-center gap-2">
                <span className="font-medium">Weekend BTST Mode</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Jumat tahan sampai Senin, rule lebih ketat.</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-xs text-muted-foreground">
                Max change, VWAP dist, wick, dan value disesuaikan otomatis.
              </span>
            </div>
          ) : null}
        </CardContent>
      ) : null}
    </Card>
  );
}
