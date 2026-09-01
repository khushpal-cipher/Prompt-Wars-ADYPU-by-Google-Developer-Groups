"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { type StateSchedule } from "@/lib/types";
import { getStateByCode } from "@/lib/data/states";
import { StateDetailSheet } from "./StateDetailSheet";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
  Calendar,
  ExternalLink,
  Snowflake,
  Filter,
} from "lucide-react";

export function StateScheduleTable({
  schedules,
}: {
  schedules: readonly StateSchedule[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<"ALL" | "SNOW" | "UT">("ALL");
  const [sortField, setSortField] = useState<"name" | "hlo" | "pe">("name");
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [selectedState, setSelectedState] = useState<StateSchedule | null>(null);

  // Sync initial state from URL query parameter ?state=XX
  useEffect(() => {
    const stateParam = searchParams.get("state");
    if (stateParam) {
      const match = getStateByCode(stateParam);
      if (match) {
        setSelectedState(match);
      }
    }
  }, [searchParams]);

  const handleSelectState = useCallback(
    (item: StateSchedule) => {
      setSelectedState(item);
      const params = new URLSearchParams(window.location.search);
      params.set("state", item.code);
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  const handleCloseSheet = useCallback(() => {
    setSelectedState(null);
    const params = new URLSearchParams(window.location.search);
    params.delete("state");
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router]);

  const filteredData = useMemo(() => {
    return schedules
      .filter((item) => {
        if (filterType === "SNOW" && !item.isSnowBound) return false;
        if (filterType === "UT" && !item.isUnionTerritory) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCode = item.code.toLowerCase().includes(q);
          const matchName = item.nameKey.toLowerCase().includes(q);
          const matchNotes = item.notes?.toLowerCase().includes(q);
          if (!matchCode && !matchName && !matchNotes) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === "name") {
          cmp = a.code.localeCompare(b.code);
        } else if (sortField === "hlo") {
          cmp = (a.hloStartISO || "").localeCompare(b.hloStartISO || "");
        } else if (sortField === "pe") {
          cmp = a.peStartISO.localeCompare(b.peStartISO);
        }
        return sortAsc ? cmp : -cmp;
      });
  }, [schedules, filterType, searchQuery, sortField, sortAsc]);

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search state, UT, or code (e.g. MH, Ladakh, Delhi)..."
            className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-1.5 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setFilterType("ALL")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filterType === "ALL"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            All 36 Regions
          </button>
          <button
            onClick={() => setFilterType("SNOW")}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filterType === "SNOW"
                ? "bg-saffron text-white shadow-xs"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Snowflake className="h-3 w-3" />
            <span>Snow-Bound</span>
          </button>
          <button
            onClick={() => setFilterType("UT")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filterType === "UT"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Union Territories
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-muted/60 text-muted-foreground font-bold">
            <tr>
              <th
                onClick={() => {
                  if (sortField === "name") setSortAsc(!sortAsc);
                  else {
                    setSortField("name");
                    setSortAsc(true);
                  }
                }}
                className="cursor-pointer py-3.5 px-4 hover:text-foreground"
              >
                <div className="flex items-center gap-1">
                  <span>State / UT</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => {
                  if (sortField === "hlo") setSortAsc(!sortAsc);
                  else {
                    setSortField("hlo");
                    setSortAsc(true);
                  }
                }}
                className="cursor-pointer py-3.5 px-4 hover:text-foreground"
              >
                <div className="flex items-center gap-1">
                  <span>Phase 1 (HLO Window)</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3.5 px-4">Self-Enumeration Window</th>
              <th
                onClick={() => {
                  if (sortField === "pe") setSortAsc(!sortAsc);
                  else {
                    setSortField("pe");
                    setSortAsc(true);
                  }
                }}
                className="cursor-pointer py-3.5 px-4 hover:text-foreground"
              >
                <div className="flex items-center gap-1">
                  <span>Phase 2 (PE Window)</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3.5 px-4">Notification Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  No state or UT found matching your filter.
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr
                  key={item.code}
                  onClick={() => handleSelectState(item)}
                  className="cursor-pointer transition hover:bg-muted/40 group"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground group-hover:text-primary">
                        {item.nameKey.replace("states.", "")}
                      </span>
                      <span className="font-mono text-[10px] rounded bg-muted px-1.5 py-0.5 text-muted-foreground">
                        {item.code}
                      </span>
                      {item.isSnowBound && (
                        <span title="Snow-bound region" className="text-saffron">
                          <Snowflake className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-muted-foreground">
                    {item.hloStartISO
                      ? `${item.hloStartISO.slice(0, 10)} to ${item.hloEndISO?.slice(0, 10)}`
                      : "Indicative (Apr–Sept 2026)"}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-indiagreen-dark dark:text-indiagreen-light">
                    {item.selfEnumOpenISO
                      ? `${item.selfEnumOpenISO.slice(0, 10)} to ${item.selfEnumCloseISO?.slice(0, 10)}`
                      : "Open 30d prior to PE"}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-foreground">
                    {item.peStartISO.slice(0, 10)} to {item.peEndISO.slice(0, 10)}
                  </td>
                  <td className="py-3.5 px-4">
                    {item.isOfficial ? (
                      <Badge variant="official" className="text-[10px]">
                        <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" /> Official Notified
                      </Badge>
                    ) : (
                      <Badge variant="indicative" className="text-[10px]">
                        <AlertCircle className="h-2.5 w-2.5 mr-0.5" /> Indicative — awaiting state notification
                      </Badge>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* State Detail Drawer */}
      <StateDetailSheet
        stateSchedule={selectedState}
        onClose={handleCloseSheet}
      />
    </div>
  );
}
