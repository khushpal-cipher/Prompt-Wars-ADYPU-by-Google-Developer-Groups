import React from "react";
import { PHASE_DEFINITIONS, HLO_FIELDS, PE_FIELDS } from "@/lib/data/phases";
import { PhaseTimeline } from "@/components/phases/PhaseTimeline";
import { FieldChecklist } from "@/components/phases/FieldChecklist";
import { FileSpreadsheet, ShieldCheck, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Two-Phase Architecture · Census 2027",
  description:
    "Explore the two phases of Census 2027: House Listing Operations (HLO) and Population Enumeration (PE), including complete collected fields and caste enumeration details.",
};

export default function PhasesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 space-y-12">
      {/* Header */}
      <div className="border-b border-border/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-dark mb-2">
          <FileSpreadsheet className="h-4 w-4 text-saffron" />
          <span>Operational Architecture & Questionnaires</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
          Census 2027: Two-Phase National Architecture
        </h1>
        <p className="mt-2 max-w-3xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
          The 16th National Census is partitioned into two distinct operational phases. Phase 1 establishes the baseline spatial dwelling structure and household amenities, while Phase 2 captures detailed socio-economic, demographic, and caste particulars for every resident in India.
        </p>
      </div>

      {/* Section 1: Timeline breakdown */}
      <section className="space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Phase Progression & Reference Moments
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Operational calendar formally notified in the Gazette of India.
          </p>
        </div>
        <PhaseTimeline phases={PHASE_DEFINITIONS} />
      </section>

      {/* Section 2: Collected Fields Differential Checklist */}
      <section className="space-y-6 pt-6 border-t border-border">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Interactive Collected Fields Directory
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Search and inspect all collected fields across HLO and PE. Click any field to inspect plain-language meaning and policy purpose.
          </p>
        </div>
        <FieldChecklist hloFields={HLO_FIELDS} peFields={PE_FIELDS} />
      </section>
    </div>
  );
}
