"use client";

import React, { useReducer, useEffect, useCallback } from "react";
import {
  type HouseholdDraft,
  type MemberDraft,
  type WizardAction,
  ResidenceStatus,
} from "../types";

export const INITIAL_DRAFT: HouseholdDraft = {
  buildingUse: "Residential Only",
  residenceStatus: ResidenceStatus.Owned,
  roomCount: 3,
  drinkingWaterSource: "Treated Tap Water within premises",
  hasElectricity: true,
  latrineType: "Flush Latrine connected to piped sewer system",
  cookingFuel: "LPG / Piped Natural Gas (PNG)",
  assets: ["Smartphone", "Internet Connection (Wi-Fi/Broadband)", "Two-Wheeler"],
  members: [
    {
      localId: "mem_head_1",
      relationshipToHead: "Head of Household",
      sex: "M",
      ageYears: 42,
      maritalStatus: "Currently Married",
      motherTongue: "Hindi",
      literacyStatus: "Literate",
      educationLevel: "Graduate & Above",
      workStatus: "Main Worker (Worked >= 6 months)",
      hasDisability: false,
    },
  ],
};

const STORAGE_KEY = "jg27.draft";

export function wizardReducer(
  state: HouseholdDraft,
  action: WizardAction
): HouseholdDraft {
  switch (action.type) {
    case "SET_HOUSEHOLD_FIELD":
      return {
        ...state,
        [action.key]: action.value,
      };

    case "ADD_MEMBER": {
      const newMember: MemberDraft = {
        localId: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        relationshipToHead: "Spouse",
        sex: "F",
        ageYears: 38,
        maritalStatus: "Currently Married",
        motherTongue: state.members[0]?.motherTongue || "Hindi",
        literacyStatus: "Literate",
        educationLevel: "Higher Secondary",
        workStatus: "Main Worker (Worked >= 6 months)",
        hasDisability: false,
      };
      return {
        ...state,
        members: [...state.members, newMember],
      };
    }

    case "REMOVE_MEMBER":
      if (state.members.length <= 1) return state; // Preserve at least Head of Household
      return {
        ...state,
        members: state.members.filter((m) => m.localId !== action.localId),
      };

    case "SET_MEMBER_FIELD":
      return {
        ...state,
        members: state.members.map((m) =>
          m.localId === action.localId
            ? { ...m, [action.key]: action.value }
            : m
        ),
      };

    case "HYDRATE":
      return action.draft;

    case "RESET":
      return INITIAL_DRAFT;

    case "GOTO_STEP":
    default:
      return state;
  }
}

export function useLocalDraft(): {
  draft: HouseholdDraft;
  dispatch: React.Dispatch<WizardAction>;
  clear: () => void;
  exportJson: () => void;
} {
  const [draft, dispatch] = useReducer(wizardReducer, INITIAL_DRAFT);

  // Restore on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && Array.isArray(parsed.members)) {
          dispatch({ type: "HYDRATE", draft: parsed });
        }
      }
    } catch (err) {
      console.warn("Could not read draft from localStorage (Safari private mode safe):", err);
    }
  }, []);

  // Save changes to localStorage on every state transition
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch (err) {
      console.warn("Could not write draft to localStorage:", err);
    }
  }, [draft]);

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn("Could not remove draft from localStorage:", err);
    }
    dispatch({ type: "RESET" });
  }, []);

  const exportJson = useCallback(() => {
    try {
      const exportPayload = {
        _schema: "GOI_CENSUS_2027_SELF_ENUMERATION_V1",
        referenceMoment: "2027-03-01T00:00:00+05:30",
        generatedTimestamp: new Date().toISOString(),
        censusReferenceNumber: `CRN-2027-${Math.random().toString(36).substring(2, 7).toUpperCase()}-IND`,
        privacyDeclaration:
          "Statutory privilege under Section 15 of Census Act 1948. Zero server transmission.",
        household: draft,
      };

      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute(
        "download",
        `Census2027_Draft_${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error("Export JSON failed:", err);
    }
  }, [draft]);

  return {
    draft,
    dispatch,
    clear,
    exportJson,
  };
}
