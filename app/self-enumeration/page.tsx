"use client";

import React from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { EnumerationWizard } from "@/components/enumeration/EnumerationWizard";
import { UserCheck, ShieldCheck, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SelfEnumerationPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 space-y-8">
      {/* Header */}
      <div className="border-b border-border/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indiagreen-dark dark:text-indiagreen-light mb-2">
          <UserCheck className="h-4 w-4 text-indiagreen" />
          <span>{t("wizard.page.badge")}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
            {t("wizard.page.title")}
          </h1>
          <Badge variant="official" className="w-fit">
            <Lock className="h-3 w-3 mr-1" /> {t("wizard.page.zeroServerBadge")}
          </Badge>
        </div>
        <p className="mt-2 max-w-3xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {t("wizard.page.description")}
        </p>
      </div>

      {/* Privacy Banner */}
      <div className="rounded-2xl border border-indiagreen/30 bg-indiagreen/5 p-4 flex items-start gap-3 shadow-xs">
        <ShieldCheck className="h-5 w-5 text-indiagreen shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h4 className="font-bold text-foreground">
            {t("wizard.privacyBanner.title")}
          </h4>
          <p className="text-muted-foreground leading-relaxed">
            {t("wizard.privacyBanner.desc")}
          </p>
        </div>
      </div>

      {/* 5-Step Wizard Container */}
      <EnumerationWizard />
    </div>
  );
}
