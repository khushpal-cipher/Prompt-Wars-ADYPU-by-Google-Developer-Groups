import React from "react";
import { EnumerationWizard } from "@/components/enumeration/EnumerationWizard";
import { UserCheck, ShieldCheck, Lock, Sparkles, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Digital Self-Enumeration Portal · Census 2027",
  description:
    "Complete your official Census 2027 self-enumeration draft in 5 simple steps. Local zero-knowledge privacy guarantee under Census Act 1948 Section 15.",
};

export default function SelfEnumerationPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 space-y-8">
      {/* Header */}
      <div className="border-b border-border/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indiagreen-dark dark:text-indiagreen-light mb-2">
          <UserCheck className="h-4 w-4 text-indiagreen" />
          <span>Paperless Citizen Self-Enumeration</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
            Digital Self-Enumeration Simulator
          </h1>
          <Badge variant="official" className="w-fit">
            <Lock className="h-3 w-3 mr-1" /> Zero Server Storage
          </Badge>
        </div>
        <p className="mt-2 max-w-3xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Pre-fill your household and family roster in 5 structured steps. Once completed, your draft generates a verifiable Census Reference Pass & QR token that you can present to visiting enumerators for instant verification.
        </p>
      </div>

      {/* Privacy Banner */}
      <div className="rounded-2xl border border-indiagreen/30 bg-indiagreen/5 p-4 flex items-start gap-3 shadow-xs">
        <ShieldCheck className="h-5 w-5 text-indiagreen shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h4 className="font-bold text-foreground">
            Architectural Privacy Assurance · Section 15, Census Act 1948
          </h4>
          <p className="text-muted-foreground leading-relaxed">
            All entered information is processed and retained exclusively inside your device&apos;s browser memory (`localStorage`). No personal details, bank information, or sensitive identifiers are ever transmitted to any remote cloud database.
          </p>
        </div>
      </div>

      {/* 5-Step Wizard Container */}
      <EnumerationWizard />
    </div>
  );
}
