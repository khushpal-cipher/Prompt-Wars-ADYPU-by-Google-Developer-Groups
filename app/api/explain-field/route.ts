import { NextRequest, NextResponse } from "next/server";
import {
  ExplainFieldRequestSchema,
  ExplainFieldResponseSchema,
  type ExplainFieldResponse,
} from "@/lib/schemas";
import { safeGenerate } from "@/lib/ai/gemini";
import { EXPLAIN_FIELD_SYSTEM_PROMPT } from "@/lib/ai/prompts";

export const runtime = "nodejs";

const FIELD_FALLBACKS: Record<string, ExplainFieldResponse> = {
  hlo_building_use: {
    plainLanguage:
      "Identifies whether this structure is used purely for residence, commercial shop, workshop, school, healthcare, or mixed use.",
    whyItMatters:
      "Enables urban town planners and local bodies to assess residential density and plan commercial zoning.",
    example: "Residential only, Residence-cum-tailoring shop, Commercial clinic.",
  },
  hlo_drinking_water_source: {
    plainLanguage:
      "Records the primary source of drinking water used by the household and whether it is within premises, near premises, or away.",
    whyItMatters:
      "Guides the Jal Jeevan Mission and municipal water pipeline investments to unserved habitations.",
    example: "Treated tap water within premises, Handpump near premises (within 100m).",
  },
  hlo_internet_broadband: {
    plainLanguage:
      "Records whether the household has access to an active broadband connection, Wi-Fi router, or mobile cellular data.",
    whyItMatters:
      "Measures national digital divide to plan BharatNet rural broadband and telecom tower rollout.",
    example: "Yes, Fiber-to-the-home broadband with Wi-Fi router.",
  },
  pe_caste_enumeration: {
    plainLanguage:
      "Records the citizen's specific caste/sub-caste name as declared by the individual respondent.",
    whyItMatters:
      "Provides empirical data for social justice policies, targeted welfare allocations, and affirmative action programs.",
    example: "Self-declared community or caste name matching family heritage.",
  },
  pe_work_status_economic_activity: {
    plainLanguage:
      "Records whether a person worked for 6 months or more (Main Worker), worked for less than 6 months (Marginal Worker), or was a Non-Worker.",
    whyItMatters:
      "Critical for national labor force statistics, employment generation policies, and skill development schemes.",
    example: "Main worker (Software engineer, Teacher), Marginal worker (Seasonal agricultural harvester).",
  },
};

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
    const parsed = ExplainFieldRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid field explain payload",
          code: "VALIDATION_ERROR",
          fallbackUsed: false,
        },
        { status: 400 }
      );
    }

    const { fieldId, locale } = parsed.data;

    const fallback: ExplainFieldResponse = FIELD_FALLBACKS[fieldId] || {
      plainLanguage: `This field collects official census data for "${fieldId}" to understand household living standards and individual demographics.`,
      whyItMatters:
        "Helps the government allocate budgets, welfare resources, and public infrastructure equitably.",
      example: "Select the option that best accurately describes your household status.",
    };

    const prompt = `Explain the Census 2027 field "${fieldId}" in plain, accessible language for a citizen in locale "${locale}":\n<user_input>\nField ID: ${fieldId}\n</user_input>`;

    const result = await safeGenerate<ExplainFieldResponse>({
      prompt,
      system: EXPLAIN_FIELD_SYSTEM_PROMPT,
      schema: ExplainFieldResponseSchema,
      fallback,
      temperature: 0.3,
      timeoutMs: 12000,
    });

    return NextResponse.json(result.data, {
      status: 200,
      headers: {
        "x-fallback-used": String(result.fallbackUsed),
      },
    });
  } catch (err) {
    console.error("Unhandled error in /api/explain-field:", err);
    return NextResponse.json(
      {
        error: "Internal error explaining field",
        code: "UPSTREAM_ERROR",
        fallbackUsed: true,
      },
      { status: 500 }
    );
  }
}
