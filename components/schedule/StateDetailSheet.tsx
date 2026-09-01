"use client";

import React from "react";
import { type StateSchedule } from "@/lib/types";
import { Sheet } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  Share2,
  Copy,
  ExternalLink,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";

export function StateDetailSheet({
  stateSchedule,
  onClose,
}: {
  stateSchedule: StateSchedule | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = React.useState(false);

  if (!stateSchedule) return null;

  const handleShare = () => {
    const url = `${window.location.origin}/schedule?state=${stateSchedule.code}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Sheet
      isOpen={stateSchedule !== null}
      onClose={onClose}
      title={`${stateSchedule.nameKey.replace("states.", "")} (${stateSchedule.code})`}
      description={
        stateSchedule.isUnionTerritory
          ? "Union Territory of India"
          : "State of India"
      }
    >
      <div className="space-y-6 text-xs">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <div>
            {stateSchedule.isOfficial ? (
              <Badge variant="official" className="gap-1">
                <CheckCircle2 className="h-3 w-3" /> Official Notified
              </Badge>
            ) : (
              <Badge variant="indicative" className="gap-1">
                <AlertCircle className="h-3 w-3" /> Indicative — awaiting state notification
              </Badge>
            )}
          </div>
          {stateSchedule.isSnowBound && (
            <Badge variant="saffron">Snow-Bound Area</Badge>
          )}
        </div>

        {/* Share Deep Link button */}
        <div className="flex items-center justify-between rounded-xl bg-muted/60 p-3 border border-border">
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground text-[11px]">
              Direct Jury / Citizen Deep Link
            </span>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-white font-medium hover:bg-primary/90 transition text-[11px]"
          >
            <Copy className="h-3 w-3" />
            <span>{copied ? "Copied!" : "Copy Link"}</span>
          </button>
        </div>

        {/* Timeline breakdown */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">
            Survey Schedule Windows
          </h4>

          {/* Phase 1 HLO */}
          <div className="rounded-xl border border-border bg-card p-3 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-primary">
              <Calendar className="h-3.5 w-3.5 text-saffron" />
              <span>Phase 1: House Listing Operations (HLO)</span>
            </div>
            <p className="text-foreground font-mono text-[11px] mt-0.5">
              {stateSchedule.hloStartISO
                ? `${stateSchedule.hloStartISO.slice(0, 10)} to ${stateSchedule.hloEndISO?.slice(0, 10)}`
                : "Awaiting State Gazette Notification"}
            </p>
          </div>

          {/* Digital Self-Enumeration Window */}
          <div className="rounded-xl border border-border bg-card p-3 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-indiagreen-dark dark:text-indiagreen-light">
              <Sparkles className="h-3.5 w-3.5 text-indiagreen" />
              <span>Digital Self-Enumeration Portal Window</span>
            </div>
            <p className="text-foreground font-mono text-[11px] mt-0.5">
              {stateSchedule.selfEnumOpenISO
                ? `${stateSchedule.selfEnumOpenISO.slice(0, 10)} to ${stateSchedule.selfEnumCloseISO?.slice(0, 10)}`
                : "Open 30 days prior to door-to-door enumeration"}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Citizens can pre-fill data online and generate a QR token for the field enumerator.
            </p>
          </div>

          {/* Phase 2 PE */}
          <div className="rounded-xl border border-border bg-card p-3 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-primary">
              <Clock className="h-3.5 w-3.5 text-saffron" />
              <span>Phase 2: Population Enumeration (PE)</span>
            </div>
            <p className="text-foreground font-mono text-[11px] mt-0.5">
              {stateSchedule.peStartISO.slice(0, 10)} to {stateSchedule.peEndISO.slice(0, 10)}
            </p>
            {stateSchedule.isSnowBound && (
              <p className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold mt-1">
                * Note: In snow-bound non-synchronous areas, PE takes place from 11–30 Sept 2026 with reference moment 1 Oct 2026.
              </p>
            )}
          </div>
        </div>

        {/* Nodal Officer & Field Notes */}
        {stateSchedule.notes && (
          <div className="rounded-xl bg-muted/60 p-3 border border-border space-y-1">
            <h5 className="font-bold text-[11px] uppercase text-muted-foreground">
              Operational Nodal Notes
            </h5>
            <p className="text-foreground text-[11px] leading-relaxed">
              {stateSchedule.notes}
            </p>
          </div>
        )}
      </div>
    </Sheet>
  );
}
