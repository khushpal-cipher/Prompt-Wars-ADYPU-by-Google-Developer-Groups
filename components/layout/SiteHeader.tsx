"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  ShieldCheck,
  FileSpreadsheet,
  Calendar,
  UserCheck,
  BarChart3,
  Home,
} from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", labelKey: "nav.home", icon: Home },
    { href: "/phases", labelKey: "nav.phases", icon: FileSpreadsheet },
    { href: "/schedule", labelKey: "nav.schedule", icon: Calendar },
    { href: "/self-enumeration", labelKey: "nav.selfEnumeration", icon: UserCheck },
    { href: "/trust", labelKey: "nav.trust", icon: ShieldCheck },
    { href: "/insights", labelKey: "nav.insights", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-card/90 backdrop-blur-md shadow-xs">
      <div className="tricolor-stripe w-full" />
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Emblem */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md transition-transform group-hover:scale-105">
            <span className="font-serif font-black text-lg text-saffron-light">जन</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-foreground sm:text-lg">
                {t("app.title")}
              </span>
              <span className="rounded-sm bg-saffron/15 px-1.5 py-0.2 text-[10px] font-bold text-saffron-dark uppercase tracking-wider">
                Digital
              </span>
            </div>
            <p className="hidden text-[11px] text-muted-foreground sm:block">
              {t("app.subtitle")}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Action & Language */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-card p-4 lg:hidden animate-fade-in-up">
          <div className="flex flex-col space-y-2">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{t(item.labelKey)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
