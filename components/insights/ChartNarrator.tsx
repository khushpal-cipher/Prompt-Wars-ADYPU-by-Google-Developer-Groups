"use client";

import React, { useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { type NarrateChartResponse } from "@/lib/schemas";
import { Sparkles, Loader2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChartNarratorProps {
  chartId: "population-trend" | "literacy-sexratio" | "urban-rural" | "state-compare";
  series: Array<Record<string, string | number | null>>;
}

export function ChartNarrator({ chartId, series }: ChartNarratorProps) {
  const { locale, t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [narration, setNarration] = useState<NarrateChartResponse | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/narrate-chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chartId,
          series,
          locale,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setNarration(data);
      }
    } catch (err) {
      console.warn("Chart narration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-border/60">
      {!narration ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGenerate}
          disabled={loading}
          className="gap-2 text-xs font-semibold hover:border-primary"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-saffron" />
              <span>{t("insights.narrator.analyzing")}</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5 text-saffron" />
              <span>{t("insights.narrator.btnGenerate")}</span>
            </>
          )}
        </Button>
      ) : (
        <div className="rounded-xl bg-primary/5 p-4 border border-primary/10 text-xs space-y-2 animate-fade-in-up">
          <div className="flex items-center gap-1.5 font-bold text-primary text-xs">
            <Bot className="h-4 w-4 text-saffron" />
            <span>{t("insights.narrator.aiHeadline", { headline: narration.headline })}</span>
          </div>
          <ul className="space-y-1 text-[11px] text-muted-foreground list-disc pl-4 leading-relaxed">
            {narration.insights.map((insight, idx) => (
              <li key={idx} className="text-foreground/90">
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
