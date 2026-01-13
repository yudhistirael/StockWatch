export type Mode = "BTST" | "BPJS";

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

export interface ScanRow {
  name: string;
  close: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  change: number;
  avgVol10: number;
  vwap: number;
  valueIDR: number;
  valueB: number;
  wickPct: number;
  vwapDistPct: number;
  rangePct: number;
}
