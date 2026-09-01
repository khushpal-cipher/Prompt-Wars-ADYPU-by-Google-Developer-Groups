"use client";

import React, { useState } from "react";
import { useLocalDraft } from "@/lib/hooks/useLocalDraft";
import { StepIndicator } from "./StepIndicator";
import { FieldHelp } from "./FieldHelp";
import { SummaryReview } from "./SummaryReview";
import { ResidenceStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Lock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export function EnumerationWizard() {
  const { draft, dispatch, clear, exportJson } = useLocalDraft();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [ageErrors, setAgeErrors] = useState<Record<string, string>>({});
  const [roomCountError, setRoomCountError] = useState<string | null>(null);

  // Validate current step before advancing
  const isCurrentStepValid = (): boolean => {
    if (currentStep === 1) {
      if (roomCountError) return false;
      if (draft.roomCount === null || draft.roomCount < 1 || draft.roomCount > 30) {
        return false;
      }
    }
    if (currentStep === 4) {
      if (Object.keys(ageErrors).length > 0) return false;
      for (const mem of draft.members) {
        if (mem.ageYears === null || mem.ageYears < 0 || mem.ageYears > 120) {
          return false;
        }
      }
    }
    return true;
  };

  const handleNext = () => {
    if (isCurrentStepValid() && currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRoomCountChange = (valStr: string) => {
    if (!valStr.trim()) {
      setRoomCountError("Room count is required (1–30)");
      dispatch({ type: "SET_HOUSEHOLD_FIELD", key: "roomCount", value: null });
      return;
    }
    const num = parseInt(valStr, 10);
    if (isNaN(num) || num < 1 || num > 30) {
      setRoomCountError("Please enter a valid number of dwelling rooms between 1 and 30.");
      dispatch({ type: "SET_HOUSEHOLD_FIELD", key: "roomCount", value: num });
    } else {
      setRoomCountError(null);
      dispatch({ type: "SET_HOUSEHOLD_FIELD", key: "roomCount", value: num });
    }
  };

  const handleAgeChange = (localId: string, valStr: string) => {
    if (!valStr.trim()) {
      setAgeErrors((prev) => ({ ...prev, [localId]: "Age is required (0–120)" }));
      dispatch({
        type: "SET_MEMBER_FIELD",
        localId,
        key: "ageYears",
        value: null,
      });
      return;
    }
    const age = parseInt(valStr, 10);
    if (isNaN(age) || age < 0 || age > 120) {
      setAgeErrors((prev) => ({
        ...prev,
        [localId]: "Invalid age. Must be an integer between 0 and 120 years.",
      }));
      dispatch({
        type: "SET_MEMBER_FIELD",
        localId,
        key: "ageYears",
        value: age,
      });
    } else {
      setAgeErrors((prev) => {
        const copy = { ...prev };
        delete copy[localId];
        return copy;
      });
      dispatch({
        type: "SET_MEMBER_FIELD",
        localId,
        key: "ageYears",
        value: age,
      });
    }
  };

  const toggleAsset = (assetName: string) => {
    const exists = draft.assets.includes(assetName);
    const updated = exists
      ? draft.assets.filter((a) => a !== assetName)
      : [...draft.assets, assetName];
    dispatch({ type: "SET_HOUSEHOLD_FIELD", key: "assets", value: updated });
  };

  return (
    <div className="space-y-8">
      {/* Step Indicator Progress Rail */}
      <StepIndicator
        currentStep={currentStep}
        onStepClick={(step) => setCurrentStep(step)}
      />

      {/* Main Form Container */}
      <Card className="border-border shadow-md">
        {/* Step 1: Household Base */}
        {currentStep === 1 && (
          <div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sm:text-xl">
                  Step 1: Household Base & Ownership
                </CardTitle>
                <Badge variant="official">Phase 1 (HLO)</Badge>
              </div>
              <CardDescription>
                Specify the primary usage and dwelling tenure of the census household unit.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Building Use */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-bold uppercase text-foreground">
                    Building Use
                  </label>
                  <FieldHelp fieldId="hlo_building_use" label="Building Use" />
                </div>
                <Select
                  value={draft.buildingUse || "Residential Only"}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_HOUSEHOLD_FIELD",
                      key: "buildingUse",
                      value: e.target.value,
                    })
                  }
                >
                  <option value="Residential Only">Residential Only</option>
                  <option value="Residence-cum-commercial / Shop">Residence-cum-commercial / Shop</option>
                  <option value="Residence-cum-workshop / Industry">Residence-cum-workshop / Industry</option>
                  <option value="Non-residential / Commercial">Non-residential / Commercial</option>
                  <option value="Other Living Quarters">Other Living Quarters</option>
                </Select>
              </div>

              {/* Ownership / Residence Status */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-bold uppercase text-foreground">
                    Ownership Status
                  </label>
                  <FieldHelp fieldId="hlo_residence_status" label="Ownership Status" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Owned", val: ResidenceStatus.Owned },
                    { label: "Rented", val: ResidenceStatus.Rented },
                    { label: "Other / Quarters", val: ResidenceStatus.Other },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: "SET_HOUSEHOLD_FIELD",
                          key: "residenceStatus",
                          value: item.val,
                        })
                      }
                      className={`rounded-xl border p-3 text-xs font-bold transition text-center ${
                        draft.residenceStatus === item.val
                          ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room Count */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-bold uppercase text-foreground">
                    Number of Dwelling Rooms (1–30)
                  </label>
                  <FieldHelp fieldId="hlo_room_count" label="Room Count" />
                </div>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={30}
                  value={draft.roomCount ?? ""}
                  onChange={(e) => handleRoomCountChange(e.target.value)}
                  placeholder="e.g. 3"
                  className={roomCountError ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {roomCountError && (
                  <p className="text-xs font-semibold text-destructive flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {roomCountError}
                  </p>
                )}
              </div>
            </CardContent>
          </div>
        )}

        {/* Step 2: Housing & Amenities */}
        {currentStep === 2 && (
          <div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sm:text-xl">
                  Step 2: Living Amenities & Sanitation
                </CardTitle>
                <Badge variant="official">Phase 1 (HLO)</Badge>
              </div>
              <CardDescription>
                Record basic amenities available at the household structure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Drinking Water Source */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-bold uppercase text-foreground">
                    Primary Drinking Water Source
                  </label>
                  <FieldHelp fieldId="hlo_drinking_water_source" label="Drinking Water" />
                </div>
                <Select
                  value={draft.drinkingWaterSource || "Treated Tap Water within premises"}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_HOUSEHOLD_FIELD",
                      key: "drinkingWaterSource",
                      value: e.target.value,
                    })
                  }
                >
                  <option value="Treated Tap Water within premises">Treated Tap Water within premises</option>
                  <option value="Untreated Tap Water within premises">Untreated Tap Water within premises</option>
                  <option value="Covered Well / Tubewell / Handpump">Covered Well / Tubewell / Handpump</option>
                  <option value="Uncovered Well / River / Canal">Uncovered Well / River / Canal</option>
                  <option value="Packaged Bottled / RO Water">Packaged Bottled / RO Water</option>
                  <option value="Tanker / Other Source">Tanker / Other Source</option>
                </Select>
              </div>

              {/* Electricity Connection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-foreground">
                  Electricity Availability
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Yes (Connected to Grid / Solar)", val: true },
                    { label: "No Electricity Connection", val: false },
                  ].map((item) => (
                    <button
                      key={String(item.val)}
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: "SET_HOUSEHOLD_FIELD",
                          key: "hasElectricity",
                          value: item.val,
                        })
                      }
                      className={`rounded-xl border p-3 text-xs font-bold transition text-center ${
                        draft.hasElectricity === item.val
                          ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Latrine Facility */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-bold uppercase text-foreground">
                    Latrine & Toilet Facility
                  </label>
                  <FieldHelp fieldId="hlo_latrine_type" label="Latrine Facility" />
                </div>
                <Select
                  value={draft.latrineType || "Flush Latrine connected to piped sewer system"}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_HOUSEHOLD_FIELD",
                      key: "latrineType",
                      value: e.target.value,
                    })
                  }
                >
                  <option value="Flush Latrine connected to piped sewer system">
                    Flush Latrine connected to piped sewer system
                  </option>
                  <option value="Flush Latrine connected to septic tank">
                    Flush Latrine connected to septic tank
                  </option>
                  <option value="Twin-pit / Single-pit latrine">Twin-pit / Single-pit latrine</option>
                  <option value="Public / Community Latrine">Public / Community Latrine</option>
                  <option value="No Latrine within premises">No Latrine within premises</option>
                </Select>
              </div>

              {/* Cooking Fuel */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-bold uppercase text-foreground">
                    Primary Cooking Fuel
                  </label>
                  <FieldHelp fieldId="hlo_kitchen_cooking_fuel" label="Cooking Fuel" />
                </div>
                <Select
                  value={draft.cookingFuel || "LPG / Piped Natural Gas (PNG)"}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_HOUSEHOLD_FIELD",
                      key: "cookingFuel",
                      value: e.target.value,
                    })
                  }
                >
                  <option value="LPG / Piped Natural Gas (PNG)">LPG / Piped Natural Gas (PNG)</option>
                  <option value="Electricity / Induction Stove">Electricity / Induction Stove</option>
                  <option value="Biogas">Biogas</option>
                  <option value="Firewood / Crop Residue">Firewood / Crop Residue</option>
                  <option value="Kerosene / Coal / Charcoal">Kerosene / Coal / Charcoal</option>
                </Select>
              </div>
            </CardContent>
          </div>
        )}

        {/* Step 3: Household Assets */}
        {currentStep === 3 && (
          <div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sm:text-xl">
                  Step 3: Household Assets & Connectivity
                </CardTitle>
                <Badge variant="official">Phase 1 (HLO)</Badge>
              </div>
              <CardDescription>
                Select all communication, computing, and mobility assets owned by the household.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Smartphone",
                  "Feature Phone (Non-Smart)",
                  "Internet Connection (Wi-Fi/Broadband)",
                  "Computer / Laptop / Tablet",
                  "Television",
                  "Radio / Transistor",
                  "Bicycle",
                  "Two-Wheeler (Motorcycle / Scooter)",
                  "Four-Wheeler / Car / Van",
                ].map((asset) => {
                  const isSelected = draft.assets.includes(asset);
                  return (
                    <button
                      key={asset}
                      type="button"
                      onClick={() => toggleAsset(asset)}
                      className={`flex items-center justify-between rounded-xl border p-3.5 text-xs font-semibold transition ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary shadow-xs"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      <span>{asset}</span>
                      <div
                        className={`h-4 w-4 rounded-md border flex items-center justify-center ${
                          isSelected
                            ? "bg-primary border-primary text-white"
                            : "border-muted-foreground/40"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </div>
        )}

        {/* Step 4: Family Members Roster (Phase 2) */}
        {currentStep === 4 && (
          <div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sm:text-xl">
                  Step 4: Family Members Roster
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="saffron">
                    <Sparkles className="h-3 w-3 mr-1" /> Caste Encl.
                  </Badge>
                  <Badge variant="official">Phase 2 (PE)</Badge>
                </div>
              </div>
              <CardDescription>
                Declare individual demographic details for every member residing in this household.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {draft.members.map((mem, index) => {
                const isHead = index === 0;
                const err = ageErrors[mem.localId];

                return (
                  <div
                    key={mem.localId}
                    className="rounded-2xl border border-border bg-muted/30 p-5 space-y-4 shadow-xs"
                  >
                    <div className="flex items-center justify-between border-b border-border/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                          {index + 1}
                        </span>
                        <h4 className="font-bold text-sm text-foreground">
                          {isHead ? "Head of Household" : `Family Member #${index + 1}`}
                        </h4>
                      </div>
                      {!isHead && (
                        <button
                          type="button"
                          onClick={() =>
                            dispatch({
                              type: "REMOVE_MEMBER",
                              localId: mem.localId,
                            })
                          }
                          className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Relationship to Head */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">
                          Relationship to Head
                        </label>
                        {isHead ? (
                          <Input value="Head of Household" disabled className="bg-muted text-xs" />
                        ) : (
                          <Select
                            value={mem.relationshipToHead || "Spouse"}
                            onChange={(e) =>
                              dispatch({
                                type: "SET_MEMBER_FIELD",
                                localId: mem.localId,
                                key: "relationshipToHead",
                                value: e.target.value,
                              })
                            }
                          >
                            <option value="Spouse">Spouse</option>
                            <option value="Son">Son</option>
                            <option value="Daughter">Daughter</option>
                            <option value="Father">Father</option>
                            <option value="Mother">Mother</option>
                            <option value="Brother / Sister">Brother / Sister</option>
                            <option value="Other Relative">Other Relative</option>
                          </Select>
                        )}
                      </div>

                      {/* Sex */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">
                          Sex
                        </label>
                        <Select
                          value={mem.sex || "M"}
                          onChange={(e) =>
                            dispatch({
                              type: "SET_MEMBER_FIELD",
                              localId: mem.localId,
                              key: "sex",
                              value: e.target.value,
                            })
                          }
                        >
                          <option value="M">Male (पुरुष)</option>
                          <option value="F">Female (महिला)</option>
                          <option value="O">Other / Transgender (अन्य)</option>
                        </Select>
                      </div>

                      {/* Age in completed years with validation */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">
                          Age (0–120 Years)
                        </label>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          max={120}
                          value={mem.ageYears ?? ""}
                          onChange={(e) => handleAgeChange(mem.localId, e.target.value)}
                          placeholder="e.g. 35"
                          className={err ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {err && (
                          <p className="text-[11px] font-semibold text-destructive flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {err}
                          </p>
                        )}
                      </div>

                      {/* Mother Tongue */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">
                          Mother Tongue
                        </label>
                        <Select
                          value={mem.motherTongue || "Hindi"}
                          onChange={(e) =>
                            dispatch({
                              type: "SET_MEMBER_FIELD",
                              localId: mem.localId,
                              key: "motherTongue",
                              value: e.target.value,
                            })
                          }
                        >
                          <option value="Hindi">Hindi (हिन्दी)</option>
                          <option value="Bengali">Bengali (বাংলা)</option>
                          <option value="Tamil">Tamil (தமிழ்)</option>
                          <option value="Marathi">Marathi (मराठी)</option>
                          <option value="Telugu">Telugu (తెలుగు)</option>
                          <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                          <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                          <option value="Malayalam">Malayalam (മലയാളം)</option>
                          <option value="Odia">Odia (ଓଡ଼ିଆ)</option>
                          <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
                          <option value="Assamese">Assamese (অসমীয়া)</option>
                          <option value="Urdu">Urdu (اردو)</option>
                          <option value="English">English</option>
                          <option value="Other Scheduled Language">Other Scheduled Language</option>
                        </Select>
                      </div>

                      {/* Education Level */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">
                          Highest Education Level
                        </label>
                        <Select
                          value={mem.educationLevel || "Graduate & Above"}
                          onChange={(e) =>
                            dispatch({
                              type: "SET_MEMBER_FIELD",
                              localId: mem.localId,
                              key: "educationLevel",
                              value: e.target.value,
                            })
                          }
                        >
                          <option value="Illiterate / Below Primary">Illiterate / Below Primary</option>
                          <option value="Primary School Completed">Primary School Completed</option>
                          <option value="Middle / Secondary School">Middle / Secondary School</option>
                          <option value="Higher Secondary (10+2)">Higher Secondary (10+2)</option>
                          <option value="Graduate & Above">Graduate & Above</option>
                          <option value="Post Graduate / Doctorate">Post Graduate / Doctorate</option>
                          <option value="Technical Diploma / Degree">Technical Diploma / Degree</option>
                        </Select>
                      </div>

                      {/* Economic Activity / Work Status */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1">
                          <label className="text-xs font-semibold text-muted-foreground">
                            Work Status
                          </label>
                          <FieldHelp fieldId="pe_work_status_economic_activity" label="Work Status" />
                        </div>
                        <Select
                          value={mem.workStatus || "Main Worker (Worked >= 6 months)"}
                          onChange={(e) =>
                            dispatch({
                              type: "SET_MEMBER_FIELD",
                              localId: mem.localId,
                              key: "workStatus",
                              value: e.target.value,
                            })
                          }
                        >
                          <option value="Main Worker (Worked >= 6 months)">Main Worker (Worked &gt;= 6 months)</option>
                          <option value="Marginal Worker (Worked 3-6 months)">Marginal Worker (Worked 3-6 months)</option>
                          <option value="Marginal Worker (Worked < 3 months)">Marginal Worker (Worked &lt; 3 months)</option>
                          <option value="Non-Worker (Student / Homemaker / Retired)">
                            Non-Worker (Student / Homemaker / Retired)
                          </option>
                        </Select>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add Member Button */}
              <button
                type="button"
                onClick={() => dispatch({ type: "ADD_MEMBER" })}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 py-4 text-xs font-bold text-primary hover:bg-primary/10 transition"
              >
                <Plus className="h-4 w-4" />
                <span>Add Another Family Member</span>
              </button>
            </CardContent>
          </div>
        )}

        {/* Step 5: Summary Review & QR Generation */}
        {currentStep === 5 && (
          <div className="p-6">
            <SummaryReview
              draft={draft}
              onExport={exportJson}
              onEditStep={(step) => setCurrentStep(step)}
            />
          </div>
        )}

        {/* Form Navigation Footer */}
        <div className="flex items-center justify-between border-t border-border p-4 bg-muted/20">
          <div>
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                className="gap-1.5 text-xs"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous Step</span>
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                onClick={clear}
                className="gap-1.5 text-xs text-muted-foreground hover:text-destructive"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Form</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep < 5 ? (
              <Button
                type="button"
                variant="default"
                onClick={handleNext}
                disabled={!isCurrentStepValid()}
                className="gap-1.5 text-xs font-semibold shadow-sm"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="saffron"
                onClick={exportJson}
                className="gap-1.5 text-xs font-bold shadow-md"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Export Local Draft JSON</span>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
