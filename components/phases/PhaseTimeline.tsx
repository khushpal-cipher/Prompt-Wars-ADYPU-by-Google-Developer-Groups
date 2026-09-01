"use client";

import React from "react";
import { type PhaseDefinition } from "@/lib/types";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Calendar, CheckCircle2, Sparkles, Building2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PhaseTimeline({
  phases,
}: {
  phases: readonly PhaseDefinition[];
}) {
  const { t } = useI18n();

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
                    {t("phases.timeline.opPhase")} 0{idx + 1}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
                    {isPhase1
                      ? t("phases.timeline.hloTitle")
                      : t("phases.timeline.peTitle")}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="official">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> {t("phases.timeline.notifiedBadge")}
                  </Badge>
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {isPhase1
                  ? t("phases.timeline.hloSummary")
                  : t("phases.timeline.peSummary")}
              </p>

              {/* Windows & Timing Badges */}
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-muted/60 p-3 border border-border/50">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <Calendar className="h-3.5 w-3.5 text-saffron" />
                    <span>{t("phases.timeline.surveyWindow")}</span>
                  </div>
                  <p className="text-xs font-medium text-foreground mt-1">
                    {isPhase1
                      ? t("phases.timeline.hloWindow")
                      : t("phases.timeline.peWindow")}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {isPhase1
                      ? t("phases.timeline.hloWindowNote")
                      : t("phases.timeline.peWindowNote")}
                  </p>
                </div>

                <div className="rounded-xl bg-muted/60 p-3 border border-border/50">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <Sparkles className="h-3.5 w-3.5 text-saffron" />
                    <span>{t("phases.timeline.refMoment")}</span>
                  </div>
                  <p className="text-xs font-medium text-foreground mt-1">
                    {isPhase1
                      ? t("phases.timeline.hloRef")
                      : t("phases.timeline.peRef")}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {isPhase1
                      ? t("phases.timeline.hloRefNote")
                      : t("phases.timeline.peRefNote")}
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
