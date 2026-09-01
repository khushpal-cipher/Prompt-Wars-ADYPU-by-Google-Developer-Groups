"use client";

import React, { useMemo } from "react";
import { type CensusYearRecord } from "@/lib/types";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { ChartNarrator } from "./ChartNarrator";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface UrbanRuralSplitProps {
  data: readonly CensusYearRecord[];
}

function UrbanRuralSplitComponent({ data }: UrbanRuralSplitProps) {
  const { t } = useI18n();

  const chartData = useMemo(() => {
    return data.map((d) => {
      const urban = d.urbanSharePct || 0;
      const rural = Number((100 - urban).toFixed(2));
      return {
        year: d.year,
        urbanShare: urban,
        ruralShare: rural,
        isProjection: d.isProjection ? "true" : "false",
      };
    });
  }, [data]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <h3 className="font-bold text-base text-foreground">
            {t("insights.urban.title")}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t("insights.urban.subtitle")}
          </p>
        </div>
      </div>

      {/* Stacked Area Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#88888820" />
            <XAxis dataKey="year" stroke="#888888" fontSize={11} />
            <YAxis
              unit="%"
              domain={[0, 100]}
              stroke="#888888"
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
                `${String(val)}%`,
                name === "urbanShare" ? t("insights.urban.urbanShare") : t("insights.urban.ruralShare"),
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
              formatter={(value) =>
                value === "urbanShare" ? t("insights.urban.urbanShare") : t("insights.urban.ruralShare")
              }
            />
            <Area
              type="monotone"
              dataKey="urbanShare"
              stackId="1"
              stroke="#FF8A3D"
              fill="#FF8A3D"
              fillOpacity={0.8}
            />
            <Area
              type="monotone"
              dataKey="ruralShare"
              stackId="1"
              stroke="#1B2A6B"
              fill="#1B2A6B"
              fillOpacity={0.7}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Accessible Table */}
      <div className="overflow-x-auto rounded-xl border border-border/70 bg-muted/20">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-muted/60 text-muted-foreground font-semibold">
            <tr>
              <th className="py-2 px-3">{t("insights.table.year")}</th>
              <th className="py-2 px-3">{t("insights.urban.urbanShare")}</th>
              <th className="py-2 px-3">{t("insights.urban.ruralShare")}</th>
              <th className="py-2 px-3">{t("insights.urban.tableTrend")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 font-mono">
            {chartData.map((row) => (
              <tr key={row.year} className="hover:bg-muted/40">
                <td className="py-1.5 px-3 font-bold text-foreground">{row.year}</td>
                <td className="py-1.5 px-3 text-saffron font-bold">{row.urbanShare}%</td>
                <td className="py-1.5 px-3 text-primary font-bold">{row.ruralShare}%</td>
                <td className="py-1.5 px-3 font-sans">
                  {row.isProjection === "true" ? (
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
        chartId="urban-rural"
        series={chartData}
      />
    </div>
  );
}

export const UrbanRuralSplit = React.memo(UrbanRuralSplitComponent);
