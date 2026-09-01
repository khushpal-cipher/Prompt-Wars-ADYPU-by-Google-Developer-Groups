import React, { Suspense } from "react";
import { STATE_SCHEDULES } from "@/lib/data/states";
import { StateScheduleTable } from "@/components/schedule/StateScheduleTable";
import { Calendar, Snowflake, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "State Schedule & Dates · Census 2027",
  description:
    "Official survey dates, self-enumeration windows, and snow-bound zone timelines for all 28 States and 8 Union Territories in India.",
};

export default function SchedulePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 space-y-10">
      {/* Page Header */}
      <div className="border-b border-border/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-dark mb-2">
          <Calendar className="h-4 w-4 text-saffron" />
          <span>National Operational Calendar</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
          State-Wise Census Schedule & Timelines
        </h1>
        <p className="mt-2 max-w-3xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Census operations across India follow coordinated regional survey windows. Citizens in every state can self-enumerate online prior to the door-to-door enumeration visit.
        </p>
      </div>

      {/* Snow-Bound Region Advisory */}
      <div className="rounded-2xl border border-saffron/30 bg-saffron/5 p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-saffron text-white">
          <Snowflake className="h-5 w-5" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-foreground sm:text-sm">
            Special Snow-Bound Zone Notice (Ladakh, higher HP, UK & J&K)
          </h4>
          <p className="text-muted-foreground leading-relaxed">
            In non-synchronous high-altitude regions subject to extreme winter snowfall, Population Enumeration (PE) is conducted earlier from{" "}
            <span className="font-bold text-foreground">11 – 30 September 2026</span> with an official Reference Moment of{" "}
            <span className="font-bold text-foreground">00:00 hrs, 1 October 2026</span>.
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
