import { NextRequest, NextResponse } from "next/server";
import {
  VerifyClaimRequestSchema,
  VerifyClaimResponseSchema,
  type VerifyClaimResponse,
} from "@/lib/schemas";
import { safeGenerate } from "@/lib/ai/gemini";
import { VERIFY_CLAIM_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { VerdictLabel } from "@/lib/types";

export const runtime = "nodejs";

function sanitize(text: string): string {
  return text.replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/<\/user_input>/g, "").trim();
}

function getCuratedFallback(claim: string): VerifyClaimResponse {
  const lower = claim.toLowerCase();

  if (lower.includes("bank") || lower.includes("account") || lower.includes("otp") || lower.includes("financial")) {
    return {
      verdict: VerdictLabel.False,
      confidence: 0.99,
      explanation:
        "Official Census 2027 operations never collect bank account details, credit/debit card numbers, UPI PINs, or banking OTPs. Any individual or message asking for financial credentials in the name of Census is fraudulent.",
      correctedFact:
        "No financial credentials are ever collected by Census enumerators or the official digital portal.",
      sources: [
        {
          label: "Ministry of Home Affairs & ORGI Anti-Fraud Directive",
          url: "https://censusindia.gov.in",
        },
      ],
    };
  }

  if (lower.includes("court") || lower.includes("evidence") || lower.includes("police") || lower.includes("against you")) {
    return {
      verdict: VerdictLabel.False,
      confidence: 0.98,
      explanation:
        "Under Section 15 of the Census Act, 1948, all individual census records are strictly confidential and legally privileged. They cannot be used against any citizen in court or shared with police or tax agencies.",
      correctedFact:
        "Individual records are barred from court admissibility by Section 15 of the Census Act, 1948.",
      sources: [
        {
          label: "Census Act 1948, Section 15 (Legal Immunity)",
          url: "https://censusindia.gov.in",
        },
      ],
    };
  }

  if (lower.includes("caste") || lower.includes("jati")) {
    return {
      verdict: VerdictLabel.True,
      confidence: 0.95,
      explanation:
        "The Government has officially confirmed that caste enumeration will be conducted during Phase 2 (Population Enumeration) of Census 2027. This marks the first comprehensive national caste count since 1931.",
      correctedFact:
        "Confirmed: Caste enumeration is included in Census 2027 for the first time since 1931.",
      sources: [
        {
          label: "Gazette of India Notification, 16 June 2025",
          url: "https://censusindia.gov.in",
        },
      ],
    };
  }

  if (lower.includes("aadhaar") || lower.includes("mandatory") || lower.includes("compulsory")) {
    return {
      verdict: VerdictLabel.Misleading,
      confidence: 0.92,
      explanation:
        "While digital self-enumeration may offer convenient mobile OTP verification, Aadhaar is NOT mandatory for being enumerated. Census enumeration in India is universal and covers every resident regardless of identity card possession.",
      correctedFact:
        "Enumeration is universal and constitutional; it cannot be conditioned on having an Aadhaar card.",
      sources: [
        {
          label: "ORGI Enumerator Manual & Census Act 1948",
          url: "https://censusindia.gov.in",
        },
      ],
    };
  }

  if (lower.includes("fee") || lower.includes("pay") || lower.includes("charge") || lower.includes("money")) {
    return {
      verdict: VerdictLabel.False,
      confidence: 0.99,
      explanation:
        "Both self-enumeration on the official web portal and field enumeration by visiting government officials are 100% free of cost for all citizens.",
      correctedFact: "Census enumeration is completely free. No fees are ever charged.",
      sources: [
        {
          label: "ORGI Public Advisory on Census 2027",
          url: "https://censusindia.gov.in",
        },
      ],
    };
  }

  return {
    verdict: VerdictLabel.Unverifiable,
    confidence: 0.7,
    explanation:
      "This claim does not match notified Gazette procedures for Census 2027. Official census operations strictly adhere to the Census Act 1948 and Gazette notifications.",
    correctedFact:
      "Always rely on official ORGI gazette notifications at censusindia.gov.in for verified information.",
    sources: [
      {
        label: "Office of the Registrar General of India",
        url: "https://censusindia.gov.in",
      },
    ],
  };
}

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
    const parsed = VerifyClaimRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid claim payload or schema parameters",
          code: "VALIDATION_ERROR",
          fallbackUsed: false,
        },
        { status: 400 }
      );
    }

    const { claim, locale } = parsed.data;
    const cleanClaim = sanitize(claim);
    const fallback = getCuratedFallback(cleanClaim);

    const prompt = `Analyze this claim regarding India's Census 2027 in locale "${locale}":\n<user_input>\n${cleanClaim}\n</user_input>`;

    const result = await safeGenerate<VerifyClaimResponse>({
      prompt,
      system: VERIFY_CLAIM_SYSTEM_PROMPT,
      schema: VerifyClaimResponseSchema,
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
    console.error("Unhandled error in /api/verify-claim:", err);
    return NextResponse.json(
      {
        error: "Internal error verifying claim",
        code: "UPSTREAM_ERROR",
        fallbackUsed: true,
      },
      { status: 500 }
    );
  }
}
