"use client";

import React from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { SUPPORTED_LOCALES } from "@/lib/i18n/config";
import { LocaleCode } from "@/lib/types";
import { Globe, Loader2 } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale, isTranslating } = useI18n();

  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-2.5 py-1 text-xs shadow-sm backdrop-blur transition hover:border-primary/40">
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
              {l.nativeName} ({l.name})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
