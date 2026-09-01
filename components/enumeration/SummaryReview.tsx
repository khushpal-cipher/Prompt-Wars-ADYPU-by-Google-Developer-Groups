"use client";

import React, { useState } from "react";
import { type HouseholdDraft } from "@/lib/types";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TokenQR } from "@/components/enumeration/TokenQR";
import {
  Download,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  Home,
  Users,
  Lock,
} from "lucide-react";

interface SummaryReviewProps {
  draft: HouseholdDraft;
  onExport: () => void;
  onEditStep: (step: number) => void;
}

export function SummaryReview({
  draft,
  onExport,
  onEditStep,
}: SummaryReviewProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const crn = `CRN-2027-${Math.abs(
    draft.members.length * 1337 + (draft.roomCount || 1) * 42
  )
    .toString(36)
    .toUpperCase()
    .padStart(6, "X")}-IND`;

  const copyCRN = () => {
    navigator.clipboard.writeText(crn).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Official Digital Census Pass Banner */}
      <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-card via-background to-primary/5 p-6 shadow-md">
        <div className="tricolor-stripe w-full rounded-full mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Badge variant="official">
                <CheckCircle2 className="h-3 w-3 mr-1" /> {t("summary.verifiedBadge")}
              </Badge>
              <Badge variant="outline">{t("summary.offlineBadge")}</Badge>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              {t("summary.passTitle")}
            </h3>
            <p className="text-xs text-muted-foreground max-w-md">
              {t("summary.passSubtitle")}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
              <span className="font-mono text-base sm:text-lg font-black text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">
                {crn}
              </span>
              <button
                type="button"
                onClick={copyCRN}
                className="rounded-lg border border-border bg-card p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition"
                title="Copy CRN"
              >
                {copied ? <Check className="h-4 w-4 text-indiagreen" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Reference token, encoded as a scannable QR on-device */}
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-card p-4 shadow-sm">
            <TokenQR value={crn} label={`${t("summary.scanToken")}: ${crn}`} />
            <span className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-wider">
              {t("summary.scanToken")}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-indiagreen-dark dark:text-indiagreen-light font-medium">
            <Lock className="h-3.5 w-3.5 text-indiagreen" />
            <span>{t("summary.privacyNotice")}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="saffron"
              onClick={onExport}
              className="gap-1.5 shadow-sm text-xs"
            >
              <Download className="h-4 w-4" />
              <span>{t("summary.exportBtn")}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.print()}
              className="gap-1.5 text-xs"
            >
              <Printer className="h-4 w-4" />
              <span>{t("summary.printBtn")}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Household & Family Summary Details */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Household particulars */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-primary" />
              <h4 className="font-bold text-sm text-foreground">
                {t("summary.householdTitle")}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="text-xs text-primary hover:underline font-semibold"
            >
              {t("summary.edit")}
            </button>
          </div>

          <dl className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <dt className="text-muted-foreground font-medium">{t("summary.buildingUse")}</dt>
              <dd className="font-semibold text-foreground">{draft.buildingUse || "Residential"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground font-medium">{t("summary.residenceStatus")}</dt>
              <dd className="font-semibold text-foreground">{draft.residenceStatus || "Owned"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground font-medium">{t("summary.dwellingRooms")}</dt>
              <dd className="font-semibold text-foreground">{t("summary.roomsCount", { count: draft.roomCount || 3 })}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground font-medium">{t("summary.electricity")}</dt>
              <dd className="font-semibold text-foreground">{draft.hasElectricity ? t("summary.connected") : t("summary.notConnected")}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground font-medium">{t("summary.water")}</dt>
              <dd className="font-semibold text-foreground">{draft.drinkingWaterSource || "Tap water"}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground font-medium">{t("summary.fuel")}</dt>
              <dd className="font-semibold text-foreground">{draft.cookingFuel || "LPG/PNG"}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground font-medium">{t("summary.assets")}</dt>
              <dd className="font-semibold text-foreground">
                {draft.assets.length > 0 ? draft.assets.join(", ") : t("summary.noAssets")}
              </dd>
            </div>
          </dl>
        </div>

        {/* Family Roster Particulars */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-saffron" />
              <h4 className="font-bold text-sm text-foreground">
                {t("summary.familyTitle")}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="text-xs text-primary hover:underline font-semibold"
            >
              {t("summary.membersCount", { count: draft.members.length })}
            </button>
          </div>

          <div className="space-y-3">
            {draft.members.map((mem, i) => (
              <div
                key={mem.localId}
                className="rounded-xl bg-muted/60 p-3 text-xs space-y-1 border border-border/60"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">
                    {t("wizard.step4.member", { index: i + 1 })}: {mem.relationshipToHead || "Family Member"}
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {mem.sex === "M" ? t("summary.maleShort") : mem.sex === "F" ? t("summary.femaleShort") : t("summary.otherShort")} · {t("summary.yrs", { age: mem.ageYears ?? 0 })}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-muted-foreground">
                  <div>{t("summary.lang")} {mem.motherTongue || "Hindi"}</div>
                  <div>{t("summary.edu")} {mem.educationLevel || "Graduation"}</div>
                  <div>{t("summary.status")} {mem.maritalStatus || "Married"}</div>
                  <div>{t("summary.work")} {mem.workStatus?.slice(0, 15) || "Worker"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
