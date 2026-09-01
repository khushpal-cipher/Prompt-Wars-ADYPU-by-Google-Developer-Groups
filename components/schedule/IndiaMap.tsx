"use client";

import React, { useState } from "react";
import { type StateSchedule } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { MapPin, Snowflake, CheckCircle2, AlertCircle } from "lucide-react";

export function IndiaMap({
  schedules,
  onSelectState,
}: {
  schedules: readonly StateSchedule[];
  onSelectState: (state: StateSchedule) => void;
}) {
  const [hoveredState, setHoveredState] = useState<StateSchedule | null>(null);

  // Group states by regions/zones for easy interactive inspection
  const zones = [
    {
      name: "Northern & Himalayan",
      codes: ["JK", "LA", "HP", "PB", "HR", "UK", "DL", "CH"],
      accent: "border-sky-500/30 bg-sky-500/5",
    },
    {
      name: "Western & Central",
      codes: ["RJ", "GJ", "MH", "MP", "CG", "GA", "DN"],
      accent: "border-amber-500/30 bg-amber-500/5",
    },
    {
      name: "Eastern & Plains",
      codes: ["UP", "BR", "JH", "WB", "OR"],
      accent: "border-emerald-500/30 bg-emerald-500/5",
    },
    {
      name: "Southern & Peninsula",
      codes: ["AP", "TG", "KA", "TN", "KL", "PY", "LD", "AN"],
      accent: "border-indigo-500/30 bg-indigo-500/5",
    },
    {
      name: "North-Eastern States",
      codes: ["AS", "AR", "MN", "ML", "MZ", "NL", "SK", "TR"],
      accent: "border-purple-500/30 bg-purple-500/5",
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border pb-4">
        <div>
          <h3 className="font-bold text-base text-foreground">
            Interactive Regional Survey Map & Zone Explorer
          </h3>
          <p className="text-xs text-muted-foreground">
            Click any State or Union Territory card below to inspect operational dates and notification status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>Official</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-500"></span>
            <span>Indicative</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-saffron">
            <Snowflake className="h-3 w-3" />
            <span>Snow-Bound</span>
          </div>
        </div>
      </div>

      {/* Zone Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {zones.map((zone) => {
          const zoneStates = schedules.filter((s) => zone.codes.includes(s.code));
          return (
            <div
              key={zone.name}
              className={`rounded-xl border p-4 shadow-2xs space-y-3 ${zone.accent}`}
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center justify-between">
                <span>{zone.name}</span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  {zoneStates.length} Regions
                </span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {zoneStates.map((st) => (
                  <button
                    key={st.code}
                    onClick={() => onSelectState(st)}
                    onMouseEnter={() => setHoveredState(st)}
                    onMouseLeave={() => setHoveredState(null)}
                    className="flex flex-col items-start rounded-lg border border-border/80 bg-card p-2 text-left transition hover:border-primary hover:shadow-xs group"
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="font-mono text-xs font-bold text-foreground group-hover:text-primary">
                        {st.code}
                      </span>
                      {st.isSnowBound ? (
                        <Snowflake className="h-3 w-3 text-saffron" />
                      ) : st.isOfficial ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground truncate w-full mt-0.5 group-hover:text-foreground">
                      {st.nameKey.replace("states.", "")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
