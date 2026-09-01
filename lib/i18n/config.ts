import { LocaleCode } from "../types";

export type TranslationTier = "verified" | "machine";

export interface LocaleMeta {
  readonly code: LocaleCode;
  readonly name: string;
  readonly nativeName: string;
  readonly isRTL: boolean;
  readonly script: string;
  readonly translationTier: TranslationTier;
}

export const SUPPORTED_LOCALES: readonly LocaleMeta[] = [
  {
    code: LocaleCode.EN,
    name: "English",
    nativeName: "English",
    isRTL: false,
    script: "Latin",
    translationTier: "verified",
  },
  {
    code: LocaleCode.HI,
    name: "Hindi",
    nativeName: "हिन्दी",
    isRTL: false,
    script: "Devanagari",
    translationTier: "verified",
  },
  {
    code: LocaleCode.BN,
    name: "Bengali",
    nativeName: "বাংলা",
    isRTL: false,
    script: "Bengali",
    translationTier: "verified",
  },
  {
    code: LocaleCode.TA,
    name: "Tamil",
    nativeName: "தமிழ்",
    isRTL: false,
    script: "Tamil",
    translationTier: "verified",
  },
  {
    code: LocaleCode.MR,
    name: "Marathi",
    nativeName: "मराठी",
    isRTL: false,
    script: "Devanagari",
    translationTier: "verified",
  },
  {
    code: LocaleCode.TE,
    name: "Telugu",
    nativeName: "తెలుగు",
    isRTL: false,
    script: "Telugu",
    translationTier: "verified",
  },
  {
    code: LocaleCode.GU,
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    isRTL: false,
    script: "Gujarati",
    translationTier: "machine",
  },
  {
    code: LocaleCode.KN,
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    isRTL: false,
    script: "Kannada",
    translationTier: "machine",
  },
  {
    code: LocaleCode.ML,
    name: "Malayalam",
    nativeName: "മലയാളം",
    isRTL: false,
    script: "Malayalam",
    translationTier: "machine",
  },
  {
    code: LocaleCode.OR,
    name: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    isRTL: false,
    script: "Odia",
    translationTier: "machine",
  },
  {
    code: LocaleCode.PA,
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    isRTL: false,
    script: "Gurmukhi",
    translationTier: "machine",
  },
  {
    code: LocaleCode.AS,
    name: "Assamese",
    nativeName: "অসমীয়া",
    isRTL: false,
    script: "Bengali-Assamese",
    translationTier: "machine",
  },
  {
    code: LocaleCode.UR,
    name: "Urdu",
    nativeName: "اردو",
    isRTL: true,
    script: "Arabic",
    translationTier: "machine",
  },
  {
    code: LocaleCode.SD,
    name: "Sindhi",
    nativeName: "سنڌي",
    isRTL: true,
    script: "Arabic",
    translationTier: "machine",
  },
  {
    code: LocaleCode.NE,
    name: "Nepali",
    nativeName: "नेपाली",
    isRTL: false,
    script: "Devanagari",
    translationTier: "machine",
  },
  {
    code: LocaleCode.KS,
    name: "Kashmiri",
    nativeName: "کٲشُر",
    isRTL: true,
    script: "Arabic",
    translationTier: "machine",
  },
  {
    code: LocaleCode.KOK,
    name: "Konkani",
    nativeName: "कोंकणी",
    isRTL: false,
    script: "Devanagari",
    translationTier: "machine",
  },
  {
    code: LocaleCode.MAI,
    name: "Maithili",
    nativeName: "मैथिली",
    isRTL: false,
    script: "Devanagari",
    translationTier: "machine",
  },
  {
    code: LocaleCode.SAT,
    name: "Santali",
    nativeName: "ᱥᱟᱱᱛᱟᱲᱤ",
    isRTL: false,
    script: "Ol Chiki",
    translationTier: "machine",
  },
  {
    code: LocaleCode.SA,
    name: "Sanskrit",
    nativeName: "संस्कृतम्",
    isRTL: false,
    script: "Devanagari",
    translationTier: "machine",
  },
  {
    code: LocaleCode.DOI,
    name: "Dogri",
    nativeName: "डोगरी",
    isRTL: false,
    script: "Devanagari",
    translationTier: "machine",
  },
  {
    code: LocaleCode.MNI,
    name: "Manipuri",
    nativeName: "মৈতৈলোন্",
    isRTL: false,
    script: "Meitei",
    translationTier: "machine",
  },
  {
    code: LocaleCode.BRX,
    name: "Bodo",
    nativeName: "बर'",
    isRTL: false,
    script: "Devanagari",
    translationTier: "machine",
  },
];

export const DEFAULT_LOCALE = LocaleCode.EN;

export function getLocaleMeta(code: LocaleCode): LocaleMeta {
  return (
    SUPPORTED_LOCALES.find((l) => l.code === code) ?? SUPPORTED_LOCALES[0]
  );
}
