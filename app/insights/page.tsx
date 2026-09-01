"use client";

import React, { Suspense } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { NATIONAL_TIMESERIES, STATE_METRICS } from "@/lib/data/census-timeseries";
import { PopulationTrendChart } from "@/components/insights/PopulationTrendChart";
import { LiteracySexRatioChart } from "@/components/insights/LiteracySexRatioChart";
import { UrbanRuralSplit } from "@/components/insights/UrbanRuralSplit";
import { StateComparator } from "@/components/insights/StateComparator";
import { BarChart3, Sparkles, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function InsightsPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 space-y-12">
      {/* Header */}
      <div className="border-b border-border/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
          <BarChart3 className="h-4 w-4 text-saffron" />
          <span>{t("insights.page.badge")}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
            {t("insights.page.title")}
          </h1>
          <Badge variant="saffron" className="w-fit">
            <Sparkles className="h-3 w-3 mr-1" /> {t("insights.page.aiBadge")}
          </Badge>
        </div>
        <p className="mt-2 max-w-3xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {t("insights.page.description")}
        </p>
      </div>

      {/* Projection Disclaimer Alert */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-start gap-3 text-xs text-muted-foreground shadow-xs">
        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-foreground block">
            {t("insights.disclaimer.title")}
          </span>
          <span>
            {t("insights.disclaimer.body")}
          </span>
        </div>
      </div>

      {/* Chart 1: Population Trend */}
      <section className="space-y-4">
        <PopulationTrendChart data={NATIONAL_TIMESERIES} />
      </section>

      {/* Chart 2: Literacy vs Sex Ratio */}
      <section className="space-y-4">
        <LiteracySexRatioChart data={NATIONAL_TIMESERIES} />
      </section>

      {/* Chart 3: Urban vs Rural Split */}
      <section className="space-y-4">
        <UrbanRuralSplit data={NATIONAL_TIMESERIES} />
      </section>

      {/* Chart 4: Two-State Interactive Comparator with Suspense */}
      <section className="space-y-4 pt-6 border-t border-border">
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
          <StateComparator metrics={STATE_METRICS} />
        </Suspense>
      </section>
    </div>
  );
}
