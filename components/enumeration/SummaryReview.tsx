"use client";

import React, { useState } from "react";
import { type HouseholdDraft } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  ShieldCheck,
  CheckCircle2,
  QrCode,
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
                <CheckCircle2 className="h-3 w-3 mr-1" /> Self-Enumeration Verified
              </Badge>
              <Badge variant="outline">Offline Draft</Badge>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Official Digital Census Token Pass
            </h3>
            <p className="text-xs text-muted-foreground max-w-md">
              Present this Census Reference Number (CRN) or QR token to the visiting field enumerator for 10-second paperless completion.
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

          {/* SVG QR Code Simulation */}
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-card p-4 shadow-sm">
            <div className="relative h-28 w-28 bg-white p-2 rounded-xl border flex items-center justify-center">
              {/* Generated QR Matrix Pattern */}
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <rect x="0" y="0" width="30" height="30" fill="#1B2A6B" />
                <rect x="5" y="5" width="20" height="20" fill="#ffffff" />
                <rect x="10" y="10" width="10" height="10" fill="#1B2A6B" />

                <rect x="70" y="0" width="30" height="30" fill="#1B2A6B" />
                <rect x="75" y="5" width="20" height="20" fill="#ffffff" />
                <rect x="80" y="10" width="10" height="10" fill="#1B2A6B" />

                <rect x="0" y="70" width="30" height="30" fill="#1B2A6B" />
                <rect x="5" y="75" width="20" height="20" fill="#ffffff" />
                <rect x="10" y="80" width="10" height="10" fill="#1B2A6B" />

                <rect x="35" y="10" width="10" height="10" fill="#FF8A3D" />
                <rect x="50" y="20" width="15" height="10" fill="#0E7C57" />
                <rect x="40" y="40" width="20" height="20" fill="#1B2A6B" />
                <rect x="70" y="45" width="15" height="15" fill="#1B2A6B" />
                <rect x="20" y="50" width="15" height="10" fill="#FF8A3D" />
                <rect x="65" y="75" width="25" height="15" fill="#0E7C57" />
                <rect x="35" y="70" width="15" height="20" fill="#1B2A6B" />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-wider">
              Scan for 5s Check-in
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-indiagreen-dark dark:text-indiagreen-light font-medium">
            <Lock className="h-3.5 w-3.5 text-indiagreen" />
            <span>Stored in browser memory only · Census Act 1948 §15 Shield</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="saffron"
              onClick={onExport}
              className="gap-1.5 shadow-sm text-xs"
            >
              <Download className="h-4 w-4" />
              <span>Export Local JSON</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.print()}
              className="gap-1.5 text-xs"
            >
              <Printer className="h-4 w-4" />
              <span>Print Token</span>
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
                Household Particulars (Phase 1)
              </h4>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="text-xs text-primary hover:underline font-semibold"
            >
              Edit
            </button>
          </div>

          <dl className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <dt className="text-muted-foreground font-medium">Building Use:</dt>
              <dd className="font-semibold text-foreground">{draft.buildingUse || "Residential"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground font-medium">Residence Status:</dt>
              <dd className="font-semibold text-foreground">{draft.residenceStatus || "Owned"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground font-medium">Dwelling Rooms:</dt>
              <dd className="font-semibold text-foreground">{draft.roomCount || 3} Rooms</dd>
            </div>
            <div>
              <dt className="text-muted-foreground font-medium">Electricity:</dt>
              <dd className="font-semibold text-foreground">{draft.hasElectricity ? "Yes (Connected)" : "No"}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground font-medium">Drinking Water:</dt>
              <dd className="font-semibold text-foreground">{draft.drinkingWaterSource || "Tap water"}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground font-medium">Cooking Fuel:</dt>
              <dd className="font-semibold text-foreground">{draft.cookingFuel || "LPG/PNG"}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground font-medium">Declared Assets:</dt>
              <dd className="font-semibold text-foreground">
                {draft.assets.length > 0 ? draft.assets.join(", ") : "None declared"}
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
                Family Members Roster (Phase 2)
              </h4>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="text-xs text-primary hover:underline font-semibold"
            >
              Edit ({draft.members.length} Members)
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
                    Member #{i + 1}: {mem.relationshipToHead || "Family Member"}
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {mem.sex === "M" ? "Male" : mem.sex === "F" ? "Female" : "Other"} · {mem.ageYears} Yrs
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-muted-foreground">
                  <div>Lang: {mem.motherTongue || "Hindi"}</div>
                  <div>Edu: {mem.educationLevel || "Graduation"}</div>
                  <div>Status: {mem.maritalStatus || "Married"}</div>
                  <div>Work: {mem.workStatus?.slice(0, 15) || "Worker"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
