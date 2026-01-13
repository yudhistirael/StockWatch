import type { Mode, ScannerParams } from "@/lib/types";

export const defaultParams: Record<Mode, ScannerParams> = {
  BTST: {
    minValueB: 2,
    minPrice: 200,
    minChange: 2,
    maxChange: 10,
    volMultiplier: 1.5,
    minVwapDist: 0.5,
    maxWick: 1.0,
    rangeEnabled: false,
    maxRangePct: 12,
    weekendMode: false
  },
  BPJS: {
    minValueB: 1,
    minPrice: 200,
    minChange: 1,
    maxChange: 12,
    volMultiplier: 1.1,
    minVwapDist: 0,
    maxWick: 1.0,
    rangeEnabled: false,
    maxRangePct: 12,
    weekendMode: false
  }
};

export function loadParams(mode: Mode) {
  if (typeof window === "undefined") {
    return defaultParams[mode];
  }
  const stored = localStorage.getItem("scannerParams");
  if (!stored) {
    return defaultParams[mode];
  }
  try {
    const parsed = JSON.parse(stored) as Record<Mode, ScannerParams>;
    return parsed?.[mode] ?? defaultParams[mode];
  } catch {
    localStorage.removeItem("scannerParams");
    return defaultParams[mode];
  }
}

export function saveParams(mode: Mode, params: ScannerParams) {
  if (typeof window === "undefined") {
    return;
  }
  const stored = localStorage.getItem("scannerParams");
  let parsed: Record<Mode, ScannerParams> = { ...defaultParams };
  if (stored) {
    try {
      parsed = { ...parsed, ...(JSON.parse(stored) as Record<Mode, ScannerParams>) };
    } catch {
      parsed = { ...defaultParams };
    }
  }
  parsed[mode] = params;
  localStorage.setItem("scannerParams", JSON.stringify(parsed));
}
