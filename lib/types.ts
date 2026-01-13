export type Mode = "BTST" | "BPJS";

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
