"use client";

import React, { useState } from "react";
import { HelpCircle, Loader2, Sparkles, X } from "lucide-react";
import { useI18n } from "@/components/i18n/LanguageProvider";

interface FieldHelpProps {
  fieldId: string;
  label: string;
}

export function FieldHelp({ fieldId, label }: FieldHelpProps) {
  const { locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<{
    plainLanguage: string;
    whyItMatters: string;
    example: string;
  } | null>(null);

  const fetchExplanation = async () => {
    if (explanation) {
      setIsOpen(true);
      return;
    }
    setIsOpen(true);
    setLoading(true);
    try {
      const res = await fetch("/api/explain-field", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fieldId, locale }),
      });
      if (res.ok) {
        const data = await res.json();
        setExplanation(data);
      }
    } catch (err) {
      console.warn("Failed to fetch field help:", err);
      setExplanation({
        plainLanguage: `Official Census 2027 guideline for ${label}.`,
        whyItMatters: "Helps target infrastructure and civic development schemes.",
        example: "Accurately select the status matching your household.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={fetchExplanation}
        className="rounded-full p-1 text-muted-foreground hover:text-primary transition"
        aria-label={`Explain ${label}`}
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>

      {isOpen && (
        <div className="absolute left-0 bottom-full mb-2 z-50 w-72 rounded-xl border border-border bg-card p-3 shadow-xl text-xs animate-fade-in-up">
          <div className="flex items-center justify-between border-b border-border/60 pb-1.5 mb-2">
            <span className="font-bold text-primary flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-saffron" />
              <span>{label}</span>
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-4 text-muted-foreground gap-1.5 text-[11px]">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-saffron" />
              <span>Fetching official guidance...</span>
            </div>
          ) : explanation ? (
            <div className="space-y-2 text-[11px]">
              <div>
                <span className="font-bold text-foreground block">What it means:</span>
                <span className="text-muted-foreground leading-tight">
                  {explanation.plainLanguage}
                </span>
              </div>
              <div>
                <span className="font-bold text-indiagreen-dark dark:text-indiagreen-light block">
                  Why it matters:
                </span>
                <span className="text-muted-foreground leading-tight">
                  {explanation.whyItMatters}
                </span>
              </div>
              <div className="rounded bg-muted/70 p-1.5 font-mono text-[10px] text-foreground">
                <span className="font-bold">e.g. </span>
                {explanation.example}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
