"use client";

import React from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { SUPPORTED_LOCALES, getLocaleMeta } from "@/lib/i18n/config";
import { LocaleCode } from "@/lib/types";
import { Globe, Loader2, Sparkles, Check, X } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale, isTranslating, machineNotice, dismissMachineNotice } = useI18n();
  const currentMeta = getLocaleMeta(locale);

  return (
    <div className="relative inline-flex flex-col items-end">
      <div className="flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-2.5 py-1 text-xs shadow-sm backdrop-blur transition hover:border-primary/40">
        {isTranslating ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-saffron" />
        ) : (
          <Globe className="h-3.5 w-3.5 text-primary" />
        )}
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as LocaleCode)}
          className="cursor-pointer bg-transparent font-medium text-foreground outline-none text-xs pr-1"
          aria-label="Select portal language"
        >
          {SUPPORTED_LOCALES.map((l) => (
            <option key={l.code} value={l.code} className="bg-card text-foreground">
              {l.nativeName} ({l.name}) {l.translationTier === "verified" ? "✓" : ""}
            </option>
          ))}
        </select>

        {currentMeta.translationTier === "machine" && (
          <span className="hidden sm:inline-flex items-center gap-0.5 rounded-full bg-saffron/15 px-1.5 py-0.2 text-[9px] font-bold text-saffron-dark uppercase">
            <Sparkles className="h-2.5 w-2.5" /> AI
          </span>
        )}
      </div>

      {/* One-line notice on switch to machine-translated locale */}
      {machineNotice && (
        <div className="absolute right-0 top-full mt-1.5 z-50 flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-900 dark:text-amber-200 shadow-md whitespace-nowrap animate-fade-in-up">
          <Sparkles className="h-3 w-3 text-saffron shrink-0" />
          <span>{machineNotice}</span>
          <button
            type="button"
            onClick={dismissMachineNotice}
            className="text-amber-800 dark:text-amber-300 hover:text-foreground"
            aria-label="Dismiss notice"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
