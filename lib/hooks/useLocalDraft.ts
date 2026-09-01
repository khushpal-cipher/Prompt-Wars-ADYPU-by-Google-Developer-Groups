"use client";

import { useReducer, useEffect, useCallback } from "react";
import { HouseholdDraft, MemberDraft, WizardAction, ResidenceStatus } from "@/lib/types";

const LOCAL_STORAGE_KEY = "jg27.selfEnum.draft";

const createDefaultMember = (isHead: boolean = false): MemberDraft => ({
  localId: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  relationshipToHead: isHead ? "Head of Household" : "Spouse",
  sex: "M",
  ageYears: 35,
  maritalStatus: "Married",
  motherTongue: "Hindi",
  literacyStatus: "Literate",
  educationLevel: "Graduate & Above",
  workStatus: "Main Worker (Worked >= 6 months)",
  hasDisability: false,
});

const DEFAULT_DRAFT: HouseholdDraft = {
  buildingUse: "Residential Only",
  residenceStatus: ResidenceStatus.Owned,
  roomCount: 3,
  drinkingWaterSource: "Treated Tap Water within premises",
  hasElectricity: true,
  latrineType: "Flush Latrine connected to piped sewer system",
  cookingFuel: "LPG / Piped Natural Gas (PNG)",
  assets: [
    "Smartphone",
    "Internet Connection (Wi-Fi/Broadband)",
    "Television",
    "Two-Wheeler (Motorcycle / Scooter)",
  ],
  members: [createDefaultMember(true)],
};

export function draftReducer(state: HouseholdDraft, action: WizardAction): HouseholdDraft {
  switch (action.type) {
    case "SET_HOUSEHOLD_FIELD":
      return {
        ...state,
        [action.key]: action.value,
      };

    case "ADD_MEMBER":
      return {
        ...state,
        members: [...state.members, createDefaultMember(false)],
      };

    case "REMOVE_MEMBER":
      if (state.members.length <= 1) return state; // Keep at least one member (Head)
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
      return DEFAULT_DRAFT;

    default:
      return state;
  }
}

export function useLocalDraft() {
  const [draft, dispatch] = useReducer(draftReducer, DEFAULT_DRAFT);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.members)) {
          dispatch({ type: "HYDRATE", draft: parsed });
        }
      }
    } catch (err) {
      console.warn("Could not read local draft:", err);
    }
  }, []);

  // Save to localStorage whenever draft changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draft));
    } catch (err) {
      console.warn("Could not save local draft:", err);
    }
  }, [draft]);

  const clear = useCallback(() => {
    dispatch({ type: "RESET" });
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (err) {
      console.warn("Could not clear local draft:", err);
    }
  }, []);

  const exportJson = useCallback(() => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(draft, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `JanGanana2027_SelfEnum_Draft_${Date.now()}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [draft]);

  return {
    draft,
    dispatch,
    clear,
    exportJson,
  };
}
