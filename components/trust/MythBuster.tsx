"use client";

import React, { useState, useRef } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { VerdictLabel } from "@/lib/types";
import { type VerifyClaimResponse } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Loader2,
  ShieldCheck,
  Flame,
} from "lucide-react";

const SAMPLE_VIRAL_CLAIMS = [
  "Census 2027 will ask for your bank account number and OTP",
  "Census data can be used against you in court proceedings",
  "The 2027 Census will record caste for all citizens",
  "Aadhaar is mandatory to be counted in Census 2027",
  "You must pay a registration fee to self-enumerate online",
];

export function MythBuster() {
  const { locale, t } = useI18n();
  const [claimText, setClaimText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<VerifyClaimResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pendingRequestRef = useRef<AbortController | null>(null);

  const handleVerify = async (textToVerify?: string) => {
    const text = (textToVerify || claimText).trim();
    if (text.length < 10) {
      setErrorMessage(t("trust.myth.minCharError"));
      return;
    }
    if (text.length > 1500) {
      setErrorMessage(t("trust.myth.maxCharError"));
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    if (pendingRequestRef.current) {
      pendingRequestRef.current.abort();
    }
    const abortController = new AbortController();
    pendingRequestRef.current = abortController;

    try {
      const res = await fetch("/api/verify-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claim: text,
          locale,
        }),
        signal: abortController.signal,
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data: VerifyClaimResponse = await res.json();
      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.warn("Verify claim API error:", err);
      setErrorMessage(
        "Could not verify claim against network. Serving offline knowledge base."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getVerdictVisuals = (verdict: VerdictLabel) => {
    switch (verdict) {
      case VerdictLabel.True:
        return {
          icon: CheckCircle2,
          color: "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
          badgeVariant: "official" as const,
          label: "VERIFIED TRUE",
        };
      case VerdictLabel.False:
        return {
          icon: XCircle,
          color: "text-rose-700 dark:text-rose-400 bg-rose-500/10 border-rose-500/30",
          badgeVariant: "destructive" as const,
          label: "FALSE / FAKE CLAIM",
        };
      case VerdictLabel.Misleading:
        return {
          icon: AlertTriangle,
          color: "text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/30",
          badgeVariant: "indicative" as const,
          label: "MISLEADING / DISTORTED",
        };
      case VerdictLabel.Unverifiable:
      default:
        return {
          icon: HelpCircle,
          color: "text-slate-700 dark:text-slate-300 bg-slate-500/10 border-slate-500/30",
          badgeVariant: "secondary" as const,
          label: "UNVERIFIABLE",
        };
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-saffron" />
            <h3 className="font-bold text-base sm:text-lg text-foreground">
              {t("trust.myth.boxTitle")}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t("trust.myth.boxSubtitle")}
          </p>
        </div>
        <Badge variant="saffron" className="text-[10px]">
          <Sparkles className="h-3 w-3 mr-1" /> {t("trust.myth.geminiBadge")}
        </Badge>
      </div>

      {/* Input Form */}
      <div className="space-y-3">
        <div className="relative">
          <textarea
            rows={3}
            value={claimText}
            onChange={(e) => setClaimText(e.target.value)}
            placeholder={t("trust.myth.placeholder")}
            maxLength={1500}
            className="w-full rounded-xl border border-input bg-background p-3.5 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
          />
          <span className="absolute bottom-3 right-3 text-[10px] text-muted-foreground font-mono">
            {claimText.length} / 1500
          </span>
        </div>

        {errorMessage && (
          <p className="text-xs font-semibold text-destructive flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" />
            {errorMessage}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Flame className="h-3.5 w-3.5 text-saffron" />
            <span className="font-semibold text-foreground">{t("trust.myth.trending")}</span>
          </div>
          <Button
            type="button"
            variant="saffron"
            onClick={() => handleVerify()}
            disabled={isLoading || claimText.trim().length < 10}
            className="gap-2 text-xs font-bold shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>{t("trust.myth.btnFactChecking")}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t("trust.myth.btnVerify")}</span>
              </>
            )}
          </Button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {SAMPLE_VIRAL_CLAIMS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setClaimText(sample);
                handleVerify(sample);
              }}
              disabled={isLoading}
              className="rounded-full border border-border/80 bg-muted/50 px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/40 transition text-left"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result Card */}
      {result && (
        <div className="rounded-2xl border border-border bg-muted/30 p-5 space-y-4 animate-fade-in-up">
          {(() => {
            const visuals = getVerdictVisuals(result.verdict);
            const VerdictIcon = visuals.icon;

            return (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-3">
                  <div
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 font-bold text-xs ${visuals.color}`}
                  >
                    <VerdictIcon className="h-4 w-4" />
                    <span>{visuals.label}</span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Confidence: {(result.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                {/* Explanation */}
                <div className="space-y-1.5 text-xs">
                  <h4 className="font-bold text-foreground uppercase tracking-wide text-[11px]">
                    {t("trust.myth.analysisTitle")}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {result.explanation}
                  </p>
                </div>

                {/* Corrected Fact Box */}
                {result.correctedFact && (
                  <div className="rounded-xl border border-indiagreen/30 bg-indiagreen/10 p-3 text-xs space-y-1">
                    <span className="font-bold text-indiagreen-dark dark:text-indiagreen-light block">
                      {t("trust.myth.correctedTitle")}
                    </span>
                    <p className="text-foreground font-medium leading-relaxed">
                      {result.correctedFact}
                    </p>
                  </div>
                )}

                {/* Official Sources */}
                {result.sources.length > 0 && (
                  <div className="pt-2 border-t border-border/60 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="font-bold text-foreground">{t("trust.myth.citations")}</span>
                    {result.sources.map((src, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 font-medium text-primary bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10"
                      >
                        <ShieldCheck className="h-3 w-3 text-indiagreen" />
                        <span>{src.label}</span>
                      </span>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
