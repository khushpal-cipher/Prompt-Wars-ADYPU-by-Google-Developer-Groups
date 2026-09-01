import React from "react";
import { PrivacyPillars } from "@/components/trust/PrivacyPillars";
import { MythBuster } from "@/components/trust/MythBuster";
import { ImpostorChecklist } from "@/components/trust/ImpostorChecklist";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Privacy, Legal Safeguards & Rumor Buster · Census 2027",
  description:
    "Statutory legal privilege under Section 15 of Census Act 1948, AI-powered rumor buster, and field enumerator verification guidelines for India's 2027 Digital Census.",
};

export default function TrustPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 space-y-12">
      {/* Page Header */}
      <div className="border-b border-border/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
          <ShieldCheck className="h-4 w-4 text-indiagreen" />
          <span>Statutory Protection & Anti-Misinformation</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
            Data Privacy, Legal Immunity & Misinformation Shield
          </h1>
          <Badge variant="official" className="w-fit">
            <Lock className="h-3 w-3 mr-1" /> Census Act 1948 §15
          </Badge>
        </div>
        <p className="mt-2 max-w-3xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Census 2027 operates under the most stringent statutory privacy protections in Indian law. Learn about your constitutional rights, test viral claims with our AI fact-checker, and verify genuine field enumerators.
        </p>
      </div>

      {/* Section 1: Legal Privacy Pillars */}
      <section className="space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Legal Privilege & Architectural Safeguards
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            How Section 15 of the Census Act, 1948 bars courts, police, and commercial entities from accessing your data.
          </p>
        </div>
        <PrivacyPillars />
      </section>

      {/* Section 2: AI Myth & Fake News Buster */}
      <section className="space-y-6 pt-6 border-t border-border">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            AI Census Rumor & Misinformation Classifier
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Test any social media claim or WhatsApp forward against official Gazette of India notifications.
          </p>
        </div>
        <MythBuster />
      </section>

      {/* Section 3: Impostor & Field Verification */}
      <section className="space-y-6 pt-6 border-t border-border">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Field Enumerator Identity Verification
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verify official badges and avoid fraudulent impostors during the door-to-door enumeration phase.
          </p>
        </div>
        <ImpostorChecklist />
      </section>
    </div>
  );
}
