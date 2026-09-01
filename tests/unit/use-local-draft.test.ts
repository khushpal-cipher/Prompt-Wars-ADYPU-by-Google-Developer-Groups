import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalDraft, draftReducer } from "@/lib/hooks/useLocalDraft";
import { ResidenceStatus, HouseholdDraft } from "@/lib/types";

const LOCAL_STORAGE_KEY = "jg27.selfEnum.draft";

describe("useLocalDraft & draftReducer (lib/hooks/useLocalDraft.ts)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("draftReducer Pure Function Tests", () => {
    const initialState: HouseholdDraft = {
      buildingUse: "Residential Only",
      residenceStatus: ResidenceStatus.Owned,
      roomCount: 2,
      drinkingWaterSource: "Treated Tap Water within premises",
      hasElectricity: true,
      latrineType: "Flush Latrine connected to piped sewer system",
      cookingFuel: "LPG / Piped Natural Gas (PNG)",
      assets: ["Smartphone"],
      members: [
        {
          localId: "head_1",
          relationshipToHead: "Head of Household",
          sex: "M",
          ageYears: 40,
          maritalStatus: "Married",
          motherTongue: "Hindi",
          literacyStatus: "Literate",
          educationLevel: "Graduate & Above",
          workStatus: "Main Worker (Worked >= 6 months)",
          hasDisability: false,
        },
      ],
    };

    it("SET_HOUSEHOLD_FIELD updates targeted field and preserves other fields", () => {
      const next = draftReducer(initialState, {
        type: "SET_HOUSEHOLD_FIELD",
        key: "roomCount",
        value: 5,
      });

      expect(next.roomCount).toBe(5);
      expect(next.buildingUse).toBe(initialState.buildingUse);
      expect(next.members).toBe(initialState.members);
    });

    it("ADD_MEMBER appends new member with unique localId", () => {
      const next = draftReducer(initialState, { type: "ADD_MEMBER" });
      expect(next.members.length).toBe(2);
      expect(next.members[1].localId).toBeDefined();
      expect(next.members[1].localId).not.toBe(next.members[0].localId);
      expect(next.members[1].relationshipToHead).toBe("Spouse");
    });

    it("REMOVE_MEMBER removes the designated member", () => {
      const stateWithTwo = draftReducer(initialState, { type: "ADD_MEMBER" });
      const addedId = stateWithTwo.members[1].localId;

      const removed = draftReducer(stateWithTwo, {
        type: "REMOVE_MEMBER",
        localId: addedId,
      });

      expect(removed.members.length).toBe(1);
      expect(removed.members[0].localId).toBe("head_1");
    });

    it("REMOVE_MEMBER blocks removing the sole remaining (head) member", () => {
      expect(initialState.members.length).toBe(1);
      const attemptedRemoval = draftReducer(initialState, {
        type: "REMOVE_MEMBER",
        localId: "head_1",
      });

      expect(attemptedRemoval.members.length).toBe(1);
      expect(attemptedRemoval.members[0].localId).toBe("head_1");
    });

    it("SET_MEMBER_FIELD updates specific property on target member", () => {
      const updated = draftReducer(initialState, {
        type: "SET_MEMBER_FIELD",
        localId: "head_1",
        key: "ageYears",
        value: 45,
      });

      expect(updated.members[0].ageYears).toBe(45);
      expect(updated.members[0].sex).toBe("M");
    });

    it("RESET returns default draft state", () => {
      const modified: HouseholdDraft = {
        ...initialState,
        roomCount: 10,
      };
      const resetState = draftReducer(modified, { type: "RESET" });
      expect(resetState.roomCount).toBe(3);
    });
  });

  describe("useLocalDraft React Hook Integration", () => {
    it("initializes with default draft state and saves to localStorage", () => {
      const { result } = renderHook(() => useLocalDraft());

      expect(result.current.draft.buildingUse).toBe("Residential Only");
      expect(result.current.draft.members.length).toBe(1);
      expect(result.current.draft.members[0].relationshipToHead).toBe("Head of Household");
    });

    it("round-trips state updates through localStorage", () => {
      const { result } = renderHook(() => useLocalDraft());

      act(() => {
        result.current.dispatch({
          type: "SET_HOUSEHOLD_FIELD",
          key: "roomCount",
          value: 4,
        });
      });

      expect(result.current.draft.roomCount).toBe(4);
      const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}");
      expect(stored.roomCount).toBe(4);
    });

    it("hydrates gracefully from valid existing localStorage content", () => {
      const preloadedDraft = {
        buildingUse: "Shop-cum-Residence",
        residenceStatus: ResidenceStatus.Rented,
        roomCount: 6,
        drinkingWaterSource: "Handpump",
        hasElectricity: false,
        latrineType: "Pit Latrine with slab",
        cookingFuel: "Firewood",
        assets: ["Bicycle"],
        members: [
          {
            localId: "pre_1",
            relationshipToHead: "Head of Household",
            sex: "F",
            ageYears: 50,
            maritalStatus: "Widowed",
            motherTongue: "Marathi",
            literacyStatus: "Literate",
            educationLevel: "Secondary",
            workStatus: "Marginal Worker (Worked 3-6 months)",
            hasDisability: false,
          },
        ],
      };

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(preloadedDraft));

      const { result } = renderHook(() => useLocalDraft());

      expect(result.current.draft.roomCount).toBe(6);
      expect(result.current.draft.residenceStatus).toBe(ResidenceStatus.Rented);
      expect(result.current.draft.members[0].localId).toBe("pre_1");
    });

    it("corrupt stored JSON ('{{{') falls back to defaults without throwing", () => {
      localStorage.setItem(LOCAL_STORAGE_KEY, "{{{corrupted_invalid_json");

      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { result } = renderHook(() => useLocalDraft());

      expect(result.current.draft).toBeDefined();
      expect(result.current.draft.buildingUse).toBe("Residential Only");
      consoleWarnSpy.mockRestore();
    });

    it("gracefully handles localStorage.setItem exceptions (e.g. Safari private quota limits)", () => {
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });

      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const { result } = renderHook(() => useLocalDraft());

      expect(() => {
        act(() => {
          result.current.dispatch({
            type: "SET_HOUSEHOLD_FIELD",
            key: "roomCount",
            value: 8,
          });
        });
      }).not.toThrow();

      expect(result.current.draft.roomCount).toBe(8);
      consoleWarnSpy.mockRestore();
    });

    it("clear() resets draft in memory and syncs default draft to localStorage", () => {
      const { result } = renderHook(() => useLocalDraft());

      act(() => {
        result.current.dispatch({
          type: "SET_HOUSEHOLD_FIELD",
          key: "roomCount",
          value: 7,
        });
      });

      expect(result.current.draft.roomCount).toBe(7);

      act(() => {
        result.current.clear();
      });

      expect(result.current.draft.roomCount).toBe(3);
      const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}");
      expect(stored.roomCount).toBe(3);
    });
  });
});
