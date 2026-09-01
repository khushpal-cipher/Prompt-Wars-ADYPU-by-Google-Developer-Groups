import { NextRequest, NextResponse } from "next/server";
import { NarrateChartRequestSchema, NarrateChartResponse } from "@/lib/schemas";
import { generateGeminiContent } from "@/lib/ai/gemini";
import { buildNarrateChartPrompt } from "@/lib/ai/prompts";

const CURATED_NARRATIONS: Record<
  string,
  { headline: string; insights: string[]; policyImplication?: string }
> = {
  "population-trend": {
    headline: "India's population growth decelerates from 24.8% peak in 1971 to 9.2% projection in 2027.",
    insights: [
      "Total population crossed 1 billion in 2001 and is projected at 1.45 billion by Census 2027.",
      "Decadal growth rate halved over 5 decades, demonstrating demographic transition to replacement fertility.",
      "Population density surged from 117 persons/km² (1951) to 442 persons/km² (2027 projected).",
    ],
    policyImplication: "Focus shifts from population control to demographic dividend and aging care.",
  },
  "literacy-sexratio": {
    headline: "National literacy surges from 18.3% (1951) to projected 82.5% in 2027 alongside sex ratio recovery.",
    insights: [
      "Literacy rate quadrupled over seven decades, led by massive gains in female schooling.",
      "Sex ratio reached its lowest trough in 1991 (927 females / 1000 males) before rebounding toward 952.",
      "Southern states achieved near-parity earlier than northern agrarian belts.",
    ],
    policyImplication: "Targeted higher-education and STEM access for women in transitioning districts.",
  },
  "urban-rural": {
    headline: "Urban population share expands from 17.3% (1951) to an estimated 37.0% in 2027.",
    insights: [
      "Over 530 million Indians now reside in designated urban and peri-urban agglomerations.",
      "Rural population growth has plateaued, with natural growth absorbed by urban migration.",
      "Tier-2 and Tier-3 smart cities absorb the fastest growth rates across western and southern states.",
    ],
    policyImplication: "Massive urban infrastructure investments required for transit, sewage, and drinking water.",
  },
  "state-compare": {
    headline: "Inter-state comparison reveals stark regional demographic divergence.",
    insights: [
      "Southern states have completed demographic transition with high literacy and balanced sex ratios.",
      "Northern plains show higher absolute density and younger median age profiles.",
      "Urbanization and services economy correlate strongly with higher state human development indices.",
    ],
    policyImplication: "Custom state-specific fiscal allocations rather than one-size-fits-all national formulas.",
  },
};

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parseResult = NarrateChartRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { chartId, series, locale } = parseResult.data;

    const curated = CURATED_NARRATIONS[chartId];
    if (curated && locale === "en") {
      const resp: NarrateChartResponse = {
        headline: curated.headline,
        insights: curated.insights,
        policyImplication: curated.policyImplication,
        fallbackUsed: true,
      };
      return NextResponse.json(resp);
    }

    if (!process.env.GEMINI_API_KEY) {
      const resp: NarrateChartResponse = {
        headline:
          curated?.headline ||
          "Demographic analysis from 1951 to 2027 shows structural socioeconomic transition.",
        insights: curated?.insights || [
          "Steady secular improvements in human development indicators.",
          "Regional variances reflect differing stages of demographic transition.",
        ],
        policyImplication: curated?.policyImplication,
        fallbackUsed: true,
      };
      return NextResponse.json(resp);
    }

    const prompt = buildNarrateChartPrompt(chartId, series, locale);
    const modelOutput = await generateGeminiContent(prompt);

    if (!modelOutput) {
      throw new Error("No output from model");
    }

    const cleaned = modelOutput.replace(/```json/gi, "").replace(/```/gi, "").trim();
    const parsed = JSON.parse(cleaned);

    const resp: NarrateChartResponse = {
      headline: String(parsed.headline || curated?.headline || "Census Data Story"),
      insights: Array.isArray(parsed.insights)
        ? parsed.insights.map(String)
        : curated?.insights || ["Comprehensive demographic transition underway."],
      policyImplication: parsed.policyImplication ? String(parsed.policyImplication) : null,
      fallbackUsed: false,
    };

    return NextResponse.json(resp);
  } catch (err) {
    console.warn("Narrate chart route fallback triggered:", err);
    const resp: NarrateChartResponse = {
      headline: "Historical Census trends illustrate seven decades of national development.",
      insights: [
        "Consistent decadal progress across education and vital statistics.",
        "Projections for 2027 provide a vital baseline for next-generation policy planning.",
      ],
      fallbackUsed: true,
    };
    return NextResponse.json(resp);
  }
}
