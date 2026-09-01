"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { HeroCountdown } from "@/components/home/HeroCountdown";
import { Button } from "@/components/ui/button";
import {
  FileSpreadsheet,
  Calendar,
  UserCheck,
  ShieldCheck,
  BarChart3,
  ArrowRight,
  Sparkles,
  Lock,
  Smartphone,
  Globe2,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  const { t } = useI18n();

  const pillars = [
    {
      href: "/phases",
      titleKey: "pillars.phases.title",
      descKey: "pillars.phases.desc",
      badgeKey: "pillars.phases.badge",
      icon: FileSpreadsheet,
      color: "border-primary/20 hover:border-primary/50",
    },
    {
      href: "/schedule",
      titleKey: "pillars.schedule.title",
      descKey: "pillars.schedule.desc",
      badgeKey: "pillars.schedule.badge",
      icon: Calendar,
      color: "border-saffron/20 hover:border-saffron/50",
    },
    {
      href: "/self-enumeration",
      titleKey: "pillars.selfEnum.title",
      descKey: "pillars.selfEnum.desc",
      badgeKey: "pillars.selfEnum.badge",
      icon: UserCheck,
      color: "border-indiagreen/20 hover:border-indiagreen/50",
    },
    {
      href: "/trust",
      titleKey: "pillars.trust.title",
      descKey: "pillars.trust.desc",
      badgeKey: "pillars.trust.badge",
      icon: ShieldCheck,
      color: "border-primary/20 hover:border-primary/50",
    },
    {
      href: "/insights",
      titleKey: "pillars.insights.title",
      descKey: "pillars.insights.desc",
      badgeKey: "pillars.insights.badge",
      icon: BarChart3,
      color: "border-indigo-deep/20 hover:border-indigo-deep/50",
    },
  ];

  const highlights = [
    {
      titleKey: "highlights.digital.title",
      descKey: "highlights.digital.desc",
      icon: Smartphone,
    },
    {
      titleKey: "highlights.privacy.title",
      descKey: "highlights.privacy.desc",
      icon: Lock,
    },
    {
      titleKey: "highlights.languages.title",
      descKey: "highlights.languages.desc",
      icon: Globe2,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-6 animate-fade-in-up">
              <Sparkles className="h-3.5 w-3.5 text-saffron" />
              <span>{t("hero.topBadge")}</span>
            </div>

            {/* Headline */}
            <h1 className="max-w-4xl text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
              {t("hero.titlePrefix")}{" "}
              <span className="text-primary underline decoration-saffron decoration-4 underline-offset-4">
                {t("hero.titleSuffix")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t("hero.description")}
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link href="/self-enumeration">
                <Button size="lg" variant="saffron" className="gap-2 shadow-lg">
                  <UserCheck className="h-5 w-5" />
                  <span>{t("hero.cta.start")}</span>
                </Button>
              </Link>
              <Link href="/schedule">
                <Button size="lg" variant="default" className="gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{t("hero.cta.schedule")}</span>
                </Button>
              </Link>
              <Link href="/trust">
                <Button size="lg" variant="outline" className="gap-2">
                  <ShieldCheck className="h-5 w-5 text-indiagreen" />
                  <span>{t("hero.cta.trust")}</span>
                </Button>
              </Link>
            </div>

            {/* Live Countdown Component */}
            <div className="mt-12 w-full flex justify-center">
              <HeroCountdown />
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Highlights Banner */}
      <section className="border-y border-border/80 bg-card/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-4 rounded-xl border border-border/60 bg-card p-4 shadow-xs"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">
                      {t(item.titleKey)}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-normal">
                      {t(item.descKey)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5 Core Pillars Section */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {t("pillars.sectionTitle")}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
              {t("pillars.sectionSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <Link
                  key={idx}
                  href={pillar.href}
                  className={`group relative flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${pillar.color}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                        {t(pillar.badgeKey)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {t(pillar.titleKey)}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {t(pillar.descKey)}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                    <span>{t("pillars.explorePillar")}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              );
            })}

            {/* 6th Card: Sahayak AI Quick Access */}
            <div className="relative flex flex-col justify-between rounded-2xl border border-saffron/30 bg-gradient-to-br from-saffron/5 via-card to-card p-6 shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-saffron text-white shadow-sm">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-saffron/15 px-2.5 py-0.5 text-[11px] font-bold text-saffron-dark">
                    {t("pillars.sahayak.badge")}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {t("pillars.sahayak.title")}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {t("pillars.sahayak.desc")}
                </p>
              </div>
              <div className="mt-6">
                <div className="flex items-center gap-1.5 text-xs text-indiagreen-dark font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indiagreen" />
                  <span>{t("pillars.sahayak.available")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
