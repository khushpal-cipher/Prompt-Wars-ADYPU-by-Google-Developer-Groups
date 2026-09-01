"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Clock } from "lucide-react";

// Official Reference Moment: 00:00 hrs, 1 March 2027 IST (UTC+05:30)
const TARGET_TIMESTAMP = new Date("2027-03-01T00:00:00+05:30").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const difference = TARGET_TIMESTAMP - Date.now();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function HeroCountdown() {
  const { t } = useI18n();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { labelKey: "countdown.days", value: timeLeft.days },
    { labelKey: "countdown.hours", value: timeLeft.hours },
    { labelKey: "countdown.minutes", value: timeLeft.minutes },
    { labelKey: "countdown.seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-border/80 bg-card/80 p-5 shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-saffron/15 text-saffron-dark">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t("countdown.title")}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {t("countdown.subtitle")}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-indiagreen/10 px-2.5 py-0.5 text-[10px] font-semibold text-indiagreen-dark dark:text-indiagreen-light border border-indiagreen/20">
          Notified in Gazette
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
        {timeUnits.map((unit, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center rounded-xl bg-background/80 p-2 sm:p-3 border border-border/60 shadow-xs"
          >
            <span className="font-mono text-2xl sm:text-3xl font-black text-primary tracking-tight">
              {isClient ? String(unit.value).padStart(2, "0") : "--"}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase mt-0.5">
              {t(unit.labelKey)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
