"use client";

import React, { useState, useMemo } from "react";
import { type CollectedField, CensusPhase } from "@/lib/types";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Search,
  Layers,
  HelpCircle,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";

export function FieldChecklist({
  hloFields,
  peFields,
}: {
  hloFields: readonly CollectedField[];
  peFields: readonly CollectedField[];
}) {
  const { t, locale } = useI18n();
  const [filterNewOnly, setFilterNewOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedField, setSelectedField] = useState<CollectedField | null>(null);
  const [fieldExplanation, setFieldExplanation] = useState<{
    plainLanguage: string;
    whyItMatters: string;
    example: string;
  } | null>(null);
  const [loadingExplain, setLoadingExplain] = useState(false);

  const filterFields = (fields: readonly CollectedField[]) => {
    return fields.filter((f) => {
      if (filterNewOnly && !f.isNew2027) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = f.id.toLowerCase().includes(q);
        const matchCategory = f.category.toLowerCase().includes(q);
        const matchLabel = f.labelKey.toLowerCase().includes(q);
        if (!matchId && !matchCategory && !matchLabel) return false;
      }
      return true;
    });
  };

  const filteredHLO = useMemo(
    () => filterFields(hloFields),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hloFields, filterNewOnly, searchQuery]
  );
  const filteredPE = useMemo(
    () => filterFields(peFields),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [peFields, filterNewOnly, searchQuery]
  );

  const handleExplain = async (field: CollectedField) => {
    setSelectedField(field);
    setLoadingExplain(true);
    try {
      const res = await fetch("/api/explain-field", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fieldId: field.id, locale }),
      });
      if (res.ok) {
        const data = await res.json();
        setFieldExplanation(data);
      }
    } catch (err) {
      console.warn("Failed to fetch field explanation:", err);
      setFieldExplanation({
        plainLanguage: `This collects data for "${field.id.replace(/_/g, " ")}" across households.`,
        whyItMatters: "Enables equitable national resource planning.",
        example: "Self-declared accurate answer.",
      });
    } finally {
      setLoadingExplain(false);
    }
  };

  const renderFieldList = (fields: CollectedField[]) => {
    if (fields.length === 0) {
      return (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground text-xs">
          {t("phases.checklist.noResults")}
        </div>
      );
    }

    // Group by category
    const categories = Array.from(new Set(fields.map((f) => f.category)));

    return (
      <div className="space-y-6">
        {categories.map((cat) => {
          const catFields = fields.filter((f) => f.category === cat);
          return (
            <div key={cat} className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Layers className="h-3.5 w-3.5 text-primary" />
                <span>{cat}</span>
                <span className="text-[10px] text-muted-foreground/70">
                  ({catFields.length})
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {catFields.map((field) => (
                  <div
                    key={field.id}
                    onClick={() => handleExplain(field)}
                    className="cursor-pointer group flex flex-col justify-between rounded-xl border border-border bg-card p-3.5 shadow-xs transition hover:border-primary hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-foreground capitalize">
                          {field.id.replace(/^(hlo|pe)_/, "").replace(/_/g, " ")}
                        </span>
                      </div>
                      {field.isNew2027 && (
                        <Badge variant="saffron" className="text-[10px] py-0 px-1.5">
                          <Sparkles className="h-2.5 w-2.5 mr-0.5" /> {t("phases.checklist.newBadge")}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="font-mono text-[10px] text-muted-foreground/60">
                        ID: {field.id}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-primary group-hover:underline">
                        <HelpCircle className="h-3 w-3" />
                        <span>{t("phases.checklist.explainBtn")}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("phases.checklist.searchPlaceholder")}
            className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-1.5 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterNewOnly(false)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              !filterNewOnly
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("phases.checklist.allFields")}
          </button>
          <button
            type="button"
            onClick={() => setFilterNewOnly(true)}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filterNewOnly
                ? "bg-saffron text-white shadow-xs"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="h-3 w-3" />
            <span>{t("phases.checklist.new2027")}</span>
          </button>
        </div>
      </div>

      {/* Tabs for HLO vs PE */}
      <Tabs defaultValue="hlo" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 h-11 bg-muted/80 p-1">
          <TabsTrigger value="hlo" className="text-xs sm:text-sm font-bold py-2">
            {t("phases.checklist.hloTab")} ({filteredHLO.length})
          </TabsTrigger>
          <TabsTrigger value="pe" className="text-xs sm:text-sm font-bold py-2">
            {t("phases.checklist.peTab")} ({filteredPE.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hlo">{renderFieldList(filteredHLO)}</TabsContent>
        <TabsContent value="pe">{renderFieldList(filteredPE)}</TabsContent>
      </Tabs>

      {/* Field Explainer Dialog */}
      <Dialog
        isOpen={selectedField !== null}
        onClose={() => {
          setSelectedField(null);
          setFieldExplanation(null);
        }}
        title={`${t("phases.dialog.title")}: ${selectedField?.id.replace(/^(hlo|pe)_/, "").replace(/_/g, " ").toUpperCase()}`}
        description={`Phase: ${selectedField?.phase === CensusPhase.HouseListing ? t("phases.dialog.phase1") : t("phases.dialog.phase2")} · Category: ${selectedField?.category}`}
      >
        {loadingExplain ? (
          <div className="py-8 text-center text-xs text-muted-foreground animate-pulse">
            {t("phases.dialog.loading")}
          </div>
        ) : fieldExplanation ? (
          <div className="space-y-4 text-xs">
            <div className="rounded-xl bg-muted/60 p-3 border border-border">
              <h4 className="font-bold text-primary text-xs uppercase mb-1">
                {t("phases.dialog.plainMeaning")}
              </h4>
              <p className="text-foreground leading-relaxed">
                {fieldExplanation.plainLanguage}
              </p>
            </div>

            <div className="rounded-xl bg-muted/60 p-3 border border-border">
              <h4 className="font-bold text-indiagreen-dark dark:text-indiagreen-light text-xs uppercase mb-1">
                {t("phases.dialog.whyMatters")}
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                {fieldExplanation.whyItMatters}
              </p>
            </div>

            <div className="rounded-xl bg-saffron/10 p-3 border border-saffron/20">
              <h4 className="font-bold text-saffron-dark text-xs uppercase mb-1">
                {t("phases.dialog.example")}
              </h4>
              <p className="text-foreground font-mono text-[11px]">
                {fieldExplanation.example}
              </p>
            </div>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
