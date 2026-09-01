import { NextRequest, NextResponse } from "next/server";
import {
  NarrateChartRequestSchema,
  NarrateChartResponseSchema,
  type NarrateChartResponse,
} from "@/lib/schemas";
import { safeGenerate } from "@/lib/ai/gemini";
import { NARRATE_CHART_SYSTEM_PROMPT } from "@/lib/ai/prompts";

export const runtime = "nodejs";

function getComputedFallback(
  chartId: string,
  _series: Array<Record<string, string | number | null>>
): NarrateChartResponse {
  switch (chartId) {
    case "population-trend":
      return {
        headline:
          "India's population growth demonstrates steady decadal stabilization towards 2027.",
        insights: [
          "India grew from 361.1 million in 1951 to 1.21 billion in 2011, with projected population reaching ~1.445 billion in 2027.",
          "The decadal growth rate peaked in 1971 at 24.8% and is projected to moderate to ~12.1% in the 2011–2027 intercensal period.",
          "Population density has increased nearly fourfold from 117 to an estimated 439 persons per sq km.",
        ],
      };
    case "literacy-sexratio":
      return {
        headline:
          "Dramatic literacy expansion accompanied by long-term sex ratio stabilization.",
        insights: [
          "National literacy has surged from 18.3% in 1951 to 74.04% in 2011, projected to cross 83.5% by 2027.",
          "The overall sex ratio (females per 1000 males) rebounded from a low of 927 in 1991 to 943 in 2011, with positive projections toward 955.",
          "States like Kerala maintain a high sex ratio (1084) while northern states show rapid recovery.",
        ],
      };
    case "urban-rural":
      return {
        headline:
          "Accelerated urban transition transforming India's economic and demographic fabric.",
        insights: [
          "Urban share of total population rose from 17.3% in 1951 to 31.2% in 2011 and is projected to reach ~37.4% by 2027.",
          "Tier-2 and Tier-3 urban clusters drive the majority of inter-state and intra-state economic migration.",
          "Digital amenities like smartphone penetration have rapidly bridged the traditional rural-urban information gap.",
        ],
      };
    case "state-compare":
    default:
      return {
        headline:
          "Comparative regional indicators highlight diverse stages of demographic transition.",
        insights: [
          "Southern and western states lead in urban share and literacy metrics, while northern states contribute larger working-age cohorts.",
          "Digital self-enumeration readiness is highest in urbanized states with established digital e-governance networks.",
        ],
      };
  }
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
    const parsed = NarrateChartRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid chart narration payload",
          code: "VALIDATION_ERROR",
          fallbackUsed: false,
        },
        { status: 400 }
      );
    }

    const { chartId, series, locale } = parsed.data;
    const fallback = getComputedFallback(chartId, series);

    const seriesSnippet = JSON.stringify(series.slice(0, 10));
    const prompt = `Analyze this demographic chart (${chartId}) in locale "${locale}":\n<user_input>\nData Series: ${seriesSnippet}\n</user_input>`;

    const result = await safeGenerate<NarrateChartResponse>({
      prompt,
      system: NARRATE_CHART_SYSTEM_PROMPT,
      schema: NarrateChartResponseSchema,
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
    console.error("Unhandled error in /api/narrate-chart:", err);
    return NextResponse.json(
      {
        error: "Internal error narrating chart",
        code: "UPSTREAM_ERROR",
        fallbackUsed: true,
      },
      { status: 500 }
    );
  }
}
