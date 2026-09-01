"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { LocaleCode } from "@/lib/types";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";

import enDict from "@/lib/i18n/dictionaries/en.json";
import hiDict from "@/lib/i18n/dictionaries/hi.json";
import bnDict from "@/lib/i18n/dictionaries/bn.json";
import taDict from "@/lib/i18n/dictionaries/ta.json";
import mrDict from "@/lib/i18n/dictionaries/mr.json";
import teDict from "@/lib/i18n/dictionaries/te.json";

type Dictionary = Record<string, string>;

const BUNDLED_DICTIONARIES: Partial<Record<LocaleCode, Dictionary>> = {
  [LocaleCode.EN]: enDict,
  [LocaleCode.HI]: hiDict,
  [LocaleCode.BN]: bnDict,
  [LocaleCode.TA]: taDict,
  [LocaleCode.MR]: mrDict,
  [LocaleCode.TE]: teDict,
};

interface I18nContextValue {
  locale: LocaleCode;
  setLocale: (l: LocaleCode) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  isTranslating: boolean;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_LOCALE_KEY = "jg27.locale";
const STORAGE_CACHE_PREFIX = "jg27.tcache.";

function readStoredLocale(): LocaleCode {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const saved = localStorage.getItem(STORAGE_LOCALE_KEY);
    if (saved && Object.values(LocaleCode).includes(saved as LocaleCode)) {
      return saved as LocaleCode;
    }
  } catch (err) {
    console.warn("Could not read locale from localStorage:", err);
  }
  return DEFAULT_LOCALE;
}

function readStoredCache(locale: LocaleCode): Dictionary {
  if (typeof window === "undefined") return {};
  try {
    const cached = localStorage.getItem(`${STORAGE_CACHE_PREFIX}${locale}`);
    if (cached) {
      return JSON.parse(cached) as Dictionary;
    }
  } catch (err) {
    console.warn("Could not read translation cache:", err);
  }
  return {};
}

function writeStoredCache(locale: LocaleCode, dict: Dictionary): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      `${STORAGE_CACHE_PREFIX}${locale}`,
      JSON.stringify(dict)
    );
  } catch (err) {
    console.warn("Could not write translation cache to localStorage:", err);
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(DEFAULT_LOCALE);
  const [translations, setTranslations] = useState<Dictionary>(enDict);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const pendingRequestRef = useRef<AbortController | null>(null);

  const changeLocale = useCallback(async (newLocale: LocaleCode) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_LOCALE_KEY, newLocale);
    } catch (err) {
      console.warn("Could not save locale:", err);
    }

    // If English, use enDict directly
    if (newLocale === LocaleCode.EN) {
      setTranslations(enDict);
      setIsTranslating(false);
      return;
    }

    // Check bundled dictionaries
    const bundled = BUNDLED_DICTIONARIES[newLocale];
    if (bundled) {
      const merged = { ...enDict, ...bundled };
      setTranslations(merged);
      setIsTranslating(false);
      return;
    }

    // Check localStorage cache
    const cached = readStoredCache(newLocale);
    if (Object.keys(cached).length > 0) {
      setTranslations({ ...enDict, ...cached });
      setIsTranslating(false);
      return;
    }

    // If not bundled and not cached, fetch on the fly
    if (pendingRequestRef.current) {
      pendingRequestRef.current.abort();
    }
    const abortController = new AbortController();
    pendingRequestRef.current = abortController;

    setIsTranslating(true);
    try {
      const sampleEntries = Object.entries(enDict).slice(0, 40).map(([k, v]) => ({
        key: k,
        text: v,
      }));

      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetLocale: newLocale,
          entries: sampleEntries,
        }),
        signal: abortController.signal,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.translations) {
          const merged = { ...enDict, ...data.translations };
          setTranslations(merged);
          writeStoredCache(newLocale, data.translations);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      console.warn("Translation fetch error, retaining fallback:", err);
    } finally {
      setIsTranslating(false);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    const initialLocale = readStoredLocale();
    if (initialLocale !== DEFAULT_LOCALE) {
      changeLocale(initialLocale);
    }
  }, [changeLocale]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      let str = translations[key] || (enDict as Dictionary)[key] || key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(new RegExp(`{{${k}}}`, "g"), String(v));
        });
      }
      return str;
    },
    [translations]
  );

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale: changeLocale,
        t,
        isTranslating,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within a LanguageProvider");
  }
  return context;
}
