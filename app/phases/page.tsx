"use client";

import React from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { PHASE_DEFINITIONS, HLO_FIELDS, PE_FIELDS } from "@/lib/data/phases";
import { PhaseTimeline } from "@/components/phases/PhaseTimeline";
import { FieldChecklist } from "@/components/phases/FieldChecklist";
import { FileSpreadsheet } from "lucide-react";

export default function PhasesPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 space-y-12">
      {/* Header */}
      <div className="border-b border-border/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-dark mb-2">
          <FileSpreadsheet className="h-4 w-4 text-saffron" />
          <span>{t("phases.page.badge")}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
          {t("phases.page.title")}
        </h1>
        <p className="mt-2 max-w-3xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {t("phases.page.description")}
        </p>
      </div>

      {/* Section 1: Timeline breakdown */}
      <section className="space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            {t("phases.timeline.title")}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("phases.timeline.subtitle")}
          </p>
        </div>
        <PhaseTimeline phases={PHASE_DEFINITIONS} />
      </section>

      {/* Section 2: Collected Fields Differential Checklist */}
      <section className="space-y-6 pt-6 border-t border-border">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            {t("phases.checklist.title")}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("phases.checklist.subtitle")}
          </p>
        </div>
        <FieldChecklist hloFields={HLO_FIELDS} peFields={PE_FIELDS} />
      </section>
    </div>
  );
}
