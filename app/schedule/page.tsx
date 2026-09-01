"use client";

import React, { Suspense } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { STATE_SCHEDULES } from "@/lib/data/states";
import { StateScheduleTable } from "@/components/schedule/StateScheduleTable";
import { Calendar, Snowflake } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SchedulePage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 space-y-10">
      {/* Page Header */}
      <div className="border-b border-border/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-dark mb-2">
          <Calendar className="h-4 w-4 text-saffron" />
          <span>{t("schedule.page.badge")}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
          {t("schedule.page.title")}
        </h1>
        <p className="mt-2 max-w-3xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {t("schedule.page.description")}
        </p>
      </div>

      {/* Snow-Bound Region Advisory */}
      <div className="rounded-2xl border border-saffron/30 bg-saffron/5 p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-saffron text-white">
          <Snowflake className="h-5 w-5" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-foreground sm:text-sm">
            {t("schedule.snowNotice.title")}
          </h4>
          <p className="text-muted-foreground leading-relaxed">
            {t("schedule.snowNotice.body")}
          </p>
        </div>
      </div>

      {/* Main Schedule Table with Suspense for SearchParams */}
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
        <StateScheduleTable schedules={STATE_SCHEDULES} />
      </Suspense>
    </div>
  );
}
