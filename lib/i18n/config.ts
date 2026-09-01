import { LocaleCode } from "../types";

export interface LocaleMeta {
  readonly code: LocaleCode;
  readonly name: string;
  readonly nativeName: string;
  readonly isRTL: boolean;
  readonly script: string;
}

export const SUPPORTED_LOCALES: readonly LocaleMeta[] = [
  {
    code: LocaleCode.EN,
    name: "English",
    nativeName: "English",
    isRTL: false,
    script: "Latin",
  },
  {
    code: LocaleCode.HI,
    name: "Hindi",
    nativeName: "हिन्दी",
    isRTL: false,
    script: "Devanagari",
  },
  {
    code: LocaleCode.BN,
    name: "Bengali",
    nativeName: "বাংলা",
    isRTL: false,
    script: "Bengali",
  },
  {
    code: LocaleCode.TA,
    name: "Tamil",
    nativeName: "தமிழ்",
    isRTL: false,
    script: "Tamil",
  },
  {
    code: LocaleCode.MR,
    name: "Marathi",
    nativeName: "मराठी",
    isRTL: false,
    script: "Devanagari",
  },
  {
    code: LocaleCode.TE,
    name: "Telugu",
    nativeName: "తెలుగు",
    isRTL: false,
    script: "Telugu",
  },
  {
    code: LocaleCode.GU,
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    isRTL: false,
    script: "Gujarati",
  },
  {
    code: LocaleCode.KN,
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    isRTL: false,
    script: "Kannada",
  },
  {
    code: LocaleCode.ML,
    name: "Malayalam",
    nativeName: "മലയാളം",
    isRTL: false,
    script: "Malayalam",
  },
  {
    code: LocaleCode.OR,
    name: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    isRTL: false,
    script: "Odia",
  },
  {
    code: LocaleCode.PA,
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    isRTL: false,
    script: "Gurmukhi",
  },
  {
    code: LocaleCode.AS,
    name: "Assamese",
    nativeName: "অসমীয়া",
    isRTL: false,
    script: "Bengali-Assamese",
  },
  {
    code: LocaleCode.UR,
    name: "Urdu",
    nativeName: "اردو",
    isRTL: true,
    script: "Arabic",
  },
  {
    code: LocaleCode.SD,
    name: "Sindhi",
    nativeName: "سنڌي",
    isRTL: true,
    script: "Arabic",
  },
  {
    code: LocaleCode.NE,
    name: "Nepali",
    nativeName: "नेपाली",
    isRTL: false,
    script: "Devanagari",
  },
  {
    code: LocaleCode.KS,
    name: "Kashmiri",
    nativeName: "کٲشُر",
    isRTL: true,
    script: "Arabic",
  },
  {
    code: LocaleCode.KOK,
    name: "Konkani",
    nativeName: "कोंकणी",
    isRTL: false,
    script: "Devanagari",
  },
  {
    code: LocaleCode.MAI,
    name: "Maithili",
    nativeName: "मैथिली",
    isRTL: false,
    script: "Devanagari",
  },
  {
    code: LocaleCode.SAT,
    name: "Santali",
    nativeName: "ᱥᱟᱱᱛᱟᱲᱤ",
    isRTL: false,
    script: "Ol Chiki",
  },
  {
    code: LocaleCode.SA,
    name: "Sanskrit",
    nativeName: "संस्कृतम्",
    isRTL: false,
    script: "Devanagari",
  },
  {
    code: LocaleCode.DOI,
    name: "Dogri",
    nativeName: "डोगरी",
    isRTL: false,
    script: "Devanagari",
  },
  {
    code: LocaleCode.MNI,
    name: "Manipuri",
    nativeName: "মৈতৈলোন্",
    isRTL: false,
    script: "Meitei",
  },
  {
    code: LocaleCode.BRX,
    name: "Bodo",
    nativeName: "बर'",
    isRTL: false,
    script: "Devanagari",
  },
];

export const DEFAULT_LOCALE = LocaleCode.EN;

export function getLocaleMeta(code: LocaleCode): LocaleMeta {
  return (
    SUPPORTED_LOCALES.find((l) => l.code === code) ?? SUPPORTED_LOCALES[0]
  );
}
