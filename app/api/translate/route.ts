import { NextRequest, NextResponse } from "next/server";
import { TranslateRequestSchema, TranslateResponse } from "@/lib/schemas";
import { generateGeminiContent } from "@/lib/ai/gemini";
import { buildTranslatePrompt } from "@/lib/ai/prompts";
import { LocaleCode } from "@/lib/types";

import hiDict from "@/lib/i18n/dictionaries/hi.json";
import bnDict from "@/lib/i18n/dictionaries/bn.json";
import taDict from "@/lib/i18n/dictionaries/ta.json";
import mrDict from "@/lib/i18n/dictionaries/mr.json";
import teDict from "@/lib/i18n/dictionaries/te.json";

type Dictionary = Record<string, string>;

const BUNDLED_TRANSLATIONS: Partial<Record<LocaleCode, Dictionary>> = {
  [LocaleCode.HI]: hiDict,
  [LocaleCode.BN]: bnDict,
  [LocaleCode.TA]: taDict,
  [LocaleCode.MR]: mrDict,
  [LocaleCode.TE]: teDict,
};

export async function POST(req: NextRequest) {
  let rawBody: Record<string, unknown> = {};
  try {
    rawBody = await req.json();
    const parseResult = TranslateRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { targetLocale, entries } = parseResult.data;

    // Check if target is a bundled verified locale
    const bundled = BUNDLED_TRANSLATIONS[targetLocale];
    if (bundled) {
      const translatedMap: Record<string, string> = {};
      entries.forEach((e) => {
        translatedMap[e.key] = bundled[e.key] || e.text;
      });
      const resp: TranslateResponse = {
        targetLocale,
        translations: translatedMap,
        fallbackUsed: false,
      };
      return NextResponse.json(resp);
    }

    if (!process.env.GEMINI_API_KEY) {
      // Return English original as fallback
      const fallbackMap: Record<string, string> = {};
      entries.forEach((e) => {
        fallbackMap[e.key] = e.text;
      });
      const resp: TranslateResponse = {
        targetLocale,
        translations: fallbackMap,
        fallbackUsed: true,
      };
      return NextResponse.json(resp);
    }

    const prompt = buildTranslatePrompt(entries, targetLocale);
    const modelOutput = await generateGeminiContent(prompt);

    if (!modelOutput) {
      throw new Error("No response from translation model");
    }

    const cleaned = modelOutput.replace(/```json/gi, "").replace(/```/gi, "").trim();
    const parsed = JSON.parse(cleaned);

    const translations: Record<string, string> = {};
    entries.forEach((e) => {
      translations[e.key] =
        parsed.translations?.[e.key] || parsed[e.key] || e.text;
    });

    const resp: TranslateResponse = {
      targetLocale,
      translations,
      fallbackUsed: false,
    };

    return NextResponse.json(resp);
  } catch (err) {
    console.warn("Translation route fallback triggered:", err);
    const entries = Array.isArray(rawBody.entries) ? (rawBody.entries as Array<{ key?: string; text?: string }>) : [];
    const fallbackMap: Record<string, string> = {};
    entries.forEach((e) => {
      if (e.key && e.text) fallbackMap[e.key] = e.text;
    });

    const resp: TranslateResponse = {
      targetLocale: (rawBody.targetLocale as LocaleCode) || LocaleCode.EN,
      translations: fallbackMap,
      fallbackUsed: true,
    };
    return NextResponse.json(resp);
  }
}
