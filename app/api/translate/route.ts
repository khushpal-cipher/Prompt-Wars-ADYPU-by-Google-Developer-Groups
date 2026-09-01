import { NextRequest, NextResponse } from "next/server";
import {
  TranslateRequestSchema,
  TranslateResponseSchema,
  type TranslateResponse,
} from "@/lib/schemas";
import { safeGenerate } from "@/lib/ai/gemini";
import { TRANSLATE_SYSTEM_PROMPT } from "@/lib/ai/prompts";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 32768) {
      return NextResponse.json(
        {
          error: "Payload too large (>32KB)",
          code: "VALIDATION_ERROR",
          fallbackUsed: false,
        },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = TranslateRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid translate payload",
          code: "VALIDATION_ERROR",
          fallbackUsed: false,
        },
        { status: 400 }
      );
    }

    const { targetLocale, entries } = parsed.data;

    // Fallback dictionary echoing source text
    const fallbackTranslations: Record<string, string> = {};
    for (const item of entries) {
      fallbackTranslations[item.key] = item.text;
    }
    const fallback: TranslateResponse = {
      targetLocale,
      translations: fallbackTranslations,
    };

    const entriesJson = JSON.stringify(entries);
    const prompt = `Target Locale: ${targetLocale}\nTranslate these key-value entries into the native script of ${targetLocale}:\n<user_input>\n${entriesJson}\n</user_input>`;

    const result = await safeGenerate<TranslateResponse>({
      prompt,
      system: TRANSLATE_SYSTEM_PROMPT,
      schema: TranslateResponseSchema,
      fallback,
      temperature: 0.2,
      timeoutMs: 12000,
    });

    return NextResponse.json(result.data, {
      status: 200,
      headers: {
        "x-fallback-used": String(result.fallbackUsed),
      },
    });
  } catch (err) {
    console.error("Unhandled error in /api/translate:", err);
    return NextResponse.json(
      {
        error: "Internal error during translation",
        code: "UPSTREAM_ERROR",
        fallbackUsed: true,
      },
      { status: 500 }
    );
  }
}
