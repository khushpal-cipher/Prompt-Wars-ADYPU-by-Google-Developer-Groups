"use client";

import React, { useMemo } from "react";
import { type CensusYearRecord } from "@/lib/types";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { ChartNarrator } from "./ChartNarrator";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface LiteracySexRatioChartProps {
  data: readonly CensusYearRecord[];
}

function LiteracySexRatioChartComponent({ data }: LiteracySexRatioChartProps) {
  const { t } = useI18n();

  const chartData = useMemo(() => {
    return data.map((d) => ({
      year: d.year,
      literacyRate: d.literacyRatePct,
      sexRatio: d.sexRatio,
      isProjection: d.isProjection ? "true" : "false",
    }));
  }, [data]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <h3 className="font-bold text-base text-foreground">
            {t("insights.lit.title")}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t("insights.lit.subtitle")}
          </p>
        </div>
      </div>

      {/* Dual Axis Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#88888820" />
            <XAxis dataKey="year" stroke="#888888" fontSize={11} />
            <YAxis
              yAxisId="left"
              unit="%"
              domain={[0, 100]}
              stroke="#0E7C57"
              fontSize={11}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[900, 1000]}
              stroke="#1B2A6B"
              fontSize={11}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "0.75rem",
                fontSize: "12px",
              }}
              formatter={(val: unknown, name: string) => [
                name === "literacyRate" ? `${String(val)}%` : `${String(val)} F / 1000 M`,
                name === "literacyRate" ? t("insights.lit.litRate") : t("insights.lit.sexRatio"),
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
              formatter={(value) =>
                value === "literacyRate"
                  ? t("insights.lit.litRate")
                  : t("insights.lit.sexRatio")
              }
            />
            <Bar
              yAxisId="left"
              dataKey="literacyRate"
              fill="#0E7C57"
              radius={[6, 6, 0, 0]}
              maxBarSize={36}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="sexRatio"
              stroke="#1B2A6B"
              strokeWidth={3}
              dot={{ r: 4, fill: "#1B2A6B" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Accessible Table */}
      <div className="overflow-x-auto rounded-xl border border-border/70 bg-muted/20">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-muted/60 text-muted-foreground font-semibold">
            <tr>
              <th className="py-2 px-3">{t("insights.table.year")}</th>
              <th className="py-2 px-3">{t("insights.lit.litRate")}</th>
              <th className="py-2 px-3">{t("insights.lit.sexRatio")}</th>
              <th className="py-2 px-3">{t("insights.lit.tableType")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 font-mono">
            {data.map((row) => (
              <tr key={row.year} className="hover:bg-muted/40">
                <td className="py-1.5 px-3 font-bold text-foreground">{row.year}</td>
                <td className="py-1.5 px-3 text-indiagreen-dark dark:text-indiagreen-light font-semibold">
                  {row.literacyRatePct}%
                </td>
                <td className="py-1.5 px-3 font-semibold text-primary">{row.sexRatio}</td>
                <td className="py-1.5 px-3 font-sans">
                  {row.isProjection ? (
                    <span className="text-saffron font-semibold">{t("insights.table.projected")}</span>
                  ) : (
                    <span className="text-muted-foreground">{t("insights.table.officialCensus")}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ChartNarrator
        chartId="literacy-sexratio"
        series={chartData}
      />
    </div>
  );
}

export const LiteracySexRatioChart = React.memo(LiteracySexRatioChartComponent);
