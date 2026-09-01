"use client";

import React, { useMemo } from "react";
import { type CensusYearRecord } from "@/lib/types";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { ChartNarrator } from "./ChartNarrator";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface PopulationTrendChartProps {
  data: readonly CensusYearRecord[];
}

function PopulationTrendChartComponent({ data }: PopulationTrendChartProps) {
  const { t } = useI18n();

  const chartData = useMemo(() => {
    return data.map((d) => ({
      year: d.year,
      officialPopulation: !d.isProjection ? Number((d.population / 1000000).toFixed(1)) : null,
      projectedPopulation: d.year >= 2011 ? Number((d.population / 1000000).toFixed(1)) : null,
      growthRate: d.decadalGrowthPct,
      density: d.densityPerSqKm,
    }));
  }, [data]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <h3 className="font-bold text-base text-foreground">
            {t("insights.pop.title")}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t("insights.pop.subtitle")}
          </p>
        </div>
      </div>

      {/* Recharts Line Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#88888820" />
            <XAxis dataKey="year" stroke="#888888" fontSize={11} />
            <YAxis
              unit="M"
              domain={[300, 1600]}
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
              formatter={(value: unknown, name: string) => [
                `${String(value)} Million`,
                name === "officialPopulation"
                  ? t("insights.pop.officialCount")
                  : name === "projectedPopulation"
                  ? t("insights.pop.projectedNotOfficial")
                  : name,
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
              formatter={(value) =>
                value === "officialPopulation"
                  ? t("insights.pop.officialCount")
                  : t("insights.pop.projectedNotOfficial")
              }
            />
            <Line
              type="monotone"
              dataKey="officialPopulation"
              stroke="#1B2A6B"
              strokeWidth={3}
              dot={{ r: 4, fill: "#1B2A6B" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="projectedPopulation"
              stroke="#FF8A3D"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ r: 5, fill: "#FF8A3D" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Accessible Adjacent Data Table */}
      <div className="overflow-x-auto rounded-xl border border-border/70 bg-muted/20">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-muted/60 text-muted-foreground font-semibold">
            <tr>
              <th className="py-2 px-3">{t("insights.table.year")}</th>
              <th className="py-2 px-3">{t("insights.table.population")}</th>
              <th className="py-2 px-3">{t("insights.table.decadalGrowth")}</th>
              <th className="py-2 px-3">{t("insights.table.density")}</th>
              <th className="py-2 px-3">{t("insights.table.status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 font-mono">
            {data.map((row) => (
              <tr key={row.year} className="hover:bg-muted/40">
                <td className="py-1.5 px-3 font-bold text-foreground">{row.year}</td>
                <td className="py-1.5 px-3">{(row.population / 1000000).toFixed(1)} M</td>
                <td className="py-1.5 px-3 text-muted-foreground">
                  {row.decadalGrowthPct ? `+${row.decadalGrowthPct}%` : "—"}
                </td>
                <td className="py-1.5 px-3 text-muted-foreground">{row.densityPerSqKm}</td>
                <td className="py-1.5 px-3 font-sans">
                  {row.isProjection ? (
                    <span className="text-saffron font-semibold">{t("insights.table.projected")}</span>
                  ) : (
                    <span className="text-indiagreen-dark dark:text-indiagreen-light font-semibold">
                      {t("insights.table.officialCensus")}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Storyteller Narration */}
      <ChartNarrator
        chartId="population-trend"
        series={chartData}
      />
    </div>
  );
}

export const PopulationTrendChart = React.memo(PopulationTrendChartComponent);
