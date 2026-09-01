import { NextRequest, NextResponse } from "next/server";
import { ExplainFieldRequestSchema, ExplainFieldResponse } from "@/lib/schemas";
import { generateGeminiContent } from "@/lib/ai/gemini";
import { buildExplainFieldPrompt } from "@/lib/ai/prompts";
import { HLO_FIELDS, PE_FIELDS } from "@/lib/data/phases";

const CURATED_EXPLANATIONS: Record<
  string,
  { plainLanguage: string; whyItMatters: string; example: string }
> = {
  hlo_building_use: {
    plainLanguage:
      "Records whether your premise is used purely as a residence, shop, workshop, school, or factory.",
    whyItMatters:
      "Helps city planners distinguish residential density from commercial zoning.",
    example: "Residential Only",
  },
  hlo_room_count: {
    plainLanguage:
      "Total number of living rooms exclusively occupied by your household members.",
    whyItMatters:
      "Measures housing congestion and informs national affordable housing quotas.",
    example: "3 living rooms",
  },
  pe_caste_enumeration: {
    plainLanguage:
      "Self-declaration of caste/tribe/social category for targeted affirmative action and welfare schemes.",
    whyItMatters:
      "Constitutional mandate to ensure equitable socio-economic development across all communities.",
    example: "Self-declared accurate category",
  },
  pe_work_status_economic_activity: {
    plainLanguage:
      "Whether you worked for 6+ months (Main Worker), 3-6 months (Marginal Worker), or are a student/homemaker.",
    whyItMatters:
      "Critical for employment policy, labor force participation rates, and social security programs.",
    example: "Main Worker (Employed >= 6 months in past year)",
  },
};

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parseResult = ExplainFieldRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { fieldId, locale } = parseResult.data;

    // Look up metadata in static list
    const allFields = [...HLO_FIELDS, ...PE_FIELDS];
    const fieldDef = allFields.find((f) => f.id === fieldId);

    const curated = CURATED_EXPLANATIONS[fieldId];
    if (curated && locale === "en") {
      const resp: ExplainFieldResponse = {
        fieldId,
        plainLanguage: curated.plainLanguage,
        whyItMatters: curated.whyItMatters,
        example: curated.example,
        fallbackUsed: true,
      };
      return NextResponse.json(resp);
    }

    if (!process.env.GEMINI_API_KEY) {
      const resp: ExplainFieldResponse = {
        fieldId,
        plainLanguage:
          curated?.plainLanguage ||
          `Official Census 2027 guideline for field ${fieldId}.`,
        whyItMatters:
          curated?.whyItMatters ||
          "Supports equitable public policy and resource distribution.",
        example: curated?.example || "Standard accurate declaration.",
        fallbackUsed: true,
      };
      return NextResponse.json(resp);
    }

    const prompt = buildExplainFieldPrompt(
      fieldId,
      {
        category: fieldDef?.category || "Household / Demographic",
        isNew2027: fieldDef?.isNew2027 || false,
        phase: fieldDef?.phase || "General",
      },
      locale
    );

    const modelOutput = await generateGeminiContent(prompt);
    if (!modelOutput) {
      throw new Error("No model output returned");
    }

    const cleaned = modelOutput.replace(/```json/gi, "").replace(/```/gi, "").trim();
    const parsed = JSON.parse(cleaned);

    const resp: ExplainFieldResponse = {
      fieldId,
      plainLanguage: String(parsed.plainLanguage || curated?.plainLanguage || ""),
      whyItMatters: String(parsed.whyItMatters || curated?.whyItMatters || ""),
      example: String(parsed.example || curated?.example || ""),
      fallbackUsed: false,
    };

    return NextResponse.json(resp);
  } catch (err) {
    console.warn("Field explainer route fallback triggered:", err);
    const resp: ExplainFieldResponse = {
      fieldId: "generic_field",
      plainLanguage:
        "Official Census 2027 field declaration guideline according to Registrar General of India.",
      whyItMatters: "Enables accurate demographic estimation and national development planning.",
      example: "Self-declared standard response.",
      fallbackUsed: true,
    };
    return NextResponse.json(resp);
  }
}
