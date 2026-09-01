import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

export const MODEL_ID: string = "gemini-2.5-flash";

let cachedClient: GoogleGenAI | null = null;
let clientInitialized = false;

export function getGeminiClient(): GoogleGenAI | null {
  if (clientInitialized) {
    return cachedClient;
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    clientInitialized = true;
    cachedClient = null;
    return null;
  }
  try {
    cachedClient = new GoogleGenAI({ apiKey: apiKey.trim() });
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI client:", err);
    cachedClient = null;
  }
  clientInitialized = true;
  return cachedClient;
}

export async function generateGeminiContent(
  prompt: string,
  systemInstruction?: string,
  temperature: number = 0.2
): Promise<string | null> {
  const client = getGeminiClient();
  if (!client) return null;

  try {
    const response = await client.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        systemInstruction,
        temperature,
      },
    });
    return response.text || null;
  } catch (err) {
    console.error("Gemini API error in generateGeminiContent:", err);
    return null;
  }
}

export async function safeGenerate<T>(args: {
  prompt: string;
  system: string;
  schema: z.ZodType<T>;
  fallback: T;
  temperature?: number;
  timeoutMs?: number;
}): Promise<{ data: T; fallbackUsed: boolean }> {
  const {
    prompt,
    system,
    schema,
    fallback,
    temperature = 0.3,
    timeoutMs = 12000,
  } = args;

  const client = getGeminiClient();
  if (!client) {
    return { data: fallback, fallbackUsed: true };
  }

  const timeoutPromise = new Promise<{ timeout: true }>((resolve) => {
    setTimeout(() => resolve({ timeout: true }), timeoutMs);
  });

  try {
    const generatePromise = client.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        systemInstruction: system,
        responseMimeType: "application/json",
        temperature,
      },
    });

    const result = await Promise.race([generatePromise, timeoutPromise]);

    if ("timeout" in result && result.timeout) {
      console.warn(`Gemini generation timed out after ${timeoutMs}ms`);
      return { data: fallback, fallbackUsed: true };
    }

    const response = result as Awaited<typeof generatePromise>;
    const text = response.text;
    if (!text) {
      return { data: fallback, fallbackUsed: true };
    }

    try {
      const parsedJson = JSON.parse(text);
      const validated = schema.safeParse(parsedJson);
      if (validated.success) {
        return { data: validated.data, fallbackUsed: false };
      } else {
        console.warn("Gemini output failed schema validation:", validated.error);
        return { data: fallback, fallbackUsed: true };
      }
    } catch (parseErr) {
      console.warn("Gemini output was not valid JSON:", parseErr);
      return { data: fallback, fallbackUsed: true };
    }
  } catch (apiErr) {
    console.error("Gemini API error in safeGenerate:", apiErr);
    return { data: fallback, fallbackUsed: true };
  }
}
