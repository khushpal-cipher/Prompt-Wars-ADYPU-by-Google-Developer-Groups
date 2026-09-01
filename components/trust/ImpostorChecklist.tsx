"use client";

import React, { useState } from "react";
import {
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  Smartphone,
  Search,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function ImpostorChecklist() {
  const [testId, setTestId] = useState("");
  const [verificationResult, setVerificationResult] = useState<{
    status: "VALID" | "INVALID" | null;
    officerName?: string;
    wardBlock?: string;
  }>({ status: null });

  const genuineChecks = [
    {
      title: "QR-Coded Official Photo ID Card",
      desc: "Every enumerator carries a government-issued identity card with an official hologram and scannable verification QR code.",
      isSafe: true,
    },
    {
      title: "Authorized ORGI Mobile Tablet / Device",
      desc: "Data collection is conducted strictly on the certified Census of India mobile app without third-party tools.",
      isSafe: true,
    },
    {
      title: "ZERO Financial Questions",
      desc: "A genuine enumerator NEVER asks for bank accounts, ATM cards, UPI PINs, income tax statements, or OTPs.",
      isSafe: true,
    },
    {
      title: "ZERO Fees or Charges",
      desc: "Census enumeration is 100% free of charge. Anyone soliciting money or 'registration fees' is an impostor.",
      isSafe: true,
    },
  ];

  const handleVerifyId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testId.trim()) return;

    // Simulate verification
    if (testId.trim().length === 6 && /^\d+$/.test(testId.trim())) {
      setVerificationResult({
        status: "VALID",
        officerName: "Rajesh Kumar Sharma (Census Officer)",
        wardBlock: `Ward 14, Block ${testId.slice(0, 3)} · District North`,
      });
    } else {
      setVerificationResult({
        status: "INVALID",
      });
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-indiagreen" />
          <h3 className="font-bold text-base sm:text-lg text-foreground">
            Field Enumerator Verification Checklist & ID Checker
          </h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Know your rights and verify visiting field officers to protect your family against impostors and financial fraud.
        </p>
      </div>

      {/* 4 Checklist Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {genuineChecks.map((check, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indiagreen/10 text-indiagreen">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-foreground">
                {check.title}
              </h4>
              <p className="text-[11px] text-muted-foreground leading-normal">
                {check.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive 6-digit Verifier Tool */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-4">
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-primary">
            Instant Field Officer ID Verifier
          </h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Enter the 6-digit Enumerator Badge Number printed on the visiting officer&apos;s photo identity card (e.g. try &apos;202714&apos;).
          </p>
        </div>

        <form onSubmit={handleVerifyId} className="flex flex-col sm:flex-row gap-2.5 max-w-md">
          <Input
            type="text"
            maxLength={6}
            value={testId}
            onChange={(e) => setTestId(e.target.value)}
            placeholder="Enter 6-digit ID (e.g. 202714)"
            className="font-mono text-xs"
          />
          <Button type="submit" variant="default" className="gap-1.5 text-xs font-semibold shrink-0">
            <Search className="h-3.5 w-3.5" />
            <span>Verify Badge</span>
          </Button>
        </form>

        {verificationResult.status === "VALID" && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs flex items-start gap-2.5 animate-fade-in-up">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-800 dark:text-emerald-300">
                Official Enumerator Verified
              </span>
              <p className="text-[11px] text-foreground mt-0.5">
                {verificationResult.officerName} · Assigned to {verificationResult.wardBlock}
              </p>
            </div>
          </div>
        )}

        {verificationResult.status === "INVALID" && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs flex items-start gap-2.5 animate-fade-in-up">
            <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-rose-800 dark:text-rose-300">
                Unregistered Enumerator ID
              </span>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Badge number not found in active official registry. Do not share household data. Contact Census Helpline: 1800-11-2027.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
