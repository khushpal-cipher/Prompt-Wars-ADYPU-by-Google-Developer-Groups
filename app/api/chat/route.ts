import { NextRequest } from "next/server";
import { ChatRequestSchema } from "@/lib/schemas";
import { getGeminiClient, MODEL_ID } from "@/lib/ai/gemini";
import { SAHAYAK_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { KNOWLEDGE_BASE } from "@/lib/data/knowledge-base";

function sanitize(text: string): string {
  return text.replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/<\/user_input>/g, "").trim();
}

function findFallbackAnswer(query: string): string {
  const lower = query.toLowerCase();
  for (const item of KNOWLEDGE_BASE) {
    if (
      item.tags.some((t) => lower.includes(t)) ||
      lower.includes(item.question.toLowerCase().slice(0, 15))
    ) {
      return `${item.answer}\n\n[Official Source: ${item.sourceLabel}] (Offline Knowledge Mode)`;
    }
  }
  return "Census 2027 is India's 16th National Census and first fully digital census. Phase 1 (House Listing) runs 1 April – 30 September 2026, and Phase 2 (Population Enumeration) runs 9 – 28 February 2027 (reference moment 1 March 2027). Under Section 15 of Census Act 1948, your data is strictly confidential. (Offline Knowledge Mode)";
}

export async function POST(req: NextRequest) {
  try {
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 32768) {
      return new Response(
        JSON.stringify({
          error: "Payload too large (>32KB)",
          code: "VALIDATION_ERROR",
          fallbackUsed: false,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = ChatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request shape or parameters",
          code: "VALIDATION_ERROR",
          fallbackUsed: false,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages, locale } = parsed.data;
    const latestUserMsg = messages[messages.length - 1]?.content || "";
    const cleanUserText = sanitize(latestUserMsg);

    const client = getGeminiClient();

    // If Gemini client is not configured or fails, emit static fallback stream
    if (!client) {
      const fallbackText = findFallbackAnswer(cleanUserText);
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const words = fallbackText.split(" ");
          for (const word of words) {
            controller.enqueue(encoder.encode(`data: ${word} \n\n`));
            await new Promise((r) => setTimeout(r, 20));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        },
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    // Call Gemini with streaming
    const formattedPrompt = `${SAHAYAK_SYSTEM_PROMPT}\nTarget Locale: ${locale}\n\nUser Question:\n<user_input>\n${cleanUserText}\n</user_input>`;

    try {
      const responseStream = await client.models.generateContentStream({
        model: MODEL_ID,
        contents: formattedPrompt,
      });

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of responseStream) {
              const text = chunk.text;
              if (text) {
                controller.enqueue(encoder.encode(`data: ${text}\n\n`));
              }
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          } catch (streamErr) {
            console.error("Stream interrupted, sending recovery tokens:", streamErr);
            controller.enqueue(
              encoder.encode("data:  ...(response interrupted, official offline mode active)\n\n")
            );
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    } catch (genErr) {
      console.warn("Gemini streaming error, falling back to static stream:", genErr);
      const fallbackText = findFallbackAnswer(cleanUserText);
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const words = fallbackText.split(" ");
          for (const word of words) {
            controller.enqueue(encoder.encode(`data: ${word} \n\n`));
            await new Promise((r) => setTimeout(r, 20));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        },
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }
  } catch (err) {
    console.error("Unhandled error in /api/chat:", err);
    return new Response(
      JSON.stringify({
        error: "Internal server error in streaming chat",
        code: "UPSTREAM_ERROR",
        fallbackUsed: true,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
