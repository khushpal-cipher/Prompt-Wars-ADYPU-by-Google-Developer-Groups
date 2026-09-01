"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { type ChatMessage } from "@/lib/types";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  RotateCcw,
  WifiOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PRESET_QUESTIONS = [
  "What are the two phases of Census 2027?",
  "When is the reference date for Census?",
  "Is caste being counted in 2027?",
  "How does digital self-enumeration work?",
  "Is Aadhaar mandatory for Census?",
];

export function SahayakDock() {
  const { locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial_1",
      role: "assistant",
      content:
        "Namaste! I am Jan Ganana Sahayak (जन गणना सहायक), your official Census 2027 AI assistant. How can I help you regarding self-enumeration, schedules, privacy laws, or phases?",
      citations: ["Census Act 1948", "Gazette of India"],
      createdAt: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamBufferRef = useRef<string>("");
  const animFrameRef = useRef<number | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: textToSend.trim(),
      citations: [],
      createdAt: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsStreaming(true);

    const assistantMsgId = `asst_${Date.now()}`;
    const placeholderAssistant: ChatMessage = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      citations: [],
      createdAt: Date.now(),
    };

    setMessages([...newMessages, placeholderAssistant]);
    streamBufferRef.current = "";

    try {
      const payloadMessages = newMessages
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: payloadMessages,
          locale,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      if (!res.body) {
        throw new Error("No response stream body");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let doneReading = false;

      const scheduleFlush = () => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = requestAnimationFrame(() => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? { ...msg, content: streamBufferRef.current }
                : msg
            )
          );
        });
      };

      while (!doneReading) {
        const { value, done } = await reader.read();
        doneReading = done;
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") {
                doneReading = true;
                break;
              }
              streamBufferRef.current += data;
              scheduleFlush();
            }
          }
        }
      }

      // Check if fallback was used in content
      if (streamBufferRef.current.includes("Offline Knowledge Mode")) {
        setIsOfflineMode(true);
      }
    } catch (err) {
      console.warn("Streaming chat error, serving grounded fallback:", err);
      setIsOfflineMode(true);
      const fallbackContent =
        "Census 2027 is India's 16th National Census. Phase 1 (House Listing) runs 1 April – 30 September 2026, and Phase 2 (Population Enumeration) runs 9 – 28 February 2027. Under Section 15 of Census Act 1948, your data is strictly confidential. (Offline Knowledge Mode)";
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId ? { ...msg, content: fallbackContent } : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: "initial_1",
        role: "assistant",
        content:
          "Namaste! I am Jan Ganana Sahayak (जन गणना सहायक). How can I assist you with Census 2027?",
        citations: ["Census Act 1948"],
        createdAt: Date.now(),
      },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Trigger Pill */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-primary/25 border-2 border-saffron"
          aria-label="Open Census Sahayak AI assistant"
        >
          <div className="relative">
            <Bot className="h-5 w-5 text-saffron-light" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-saffron"></span>
            </span>
          </div>
          <span className="font-bold text-sm tracking-tight text-white">
            Sahayak AI
          </span>
        </button>
      )}

      {/* Expanded Chat Box */}
      {isOpen && (
        <div
          className="flex h-[540px] w-[360px] sm:w-[410px] flex-col rounded-2xl border border-border bg-card shadow-2xl animate-fade-in-up overflow-hidden"
          role="region"
          aria-label="Census Sahayak AI Chat"
        >
          {/* Header */}
          <div className="tricolor-stripe w-full" />
          <div className="flex items-center justify-between border-b border-border bg-primary/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <Sparkles className="h-4 w-4 text-saffron" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-foreground">Jan Ganana Sahayak</h3>
                  {isOfflineMode ? (
                    <Badge variant="indicative" className="text-[9px] py-0 px-1">
                      <WifiOff className="h-2.5 w-2.5 mr-0.5" /> Offline
                    </Badge>
                  ) : (
                    <Badge variant="saffron" className="text-[9px] py-0 px-1">
                      Gemini 2.5
                    </Badge>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Grounded in Census Act 1948 & Official Notifications
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                title="Reset conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                aria-label="Close Sahayak chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3 text-xs"
            aria-live="polite"
          >
            {messages.map((msg) => {
              const isAsst = msg.role === "assistant";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isAsst ? "items-start" : "items-end justify-end"}`}
                >
                  {isAsst && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] rounded-2xl p-3 leading-relaxed shadow-xs ${
                      isAsst
                        ? "bg-muted/70 text-foreground border border-border"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content || "..."}</p>
                    {isAsst && msg.citations.length > 0 && (
                      <div className="mt-2 pt-1.5 border-t border-border/50 flex flex-wrap gap-1">
                        {msg.citations.map((cite, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-0.5 text-[9px] text-muted-foreground font-medium"
                          >
                            <ShieldCheck className="h-2.5 w-2.5 text-indiagreen" />
                            {cite}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {!isAsst && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-saffron text-white">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-1.5 border-t border-border bg-background/50 flex gap-1.5 overflow-x-auto no-scrollbar">
            {PRESET_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={isStreaming}
                className="shrink-0 text-[10px] rounded-full border border-border bg-card px-2.5 py-1 text-muted-foreground hover:text-primary hover:border-primary/50 transition truncate max-w-[200px]"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-border bg-card flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about phases, schedules, privacy..."
              disabled={isStreaming}
              className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm hover:bg-primary/90 disabled:opacity-40 transition"
              aria-label="Send message"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
