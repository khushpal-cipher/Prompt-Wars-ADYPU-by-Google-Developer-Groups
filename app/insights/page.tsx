import React, { Suspense } from "react";
import { NATIONAL_TIMESERIES, STATE_METRICS } from "@/lib/data/census-timeseries";
import { PopulationTrendChart } from "@/components/insights/PopulationTrendChart";
import { LiteracySexRatioChart } from "@/components/insights/LiteracySexRatioChart";
import { UrbanRuralSplit } from "@/components/insights/UrbanRuralSplit";
import { StateComparator } from "@/components/insights/StateComparator";
import { BarChart3, TrendingUp, Sparkles, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Demographic Insights & AI Visualizer · Census 2027",
  description:
    "Explore 70+ years of Indian demographic evolution (1951–2011) and 2027 statistical projections across population growth, literacy, gender ratio, and urbanization.",
};

export default function InsightsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 space-y-12">
      {/* Header */}
      <div className="border-b border-border/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
          <BarChart3 className="h-4 w-4 text-saffron" />
          <span>70+ Years Demographic Evolution & Projections</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
            Demographic Insights & AI Data Explorer
          </h1>
          <Badge variant="saffron" className="w-fit">
            <Sparkles className="h-3 w-3 mr-1" /> AI Storyteller Powered
          </Badge>
        </div>
        <p className="mt-2 max-w-3xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Interactive visualizations tracking India&apos;s decadal demographic transformation from 1951 to 2011, combined with projected statistical baselines for Census 2027.
        </p>
      </div>

      {/* Projection Disclaimer Alert */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-start gap-3 text-xs text-muted-foreground shadow-xs">
        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-foreground block">
            Note on Projections vs Official Data
          </span>
          <span>
            Figures for 1951–2011 are based on official Census of India reports. Year 2027 data points are statistical projections for analytical benchmarking. Official 2027 numbers will be published following Population Enumeration.
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
