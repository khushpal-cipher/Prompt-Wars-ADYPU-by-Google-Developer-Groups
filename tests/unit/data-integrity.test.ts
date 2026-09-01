import { describe, it, expect } from "vitest";
import { STATE_SCHEDULES, getStateByCode } from "@/lib/data/states";
import { PHASE_DEFINITIONS, HLO_FIELDS, PE_FIELDS } from "@/lib/data/phases";
import { NATIONAL_TIMESERIES, STATE_METRICS } from "@/lib/data/census-timeseries";
import { KNOWLEDGE_BASE } from "@/lib/data/knowledge-base";
import { CensusPhase } from "@/lib/types";

describe("Data Integrity & Statutory Compliance", () => {
  describe("State Schedules (lib/data/states.ts)", () => {
    it("has valid 2-3 letter uppercase code and unique across all 36 records", () => {
      const codes = STATE_SCHEDULES.map((s) => s.code);
      const uniqueCodes = new Set(codes);

      expect(codes.length).toBe(36);
      expect(uniqueCodes.size).toBe(codes.length);

      codes.forEach((code) => {
        expect(code).toMatch(/^[A-Z]{2,3}$/);
      });
    });

    it("every non-null date string yields a valid ISO Date", () => {
      STATE_SCHEDULES.forEach((state) => {
        const dates = [
          state.hloStartISO,
          state.hloEndISO,
          state.peStartISO,
          state.peEndISO,
          state.selfEnumOpenISO,
          state.selfEnumCloseISO,
        ];
        dates.forEach((d) => {
          if (d !== null) {
            const parsed = new Date(d);
            expect(isNaN(parsed.getTime())).toBe(false);
          }
        });
      });
    });

    it("peStartISO < peEndISO for every state record, and hloStartISO < hloEndISO when non-null", () => {
      STATE_SCHEDULES.forEach((state) => {
        const peStart = new Date(state.peStartISO).getTime();
        const peEnd = new Date(state.peEndISO).getTime();
        expect(peStart).toBeLessThan(peEnd);

        if (state.hloStartISO && state.hloEndISO) {
          const hloStart = new Date(state.hloStartISO).getTime();
          const hloEnd = new Date(state.hloEndISO).getTime();
          expect(hloStart).toBeLessThan(hloEnd);
        }
      });
    });

    it("requires explicit boolean isOfficial for statutory badge display", () => {
      STATE_SCHEDULES.forEach((state) => {
        expect(typeof state.isOfficial).toBe("boolean");
      });
    });

    it("ensures selfEnumCloseISO is present whenever selfEnumOpenISO is specified", () => {
      STATE_SCHEDULES.forEach((state) => {
        if (state.selfEnumOpenISO !== null) {
          expect(state.selfEnumCloseISO).not.toBeNull();
          const open = new Date(state.selfEnumOpenISO).getTime();
          const close = new Date(state.selfEnumCloseISO!).getTime();
          expect(open).toBeLessThan(close);
        }
      });
    });

    it("identifies snow-bound Himalayan states with isSnowBound: true", () => {
      const snowBound = STATE_SCHEDULES.filter((s) => s.isSnowBound);
      expect(snowBound.length).toBeGreaterThan(0);
      expect(snowBound.some((s) => s.code === "LA" || s.code === "HP" || s.code === "UT" || s.code === "JK")).toBe(true);
    });

    it("getStateByCode returns correct state or undefined", () => {
      expect(getStateByCode("DL")?.code).toBe("DL");
      expect(getStateByCode("NON_EXISTENT")).toBeUndefined();
    });
  });

  describe("Phases & Field Definitions (lib/data/phases.ts)", () => {
    it("contains definitions for both CensusPhase phases", () => {
      const phaseIds = PHASE_DEFINITIONS.map((p) => p.phase);
      expect(phaseIds).toContain(CensusPhase.HouseListing);
      expect(phaseIds).toContain(CensusPhase.PopulationEnumeration);
    });

    it("all collected fields across HLO and PE have unique IDs", () => {
      const allFields = [...HLO_FIELDS, ...PE_FIELDS];
      const ids = allFields.map((f) => f.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
      expect(allFields.length).toBeGreaterThan(15);
    });

    it("validates operational windows: windowStartISO < windowEndISO for all phases", () => {
      PHASE_DEFINITIONS.forEach((phase) => {
        const start = new Date(phase.windowStartISO).getTime();
        const end = new Date(phase.windowEndISO).getTime();
        expect(start).toBeLessThan(end);
      });
    });

    it("marks newly introduced 2027 fields with isNew2027: true", () => {
      const allFields = [...HLO_FIELDS, ...PE_FIELDS];
      const newFields = allFields.filter((f) => f.isNew2027);
      expect(newFields.length).toBeGreaterThan(0);
    });
  });

  describe("Census Timeseries (lib/data/census-timeseries.ts)", () => {
    it("has strictly ascending, non-duplicate historical years", () => {
      const years = NATIONAL_TIMESERIES.map((d) => d.year);
      const uniqueYears = new Set(years);

      expect(uniqueYears.size).toBe(years.length);

      for (let i = 1; i < years.length; i++) {
        expect(years[i]).toBeGreaterThan(years[i - 1]);
      }
    });

    it("all population values are positive numbers", () => {
      NATIONAL_TIMESERIES.forEach((row) => {
        expect(typeof row.population).toBe("number");
        expect(row.population).toBeGreaterThan(0);
      });
    });

    it("distinguishes projected records (2027) with isProjection: true", () => {
      const projectedRows = NATIONAL_TIMESERIES.filter((r) => r.isProjection === true);
      expect(projectedRows.length).toBeGreaterThan(0);
      projectedRows.forEach((r) => {
        expect(r.year).toBe(2027);
      });
    });

    it("ensures state metrics dataset contains valid metrics", () => {
      expect(STATE_METRICS.length).toBeGreaterThan(0);
      STATE_METRICS.forEach((sm) => {
        expect(sm.population2011).toBeGreaterThan(0);
        expect(sm.literacyRatePct).toBeGreaterThan(0);
        expect(sm.sexRatio).toBeGreaterThan(0);
      });
    });
  });

  describe("Knowledge Base (lib/data/knowledge-base.ts)", () => {
    it("each knowledge entry has non-empty question, answer, sourceLabel, and lowercase tags", () => {
      expect(KNOWLEDGE_BASE.length).toBeGreaterThan(0);

      KNOWLEDGE_BASE.forEach((entry) => {
        expect(entry.question.trim().length).toBeGreaterThan(0);
        expect(entry.answer.trim().length).toBeGreaterThan(0);
        expect(entry.sourceLabel.trim().length).toBeGreaterThan(0);
        expect(Array.isArray(entry.tags)).toBe(true);
        expect(entry.tags.length).toBeGreaterThan(0);

        entry.tags.forEach((tag) => {
          expect(tag).toBe(tag.toLowerCase());
        });
      });
    });
  });
});
