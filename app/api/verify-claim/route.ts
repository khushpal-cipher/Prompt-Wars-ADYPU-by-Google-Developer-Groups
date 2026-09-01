import { NextRequest, NextResponse } from "next/server";
import { VerifyClaimRequestSchema, VerifyClaimResponse } from "@/lib/schemas";
import { VerdictLabel } from "@/lib/types";
import { generateGeminiContent } from "@/lib/ai/gemini";
import { buildVerifyClaimPrompt } from "@/lib/ai/prompts";

// Curated grounded facts for instant fallback / known myths
const CURATED_FACT_CHECKS: Array<{
  pattern: RegExp;
  verdict: VerdictLabel;
  confidence: number;
  explanation: string;
  correctedFact: string;
  sources: Array<{ label: string; url: string }>;
}> = [
  {
    pattern: /(bank account|otp|credit card|upi|upi pin|financial)/i,
    verdict: VerdictLabel.False,
    confidence: 1.0,
    explanation:
      "Census 2027 enumerators never collect bank accounts, OTPs, UPI PINs, credit cards, or financial particulars under any circumstance.",
    correctedFact:
      "Official Census schedules contain zero financial or banking questions. Anyone asking for financial credentials or UPI PIN is an impostor.",
    sources: [
      {
        label: "Census Act 1948",
        url: "https://censusindia.gov.in/census.website/about/census-act",
      },
      {
        label: "Gazette of India (Notification 16 June 2025)",
        url: "https://egazette.gov.in",
      },
    ],
  },
  {
    pattern: /(court|police|prosecution|evidence|criminal)/i,
    verdict: VerdictLabel.False,
    confidence: 1.0,
    explanation:
      "Section 15 of the Census Act 1948 explicitly bars individual census records from being inspected or admitted as evidence in any civil or criminal proceeding.",
    correctedFact:
      "Your individual responses cannot be subpoenaed by courts, accessed by police, or used in taxation/immigration proceedings.",
    sources: [
      {
        label: "Section 15, Census Act 1948",
        url: "https://censusindia.gov.in/census.website/about/census-act",
      },
    ],
  },
  {
    pattern: /(caste|caste census|social category)/i,
    verdict: VerdictLabel.True,
    confidence: 0.95,
    explanation:
      "The Government has notified that Phase 2 of Census 2027 will enumerate caste/social category data nationwide for the first time since 1931.",
    correctedFact:
      "Caste enumeration is scheduled under Phase 2 (Population Enumeration) in February 2027.",
    sources: [
      {
        label: "Ministry of Home Affairs Gazette Notification",
        url: "https://egazette.gov.in",
      },
    ],
  },
  {
    pattern: /(aadhaar mandatory|aadhaar compulsory)/i,
    verdict: VerdictLabel.Misleading,
    confidence: 0.95,
    explanation:
      "Aadhaar is optional for self-enumeration authentication and is not required for being counted by an enumerator in the field.",
    correctedFact:
      "Citizens without Aadhaar can be enumerated via photo ID or standard verbal verification by official enumerators.",
    sources: [
      {
        label: "ORGI Digital Self-Enumeration Manual",
        url: "https://censusindia.gov.in",
      },
    ],
  },
  {
    pattern: /(fee|payment|money|charge|cost)/i,
    verdict: VerdictLabel.False,
    confidence: 1.0,
    explanation:
      "Census enumeration is a 100% free statutory national exercise. No fees are ever levied.",
    correctedFact:
      "Both online self-enumeration and doorstep enumerator visits are completely free.",
    sources: [
      {
        label: "Office of the Registrar General, India",
        url: "https://censusindia.gov.in",
      },
    ],
  },
];

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parseResult = VerifyClaimRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { claim, locale } = parseResult.data;

    // Check curated rule-based triggers if Gemini is absent
    const matchedCurated = CURATED_FACT_CHECKS.find((rule) =>
      rule.pattern.test(claim)
    );

    if (!process.env.GEMINI_API_KEY) {
      if (matchedCurated) {
        const resp: VerifyClaimResponse = {
          verdict: matchedCurated.verdict,
          confidence: matchedCurated.confidence,
          explanation: matchedCurated.explanation,
          correctedFact: matchedCurated.correctedFact,
          sources: matchedCurated.sources,
          fallbackUsed: true,
        };
        return NextResponse.json(resp);
      }

      const resp: VerifyClaimResponse = {
        verdict: VerdictLabel.Unverifiable,
        confidence: 0.5,
        explanation:
          "Unable to verify claim upstream without API connection. Please cross-check against official Census Act 1948 notices.",
        correctedFact:
          "Refer to official ORGI portal at censusindia.gov.in for verified information.",
        sources: [
          {
            label: "Census Act 1948",
            url: "https://censusindia.gov.in",
          },
        ],
        fallbackUsed: true,
      };
      return NextResponse.json(resp);
    }

    const prompt = buildVerifyClaimPrompt(claim, locale);
    const modelOutput = await generateGeminiContent(prompt);

    if (!modelOutput) {
      throw new Error("No output from model");
    }

    const cleaned = modelOutput.replace(/```json/gi, "").replace(/```/gi, "").trim();
    const parsed = JSON.parse(cleaned);

    const resp: VerifyClaimResponse = {
      verdict: Object.values(VerdictLabel).includes(parsed.verdict as VerdictLabel)
        ? (parsed.verdict as VerdictLabel)
        : VerdictLabel.Unverifiable,
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.9,
      explanation: String(parsed.explanation || "Evaluated by Jan Ganana Fact Checker."),
      correctedFact: parsed.correctedFact ? String(parsed.correctedFact) : null,
      sources: Array.isArray(parsed.sources) && parsed.sources.length > 0
        ? parsed.sources
        : [
            {
              label: "Census Act 1948 & ORGI Guidelines",
              url: "https://censusindia.gov.in",
            },
          ],
      fallbackUsed: false,
    };

    return NextResponse.json(resp);
  } catch (err) {
    console.warn("Verify claim route fallback triggered:", err);

    // Try finding matching curated fallback rule
    const rawBody = await req.clone().json().catch(() => ({}));
    const claimText = typeof rawBody.claim === "string" ? rawBody.claim : "";
    const matchedCurated = CURATED_FACT_CHECKS.find((rule) =>
      rule.pattern.test(claimText)
    );

    if (matchedCurated) {
      const resp: VerifyClaimResponse = {
        verdict: matchedCurated.verdict,
        confidence: matchedCurated.confidence,
        explanation: matchedCurated.explanation,
        correctedFact: matchedCurated.correctedFact,
        sources: matchedCurated.sources,
        fallbackUsed: true,
      };
      return NextResponse.json(resp);
    }

    const resp: VerifyClaimResponse = {
      verdict: VerdictLabel.Unverifiable,
      confidence: 0.5,
      explanation:
        "Claim verification fallback: Under Section 15 of the Census Act 1948, your data is statutory confidential.",
      correctedFact: "Official Gazette notifications determine all Census 2027 parameters.",
      sources: [
        {
          label: "Census Act 1948",
          url: "https://censusindia.gov.in",
        },
      ],
      fallbackUsed: true,
    };
    return NextResponse.json(resp);
  }
}
