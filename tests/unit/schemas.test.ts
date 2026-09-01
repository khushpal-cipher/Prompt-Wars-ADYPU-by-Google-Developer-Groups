import { describe, it, expect } from "vitest";
import {
  ChatRequestSchema,
  VerifyClaimRequestSchema,
  TranslateRequestSchema,
  ExplainFieldRequestSchema,
  NarrateChartRequestSchema,
  VerifyClaimResponseSchema,
  TranslateResponseSchema,
  ExplainFieldResponseSchema,
  NarrateChartResponseSchema,
  ApiErrorSchema,
} from "@/lib/schemas";
import { LocaleCode, VerdictLabel } from "@/lib/types";

describe("lib/schemas.ts - Request & Response Boundary Validation", () => {
  describe("ChatRequestSchema", () => {
    it("accepts a valid payload with 1 message and defaults locale to 'en'", () => {
      const parsed = ChatRequestSchema.safeParse({
        messages: [{ role: "user", content: "What is Phase 1?" }],
      });
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.locale).toBe(LocaleCode.EN);
        expect(parsed.data.messages).toHaveLength(1);
      }
    });

    it("rejects empty messages array", () => {
      const parsed = ChatRequestSchema.safeParse({
        messages: [],
      });
      expect(parsed.success).toBe(false);
    });

    it("rejects messages exceeding max limit (21 messages)", () => {
      const messages = Array.from({ length: 21 }, (_, i) => ({
        role: "user" as const,
        content: `Question ${i}`,
      }));
      const parsed = ChatRequestSchema.safeParse({ messages });
      expect(parsed.success).toBe(false);
    });

    it("rejects message content of 2001 chars", () => {
      const longContent = "a".repeat(2001);
      const parsed = ChatRequestSchema.safeParse({
        messages: [{ role: "user", content: longContent }],
      });
      expect(parsed.success).toBe(false);
    });

    it("accepts valid custom locale", () => {
      const parsed = ChatRequestSchema.safeParse({
        messages: [{ role: "user", content: "नमस्ते" }],
        locale: LocaleCode.HI,
      });
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.locale).toBe(LocaleCode.HI);
      }
    });
  });

  describe("VerifyClaimRequestSchema", () => {
    it("rejects a 2-char claim", () => {
      const parsed = VerifyClaimRequestSchema.safeParse({ claim: "ab" });
      expect(parsed.success).toBe(false);
    });

    it("accepts a 3-char claim", () => {
      const parsed = VerifyClaimRequestSchema.safeParse({ claim: "abc" });
      expect(parsed.success).toBe(true);
    });

    it("rejects a 1501-char claim", () => {
      const parsed = VerifyClaimRequestSchema.safeParse({ claim: "a".repeat(1501) });
      expect(parsed.success).toBe(false);
    });

    it("accepts 1500-char claim", () => {
      const parsed = VerifyClaimRequestSchema.safeParse({ claim: "a".repeat(1500) });
      expect(parsed.success).toBe(true);
    });
  });

  describe("TranslateRequestSchema", () => {
    it("rejects empty entries array", () => {
      const parsed = TranslateRequestSchema.safeParse({
        targetLocale: LocaleCode.HI,
        entries: [],
      });
      expect(parsed.success).toBe(false);
    });

    it("accepts exactly 80 entries", () => {
      const entries = Array.from({ length: 80 }, (_, i) => ({
        key: `key_${i}`,
        text: `Text ${i}`,
      }));
      const parsed = TranslateRequestSchema.safeParse({
        targetLocale: LocaleCode.TA,
        entries,
      });
      expect(parsed.success).toBe(true);
    });

    it("rejects 81 entries exceeding batch limit", () => {
      const entries = Array.from({ length: 81 }, (_, i) => ({
        key: `key_${i}`,
        text: `Text ${i}`,
      }));
      const parsed = TranslateRequestSchema.safeParse({
        targetLocale: LocaleCode.MR,
        entries,
      });
      expect(parsed.success).toBe(false);
    });
  });

  describe("ExplainFieldRequestSchema", () => {
    it("rejects empty fieldId", () => {
      const parsed = ExplainFieldRequestSchema.safeParse({ fieldId: "" });
      expect(parsed.success).toBe(false);
    });

    it("rejects fieldId exceeding 100 characters", () => {
      const parsed = ExplainFieldRequestSchema.safeParse({ fieldId: "x".repeat(101) });
      expect(parsed.success).toBe(false);
    });

    it("accepts valid fieldId", () => {
      const parsed = ExplainFieldRequestSchema.safeParse({
        fieldId: "pe_caste_enumeration",
        locale: LocaleCode.HI,
      });
      expect(parsed.success).toBe(true);
    });
  });

  describe("NarrateChartRequestSchema", () => {
    it("rejects unknown chartId", () => {
      const parsed = NarrateChartRequestSchema.safeParse({
        chartId: "nope",
        series: [{ year: 2021, val: 100 }],
      });
      expect(parsed.success).toBe(false);
    });

    it.each([
      "population-trend",
      "literacy-sexratio",
      "urban-rural",
      "state-compare",
    ] as const)("accepts valid chartId: %s", (chartId) => {
      const parsed = NarrateChartRequestSchema.safeParse({
        chartId,
        series: [{ year: 2011, val: 50 }],
      });
      expect(parsed.success).toBe(true);
    });
  });

  describe("Response Schemas & Default Values", () => {
    it("VerifyClaimResponseSchema validates verdict members and rejects invalid confidence", () => {
      const valid = VerifyClaimResponseSchema.safeParse({
        verdict: VerdictLabel.False,
        confidence: 0.95,
        explanation: "Test explanation",
        correctedFact: "Fact",
        sources: [{ label: "Census Act", url: "https://censusindia.gov.in" }],
      });
      expect(valid.success).toBe(true);
      if (valid.success) {
        expect(valid.data.fallbackUsed).toBe(false);
      }

      // Rejects confidence > 1.0
      expect(
        VerifyClaimResponseSchema.safeParse({
          verdict: VerdictLabel.True,
          confidence: 1.5,
          explanation: "Test",
          sources: [],
        }).success
      ).toBe(false);

      // Rejects confidence < 0
      expect(
        VerifyClaimResponseSchema.safeParse({
          verdict: VerdictLabel.True,
          confidence: -0.1,
          explanation: "Test",
          sources: [],
        }).success
      ).toBe(false);

      // Rejects invalid verdict string
      expect(
        VerifyClaimResponseSchema.safeParse({
          verdict: "MAYBE",
          confidence: 0.5,
          explanation: "Test",
          sources: [],
        }).success
      ).toBe(false);
    });

    it("TranslateResponseSchema defaults fallbackUsed to false when omitted", () => {
      const parsed = TranslateResponseSchema.safeParse({
        targetLocale: LocaleCode.HI,
        translations: { "nav.home": "मुख्य पृष्ठ" },
      });
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.fallbackUsed).toBe(false);
      }
    });

    it("ExplainFieldResponseSchema defaults fallbackUsed to false", () => {
      const parsed = ExplainFieldResponseSchema.safeParse({
        fieldId: "hlo_room_count",
        plainLanguage: "Number of rooms",
        whyItMatters: "Housing policy",
        example: "3",
      });
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.fallbackUsed).toBe(false);
      }
    });

    it("NarrateChartResponseSchema defaults fallbackUsed to false", () => {
      const parsed = NarrateChartResponseSchema.safeParse({
        headline: "India's population growth",
        insights: ["Decadal growth rate slowed down."],
      });
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.fallbackUsed).toBe(false);
      }
    });

    it("ApiErrorSchema parses error envelopes", () => {
      const parsed = ApiErrorSchema.safeParse({
        error: "Validation failed",
        code: "VALIDATION_ERROR",
      });
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.fallbackUsed).toBe(false);
      }
    });
  });

  describe("lib/utils.ts - Classname Concatenation (cn)", () => {
    it("merges tailwind class names properly", async () => {
      const { cn } = await import("@/lib/utils");
      expect(cn("px-2 py-1", "bg-blue-500")).toBe("px-2 py-1 bg-blue-500");
      expect(cn("p-4", "p-2")).toBe("p-2");
      expect(cn("base", false && "hidden", undefined, null, "extra")).toBe("base extra");
    });
  });
});
