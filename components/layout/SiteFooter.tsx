"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { ShieldCheck, PhoneCall, ExternalLink, Lock } from "lucide-react";

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="w-full border-t border-border bg-card/60 mt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Col 1: Platform identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
                जन
              </div>
              <span className="font-bold text-base text-foreground">
                {t("app.title")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
              {t("footer.disclaimer")}
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-indiagreen-dark dark:text-indiagreen-light">
              <Lock className="h-3.5 w-3.5" />
              <span>{t("footer.privacy")}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t("footer.pillarsTitle")}
            </h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>
                <Link href="/phases" className="hover:text-primary transition">
                  {t("footer.linkPhases")}
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="hover:text-primary transition">
                  {t("footer.linkSchedule")}
                </Link>
              </li>
              <li>
                <Link href="/self-enumeration" className="hover:text-primary transition">
                  {t("footer.linkSelfEnum")}
                </Link>
              </li>
              <li>
                <Link href="/trust" className="hover:text-primary transition">
                  {t("footer.linkTrust")}
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-primary transition">
                  {t("footer.linkInsights")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Helpline */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t("footer.supportTitle")}
            </h4>
            <div className="rounded-lg border border-border bg-background p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                <PhoneCall className="h-3.5 w-3.5 text-saffron" />
                <span>{t("footer.helpline")}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {t("footer.helplineSub")}
              </p>
            </div>
            <div className="pt-1">
              <a
                href="https://censusindia.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary"
              >
                <span>{t("footer.orgiLink")}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>{t("footer.copyright")}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-indiagreen" />
              <span>{t("footer.dpdp")}</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
