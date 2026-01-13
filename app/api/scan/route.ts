import { NextResponse } from "next/server";

const SCAN_URL = "https://scanner.tradingview.com/indonesia/scan";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = {
      filter: [
        { left: "type", operation: "equal", right: "stock" },
        { left: "exchange", operation: "equal", right: "IDX" },
        { left: "close", operation: "greater", right: 50 },
        { left: "volume", operation: "greater", right: 0 }
      ],
      columns: [
        "name",
        "close",
        "open",
        "high",
        "low",
        "volume",
        "change",
        "average_volume_10d_calc",
        "VWAP"
      ],
      sort: { sortBy: "volume", sortOrder: "desc" },
      range: [0, 2000]
    };

    const res = await fetch(SCAN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "IDX-Screener/1.0"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const details = await res.text();
      return NextResponse.json(
        { ok: false, error: `Scanner request failed (${res.status})`, details },
        { status: res.status }
      );
    }

    const json = await res.json();

    if (!json || !Array.isArray(json.data)) {
      return NextResponse.json(
        { ok: false, error: "Unexpected response format" },
        { status: 502 }
      );
    }

    const rows = json.data.map((item: { d?: number[] }) => {

      const d = item?.d;
      if (!Array.isArray(d) || d.length < 9) {
        return null;
      }

      const name = String(d[0] ?? "");
      const close = Number(d[1] ?? 0);
      const open = Number(d[2] ?? 0);
      const high = Number(d[3] ?? 0);
      const low = Number(d[4] ?? 0);
      const volume = Number(d[5] ?? 0);
      const change = Number(d[6] ?? 0);
      const avgVol10 = Number(d[7] ?? 0);
      const vwap = Number(d[8] ?? 0);

      const valueIDR = close * volume;
      const valueB = valueIDR / 1e9;
      const wickPct = close > 0 ? ((high - close) / close) * 100 : 0;
      const vwapDistPct = vwap > 0 ? ((close - vwap) / vwap) * 100 : 0;
      const rangePct = low > 0 ? ((high - low) / low) * 100 : 0;

      return {
        name,
        close,
        open,
        high,
        low,
        volume,
        change,
        avgVol10,
        vwap,
        valueIDR,
        valueB,
        wickPct,
        vwapDistPct,
        rangePct
      };
    });

    if (rows.some((row: null | object) => row === null)) {
      return NextResponse.json(
        { ok: false, error: "Unexpected response format" },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
