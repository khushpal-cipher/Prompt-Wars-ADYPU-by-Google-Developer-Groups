import { z } from "zod";
import { LocaleCode, VerdictLabel } from "@/lib/types";

// Supported locales schema
export const LocaleCodeSchema = z.nativeEnum(LocaleCode);

// Generic Error Schema
export const ApiErrorSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
  details: z.any().optional(),
  fallbackUsed: z.boolean().optional().default(false),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

// Chat Request / Response Schemas
export const ChatMessageInputSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

export const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageInputSchema).min(1).max(20),
  locale: LocaleCodeSchema.optional().default(LocaleCode.EN),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

// Verify Claim Request / Response Schemas
export const VerifyClaimRequestSchema = z.object({
  claim: z.string().min(3).max(1500),
  locale: LocaleCodeSchema.optional().default(LocaleCode.EN),
});

export type VerifyClaimRequest = z.infer<typeof VerifyClaimRequestSchema>;

export const SourceCitationSchema = z.object({
  label: z.string(),
  url: z.string().nullable().optional(),
});

export const VerifyClaimResponseSchema = z.object({
  verdict: z.nativeEnum(VerdictLabel),
  confidence: z.number().min(0).max(1),
  explanation: z.string(),
  correctedFact: z.string().nullable().optional(),
  sources: z.array(SourceCitationSchema),
  fallbackUsed: z.boolean().optional().default(false),
});

export type VerifyClaimResponse = z.infer<typeof VerifyClaimResponseSchema>;

// Translate Request / Response Schemas
export const TranslateEntrySchema = z.object({
  key: z.string(),
  text: z.string(),
});

export const TranslateRequestSchema = z.object({
  targetLocale: LocaleCodeSchema,
  entries: z.array(TranslateEntrySchema).min(1).max(80),
});

export type TranslateRequest = z.infer<typeof TranslateRequestSchema>;

export const TranslateResponseSchema = z.object({
  targetLocale: LocaleCodeSchema,
  translations: z.record(z.string(), z.string()),
  fallbackUsed: z.boolean().optional().default(false),
});

export type TranslateResponse = z.infer<typeof TranslateResponseSchema>;

// Explain Field Request / Response Schemas
export const ExplainFieldRequestSchema = z.object({
  fieldId: z.string().min(1).max(100),
  locale: LocaleCodeSchema.optional().default(LocaleCode.EN),
});

export type ExplainFieldRequest = z.infer<typeof ExplainFieldRequestSchema>;

export const ExplainFieldResponseSchema = z.object({
  fieldId: z.string(),
  plainLanguage: z.string(),
  whyItMatters: z.string(),
  example: z.string(),
  fallbackUsed: z.boolean().optional().default(false),
});

export type ExplainFieldResponse = z.infer<typeof ExplainFieldResponseSchema>;

// Narrate Chart Request / Response Schemas
export const NarrateChartRequestSchema = z.object({
  chartId: z.enum(["population-trend", "literacy-sexratio", "urban-rural", "state-compare"]),
  series: z.array(z.record(z.string(), z.union([z.string(), z.number(), z.null()]))),
  locale: LocaleCodeSchema.optional().default(LocaleCode.EN),
});

export type NarrateChartRequest = z.infer<typeof NarrateChartRequestSchema>;

export const NarrateChartResponseSchema = z.object({
  headline: z.string(),
  insights: z.array(z.string()).min(1).max(5),
  policyImplication: z.string().nullable().optional(),
  fallbackUsed: z.boolean().optional().default(false),
});

export type NarrateChartResponse = z.infer<typeof NarrateChartResponseSchema>;
