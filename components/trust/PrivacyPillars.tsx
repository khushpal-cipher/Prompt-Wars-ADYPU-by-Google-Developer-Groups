"use client";

import React from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import {
  FileText,
  Scale,
  EyeOff,
  ServerOff,
  AlertOctagon,
} from "lucide-react";

export function PrivacyPillars() {
  const { t } = useI18n();

  const pillars = [
    {
      title: t("trust.pillars.sec15Title"),
      desc: t("trust.pillars.sec15Desc"),
      icon: Scale,
      badge: t("trust.pillars.sec15Badge"),
    },
    {
      title: t("trust.pillars.firewallTitle"),
      desc: t("trust.pillars.firewallDesc"),
      icon: EyeOff,
      badge: t("trust.pillars.firewallBadge"),
    },
    {
      title: t("trust.pillars.penalTitle"),
      desc: t("trust.pillars.penalDesc"),
      icon: AlertOctagon,
      badge: t("trust.pillars.penalBadge"),
    },
    {
      title: t("trust.pillars.zeroServerTitle"),
      desc: t("trust.pillars.zeroServerDesc"),
      icon: ServerOff,
      badge: t("trust.pillars.zeroServerBadge"),
    },
  ];

  return (
    <div className="space-y-8">
      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {pillars.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-3 transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                  {item.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-foreground">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Statutory Legal Citation Box */}
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 space-y-3">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <FileText className="h-4 w-4 text-saffron" />
          <span>{t("trust.pillars.statuteTitle")}</span>
        </div>
        <blockquote className="rounded-xl border-l-4 border-primary bg-card/90 p-4 font-serif text-xs italic text-foreground leading-relaxed shadow-xs">
          {t("trust.pillars.statuteQuote")}
        </blockquote>
        <p className="text-[11px] text-muted-foreground text-right font-mono">
          {t("trust.pillars.statuteCitation")}
        </p>
      </div>
    </div>
  );
}
