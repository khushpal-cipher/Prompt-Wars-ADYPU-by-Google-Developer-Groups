"use client";

import React from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { PrivacyPillars } from "@/components/trust/PrivacyPillars";
import { MythBuster } from "@/components/trust/MythBuster";
import { ImpostorChecklist } from "@/components/trust/ImpostorChecklist";
import { ShieldCheck, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TrustPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 space-y-12">
      {/* Page Header */}
      <div className="border-b border-border/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
          <ShieldCheck className="h-4 w-4 text-indiagreen" />
          <span>{t("trust.page.badge")}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
            {t("trust.page.title")}
          </h1>
          <Badge variant="official" className="w-fit">
            <Lock className="h-3 w-3 mr-1" /> Census Act 1948 §15
          </Badge>
        </div>
        <p className="mt-2 max-w-3xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {t("trust.page.description")}
        </p>
      </div>

      {/* Section 1: Legal Privacy Pillars */}
      <section className="space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            {t("trust.pillars.sectionTitle")}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("trust.pillars.sectionSubtitle")}
          </p>
        </div>
        <PrivacyPillars />
      </section>

      {/* Section 2: AI Myth & Fake News Buster */}
      <section className="space-y-6 pt-6 border-t border-border">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            {t("trust.myth.sectionTitle")}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("trust.myth.sectionSubtitle")}
          </p>
        </div>
        <MythBuster />
      </section>

      {/* Section 3: Impostor & Field Verification */}
      <section className="space-y-6 pt-6 border-t border-border">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            {t("trust.impostor.sectionTitle")}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("trust.impostor.sectionSubtitle")}
          </p>
        </div>
        <ImpostorChecklist />
      </section>
    </div>
  );
}
