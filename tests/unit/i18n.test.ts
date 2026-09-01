import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { LocaleCode } from "@/lib/types";
import { SUPPORTED_LOCALES, getLocaleMeta, DEFAULT_LOCALE } from "@/lib/i18n/config";

import enDict from "@/lib/i18n/dictionaries/en.json";

describe("Internationalisation (i18n) & Language Configuration", () => {
  it("every LocaleCode member exists exactly once in SUPPORTED_LOCALES and vice versa", () => {
    const enumLocales = Object.values(LocaleCode);
    const supportedCodes = SUPPORTED_LOCALES.map((l) => l.code);

    expect(supportedCodes.length).toBe(enumLocales.length);
    expect(new Set(supportedCodes).size).toBe(supportedCodes.length);

    enumLocales.forEach((code) => {
      expect(supportedCodes).toContain(code);
    });
  });

  it("getLocaleMeta retrieves correct metadata and defaults gracefully", () => {
    expect(getLocaleMeta(LocaleCode.HI).nativeName).toBe("हिन्दी");
    expect(getLocaleMeta(DEFAULT_LOCALE).code).toBe(LocaleCode.EN);
  });

  it("every RTL locale is explicitly one of Urdu (ur), Kashmiri (ks), or Sindhi (sd)", () => {
    const rtlLocales = SUPPORTED_LOCALES.filter((l) => l.isRTL).map((l) => l.code);
    const allowedRtl = [LocaleCode.UR, LocaleCode.KS, LocaleCode.SD];

    expect(rtlLocales.length).toBe(allowedRtl.length);
    rtlLocales.forEach((code) => {
      expect(allowedRtl).toContain(code);
    });
  });

  it("every verified translationTier locale has a shipped dictionary file", () => {
    const verifiedLocales = SUPPORTED_LOCALES.filter((l) => l.translationTier === "verified");
    const dictsDir = path.resolve(__dirname, "../../lib/i18n/dictionaries");

    verifiedLocales.forEach((meta) => {
      const filePath = path.join(dictsDir, `${meta.code}.json`);
      expect(fs.existsSync(filePath), `Dictionary file missing for verified locale: ${meta.code}`).toBe(true);
    });
  });

  describe("Dictionary Key Parity & Non-Empty Content", () => {
    const dictsDir = path.resolve(__dirname, "../../lib/i18n/dictionaries");
    const dictFiles = fs.readdirSync(dictsDir).filter((f) => f.endsWith(".json"));
    const enKeys = Object.keys(enDict).sort();

    it("en.json is non-empty and has over 200 translated keys", () => {
      expect(enKeys.length).toBeGreaterThan(200);
    });

    dictFiles.forEach((file) => {
      describe(`Dictionary: ${file}`, () => {
        const filePath = path.join(dictsDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<string, string>;
        const keys = Object.keys(content).sort();

        it("has exact key parity with en.json (no missing and no extraneous keys)", () => {
          const missingKeys = enKeys.filter((k) => !keys.includes(k));
          const extraKeys = keys.filter((k) => !enKeys.includes(k));

          const diffReport = {
            file,
            missingCount: missingKeys.length,
            missingKeys,
            extraCount: extraKeys.length,
            extraKeys,
          };

          expect(missingKeys, `Missing keys in ${file}: ${JSON.stringify(diffReport, null, 2)}`).toEqual([]);
          expect(extraKeys, `Extra keys in ${file}: ${JSON.stringify(diffReport, null, 2)}`).toEqual([]);
        });

        it("contains no empty string values", () => {
          const emptyKeys = Object.entries(content)
            .filter(([_, v]) => typeof v !== "string" || v.trim().length === 0)
            .map(([k]) => k);

          expect(emptyKeys, `Found empty string values in ${file} for keys: ${emptyKeys.join(", ")}`).toEqual([]);
        });
      });
    });
  });
});
