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
              <span>Section 15, Census Act 1948 · Zero Server Storage Guarantee</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Official Pillars
            </h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>
                <Link href="/phases" className="hover:text-primary transition">
                  Phase 1 (HLO) & Phase 2 (PE)
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="hover:text-primary transition">
                  State Survey Schedule & Ladakh Window
                </Link>
              </li>
              <li>
                <Link href="/self-enumeration" className="hover:text-primary transition">
                  Self-Enumeration Portal Simulator
                </Link>
              </li>
              <li>
                <Link href="/trust" className="hover:text-primary transition">
                  Privacy Immunity & Fake News Buster
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-primary transition">
                  Demographic Time-Series Visualizer
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Helpline */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Citizen Support & Legal
            </h4>
            <div className="rounded-lg border border-border bg-background p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                <PhoneCall className="h-3.5 w-3.5 text-saffron" />
                <span>{t("footer.helpline")}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Toll-free 24x7 IVR in all 22 official languages
              </p>
            </div>
            <div className="pt-1">
              <a
                href="https://censusindia.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary"
              >
                <span>Office of the Registrar General of India (ORGI)</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2027 Government of India · Ministry of Home Affairs · Office of the Registrar General & Census Commissioner</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-indiagreen" />
              <span>DPDP Act 2023 Compliant</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
