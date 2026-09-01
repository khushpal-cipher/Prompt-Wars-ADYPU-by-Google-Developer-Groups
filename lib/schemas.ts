import { z } from "zod";
import { LocaleCode, VerdictLabel } from "./types";

export const ChatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      })
    )
    .min(1)
    .max(20),
  locale: z.nativeEnum(LocaleCode),
});

export const VerifyClaimRequestSchema = z.object({
  claim: z.string().trim().min(10).max(1500),
  locale: z.nativeEnum(LocaleCode),
});

export const VerifyClaimResponseSchema = z.object({
  verdict: z.nativeEnum(VerdictLabel),
  confidence: z.number().min(0).max(1),
  explanation: z.string().min(1).max(1200),
  correctedFact: z.string().max(800).nullable(),
  sources: z
    .array(
      z.object({
        label: z.string(),
        url: z.string().url().nullable(),
      })
    )
    .max(5),
});

export const TranslateRequestSchema = z.object({
  targetLocale: z.nativeEnum(LocaleCode),
  entries: z
    .array(
      z.object({
        key: z.string().min(1).max(120),
        text: z.string().min(1).max(600),
      })
    )
    .min(1)
    .max(80),
});

export const TranslateResponseSchema = z.object({
  targetLocale: z.nativeEnum(LocaleCode),
  translations: z.record(z.string(), z.string()),
});

export const ExplainFieldRequestSchema = z.object({
  fieldId: z.string().min(1).max(80),
  locale: z.nativeEnum(LocaleCode),
});

export const ExplainFieldResponseSchema = z.object({
  plainLanguage: z.string().max(500),
  whyItMatters: z.string().max(400),
  example: z.string().max(300),
});

export const NarrateChartRequestSchema = z.object({
  chartId: z.enum([
    "population-trend",
    "literacy-sexratio",
    "urban-rural",
    "state-compare",
  ]),
  series: z
    .array(z.record(z.string(), z.union([z.string(), z.number(), z.null()])))
    .max(80),
  locale: z.nativeEnum(LocaleCode),
});

export const NarrateChartResponseSchema = z.object({
  headline: z.string().max(120),
  insights: z.array(z.string().max(240)).min(2).max(4),
});

export const ApiErrorSchema = z.object({
  error: z.string(),
  code: z.enum([
    "VALIDATION_ERROR",
    "RATE_LIMITED",
    "UPSTREAM_ERROR",
    "MISSING_KEY",
  ]),
  fallbackUsed: z.boolean(),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type VerifyClaimRequest = z.infer<typeof VerifyClaimRequestSchema>;
export type VerifyClaimResponse = z.infer<typeof VerifyClaimResponseSchema>;
export type TranslateRequest = z.infer<typeof TranslateRequestSchema>;
export type TranslateResponse = z.infer<typeof TranslateResponseSchema>;
export type ExplainFieldRequest = z.infer<typeof ExplainFieldRequestSchema>;
export type ExplainFieldResponse = z.infer<typeof ExplainFieldResponseSchema>;
export type NarrateChartRequest = z.infer<typeof NarrateChartRequestSchema>;
export type NarrateChartResponse = z.infer<typeof NarrateChartResponseSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
