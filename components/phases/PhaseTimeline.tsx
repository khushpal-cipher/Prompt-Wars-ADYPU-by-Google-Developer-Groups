"use client";

import React from "react";
import { type PhaseDefinition } from "@/lib/types";
import { Calendar, CheckCircle2, Sparkles, Building2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PhaseTimeline({
  phases,
}: {
  phases: readonly PhaseDefinition[];
}) {
  return (
    <div className="relative border-l-2 border-primary/20 pl-6 ml-3 sm:ml-6 space-y-10">
      {phases.map((p, idx) => {
        const isPhase1 = p.phase === "HLO";
        const Icon = isPhase1 ? Building2 : Users;
        const colorClass = isPhase1
          ? "bg-primary text-white"
          : "bg-saffron text-white";

        return (
          <div key={p.phase} className="relative group">
            {/* Timeline marker node */}
            <div
              className={`absolute -left-[35px] top-0 flex h-9 w-9 items-center justify-center rounded-full ${colorClass} shadow-md transition-transform group-hover:scale-110`}
            >
              <Icon className="h-4 w-4" />
            </div>

            {/* Card Content */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3 mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-saffron-dark">
                    Operational Phase 0{idx + 1}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
                    {isPhase1
                      ? "House Listing Operations (HLO) & Housing Census"
                      : "Population Enumeration (PE)"}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="official">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Notified in Gazette
                  </Badge>
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {isPhase1
                  ? "Surveys all residential, commercial, and mixed-use structures across India. Collects building condition, building materials (floor/wall/roof), dwelling rooms, drinking water, electricity, toilet types, cooking fuel (LPG), and household assets (smartphones, broadband, vehicles)."
                  : "Counts every person residing in India. Captures individual demographic particulars: full name, relationship to head, sex, date of birth/age, marital status, caste enumeration (first since 1931), mother tongue, languages known, literacy, educational level, occupation, migration, and disability."}
              </p>

              {/* Windows & Timing Badges */}
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-muted/60 p-3 border border-border/50">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <Calendar className="h-3.5 w-3.5 text-saffron" />
                    <span>Operational Survey Window</span>
                  </div>
                  <p className="text-xs font-medium text-foreground mt-1">
                    {isPhase1
                      ? "1 April 2026 – 30 September 2026"
                      : "9 February 2027 – 28 February 2027"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {isPhase1
                      ? "Each State/UT notifies a 45-day window within this master range."
                      : "Revisional round: 1 – 5 March 2027"}
                  </p>
                </div>

                <div className="rounded-xl bg-muted/60 p-3 border border-border/50">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <Sparkles className="h-3.5 w-3.5 text-saffron" />
                    <span>Official Reference Moment</span>
                  </div>
                  <p className="text-xs font-medium text-foreground mt-1">
                    {isPhase1
                      ? "00:00 hrs, 1 October 2026 (Snow-bound)"
                      : "00:00 hrs, 1 March 2027 (Most of India)"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {isPhase1
                      ? "Standardized building numbering baseline established."
                      : "Snow-bound reference moment: 00:00 hrs, 1 Oct 2026."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
