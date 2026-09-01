import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { z } from "zod";
import {
  MODEL_ID,
  getGeminiClient,
  generateGeminiContent,
  safeGenerate,
} from "@/lib/ai/gemini";

// Mock @google/genai
const mockGenerateContent = vi.fn();

vi.mock("@google/genai", () => {
  return {
    GoogleGenAI: class MockGoogleGenAI {
      models = {
        generateContent: mockGenerateContent,
      };
    },
  };
});

describe("lib/ai/gemini.ts - Gemini Client & Safe Generator", () => {
  const originalEnv = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = "test-api-key";
  });

  afterEach(() => {
    process.env.GEMINI_API_KEY = originalEnv;
  });

  it("exports a non-empty string MODEL_ID", () => {
    expect(typeof MODEL_ID).toBe("string");
    expect(MODEL_ID.length).toBeGreaterThan(0);
    expect(MODEL_ID).toBe("gemini-3.6-flash");
  });

  it("getGeminiClient returns client instance when GEMINI_API_KEY is provided", () => {
    const client = getGeminiClient();
    expect(client).not.toBeNull();
  });

  it("generateGeminiContent returns text on successful model call", async () => {
    mockGenerateContent.mockResolvedValueOnce({ text: "Official Census Response" });

    const result = await generateGeminiContent("Test prompt", "System instruction");
    expect(result).toBe("Official Census Response");
    expect(mockGenerateContent).toHaveBeenCalledWith(
      expect.objectContaining({
        model: MODEL_ID,
        contents: "Test prompt",
      })
    );
  });

  it("generateGeminiContent returns null when API throws error", async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error("API Quota Exceeded"));
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await generateGeminiContent("Test prompt");
    expect(result).toBeNull();
    consoleErrorSpy.mockRestore();
  });

  describe("safeGenerate() with Zod boundary verification", () => {
    const TestSchema = z.object({
      verdict: z.string(),
      score: z.number(),
    });
    const fallback = { verdict: "FALLBACK", score: 0 };

    it("returns { fallbackUsed: false } and parsed data on valid JSON conforming to schema", async () => {
      mockGenerateContent.mockResolvedValueOnce({
        text: JSON.stringify({ verdict: "VERIFIED", score: 98 }),
      });

      const res = await safeGenerate({
        prompt: "Verify data",
        system: "System instructions",
        schema: TestSchema,
        fallback,
      });

      expect(res.fallbackUsed).toBe(false);
      expect(res.data).toEqual({ verdict: "VERIFIED", score: 98 });
    });

    it("returns { fallbackUsed: true } when model output is not valid JSON", async () => {
      mockGenerateContent.mockResolvedValueOnce({
        text: "I am not JSON, just plain text",
      });
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const res = await safeGenerate({
        prompt: "Verify data",
        system: "System instructions",
        schema: TestSchema,
        fallback,
      });

      expect(res.fallbackUsed).toBe(true);
      expect(res.data).toEqual(fallback);
      consoleWarnSpy.mockRestore();
    });

    it("returns { fallbackUsed: true } when model JSON fails schema validation", async () => {
      mockGenerateContent.mockResolvedValueOnce({
        text: JSON.stringify({ verdict: 123, score: "invalid_type" }),
      });
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const res = await safeGenerate({
        prompt: "Verify data",
        system: "System instructions",
        schema: TestSchema,
        fallback,
      });

      expect(res.fallbackUsed).toBe(true);
      expect(res.data).toEqual(fallback);
      consoleWarnSpy.mockRestore();
    });

    it("returns { fallbackUsed: true } when model API call throws error", async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error("Network connection severed"));
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const res = await safeGenerate({
        prompt: "Verify data",
        system: "System instructions",
        schema: TestSchema,
        fallback,
      });

      expect(res.fallbackUsed).toBe(true);
      expect(res.data).toEqual(fallback);
      consoleErrorSpy.mockRestore();
    });

    it("honours timeoutMs parameter by resolving to fallback when call exceeds limit", async () => {
      // Promise that never settles
      mockGenerateContent.mockReturnValueOnce(new Promise(() => {}));
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const res = await safeGenerate({
        prompt: "Verify data",
        system: "System instructions",
        schema: TestSchema,
        fallback,
        timeoutMs: 50,
      });

      expect(res.fallbackUsed).toBe(true);
      expect(res.data).toEqual(fallback);
      consoleWarnSpy.mockRestore();
    });
  });
});
