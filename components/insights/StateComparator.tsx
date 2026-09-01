"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { type StateMetricRecord } from "@/lib/types";
import { STATE_SCHEDULES } from "@/lib/data/states";
import { ChartNarrator } from "./ChartNarrator";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { GitCompare, Share2, Copy, Check } from "lucide-react";

interface StateComparatorProps {
  metrics: readonly StateMetricRecord[];
}

function StateComparatorComponent({ metrics }: StateComparatorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [stateA, setStateA] = useState<string>("MH");
  const [stateB, setStateB] = useState<string>("KL");
  const [copied, setCopied] = useState(false);

  // Sync with URL params ?a=XX&b=YY
  useEffect(() => {
    const aParam = searchParams.get("a");
    const bParam = searchParams.get("b");
    if (aParam && metrics.some((m) => m.stateCode === aParam.toUpperCase())) {
      setStateA(aParam.toUpperCase());
    }
    if (bParam && metrics.some((m) => m.stateCode === bParam.toUpperCase())) {
      setStateB(bParam.toUpperCase());
    }
  }, [searchParams, metrics]);

  const updateUrl = useCallback(
    (newA: string, newB: string) => {
      const params = new URLSearchParams(window.location.search);
      params.set("a", newA);
      params.set("b", newB);
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  const handleStateAChange = (code: string) => {
    setStateA(code);
    updateUrl(code, stateB);
  };

  const handleStateBChange = (code: string) => {
    setStateB(code);
    updateUrl(stateA, code);
  };

  const recordA = useMemo(
    () => metrics.find((m) => m.stateCode === stateA) || metrics[0],
    [metrics, stateA]
  );
  const recordB = useMemo(
    () => metrics.find((m) => m.stateCode === stateB) || metrics[1],
    [metrics, stateB]
  );

  const nameA =
    STATE_SCHEDULES.find((s) => s.code === stateA)?.nameKey.replace("states.", "") ||
    stateA;
  const nameB =
    STATE_SCHEDULES.find((s) => s.code === stateB)?.nameKey.replace("states.", "") ||
    stateB;

  const comparisonData = useMemo(() => {
    if (!recordA || !recordB) return [];
    return [
      {
        metric: "Literacy Rate (%)",
        [nameA]: recordA.literacyRatePct,
        [nameB]: recordB.literacyRatePct,
      },
      {
        metric: "Sex Ratio (F/1000M)",
        [nameA]: recordA.sexRatio,
        [nameB]: recordB.sexRatio,
      },
      {
        metric: "Urban Share (%)",
        [nameA]: recordA.urbanSharePct,
        [nameB]: recordB.urbanSharePct,
      },
      {
        metric: "Density (per sq km)",
        [nameA]: recordA.densityPerSqKm,
        [nameB]: recordB.densityPerSqKm,
      },
    ];
  }, [recordA, recordB, nameA, nameB]);

  const handleShare = () => {
    const url = `${window.location.origin}/insights?a=${stateA}&b=${stateB}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
      {/* Header & State Selectors */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-base sm:text-lg text-foreground">
              Inter-State Demographic Comparator
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Compare demographic metrics between any two Indian States or UTs. Shareable deep link enabled.
          </p>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-indiagreen" />
              <span>Link Copied</span>
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5" />
              <span>Share Comparison</span>
            </>
          )}
        </button>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-1.5">
          <label className="text-xs font-bold uppercase text-primary">
            Select State A
          </label>
          <Select
            value={stateA}
            onChange={(e) => handleStateAChange(e.target.value)}
          >
            {metrics.map((m) => {
              const label =
                STATE_SCHEDULES.find((s) => s.code === m.stateCode)?.nameKey.replace("states.", "") ||
                m.stateCode;
              return (
                <option key={m.stateCode} value={m.stateCode}>
                  {label} ({m.stateCode})
                </option>
              );
            })}
          </Select>
        </div>

        <div className="rounded-xl border border-saffron/20 bg-saffron/5 p-3 space-y-1.5">
          <label className="text-xs font-bold uppercase text-saffron-dark">
            Select State B
          </label>
          <Select
            value={stateB}
            onChange={(e) => handleStateBChange(e.target.value)}
          >
            {metrics.map((m) => {
              const label =
                STATE_SCHEDULES.find((s) => s.code === m.stateCode)?.nameKey.replace("states.", "") ||
                m.stateCode;
              return (
                <option key={m.stateCode} value={m.stateCode}>
                  {label} ({m.stateCode})
                </option>
              );
            })}
          </Select>
        </div>
      </div>

      {/* Comparison Bar Chart */}
      <div className="h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#88888820" />
            <XAxis dataKey="metric" stroke="#888888" fontSize={11} interval={0} />
            <YAxis stroke="#888888" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "0.75rem",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
            <Bar dataKey={nameA} fill="#1B2A6B" radius={[6, 6, 0, 0]} maxBarSize={45} />
            <Bar dataKey={nameB} fill="#FF8A3D" radius={[6, 6, 0, 0]} maxBarSize={45} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Side by Side Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card State A */}
        <div className="rounded-xl border border-primary/20 bg-card p-4 space-y-2">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="font-bold text-sm text-primary">{nameA}</span>
            <Badge variant="default" className="text-[10px]">
              Pop: {(recordA.population2011 / 1000000).toFixed(1)}M
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>Literacy: <span className="font-bold">{recordA.literacyRatePct}%</span></div>
            <div>Sex Ratio: <span className="font-bold">{recordA.sexRatio}</span></div>
            <div>Urban: <span className="font-bold">{recordA.urbanSharePct}%</span></div>
            <div>Density: <span className="font-bold">{recordA.densityPerSqKm} /km²</span></div>
          </div>
        </div>

        {/* Card State B */}
        <div className="rounded-xl border border-saffron/20 bg-card p-4 space-y-2">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="font-bold text-sm text-saffron-dark">{nameB}</span>
            <Badge variant="saffron" className="text-[10px]">
              Pop: {(recordB.population2011 / 1000000).toFixed(1)}M
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>Literacy: <span className="font-bold">{recordB.literacyRatePct}%</span></div>
            <div>Sex Ratio: <span className="font-bold">{recordB.sexRatio}</span></div>
            <div>Urban: <span className="font-bold">{recordB.urbanSharePct}%</span></div>
            <div>Density: <span className="font-bold">{recordB.densityPerSqKm} /km²</span></div>
          </div>
        </div>
      </div>

      <ChartNarrator
        chartId="state-compare"
        series={comparisonData}
      />
    </div>
  );
}

export const StateComparator = React.memo(StateComparatorComponent);
