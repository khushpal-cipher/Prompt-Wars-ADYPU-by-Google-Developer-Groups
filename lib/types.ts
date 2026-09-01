export enum CensusPhase {
  HouseListing = "HLO",
  PopulationEnumeration = "PE",
}

export enum LocaleCode {
  EN = "en",
  HI = "hi",
  BN = "bn",
  TA = "ta",
  MR = "mr",
  TE = "te",
  GU = "gu",
  KN = "kn",
  ML = "ml",
  OR = "or",
  PA = "pa",
  AS = "as",
  UR = "ur",
  SD = "sd",
  NE = "ne",
  KS = "ks",
  KOK = "kok",
  MAI = "mai",
  SAT = "sat",
  SA = "sa",
  DOI = "doi",
  MNI = "mni",
  BRX = "brx",
}

export enum VerdictLabel {
  True = "TRUE",
  False = "FALSE",
  Misleading = "MISLEADING",
  Unverifiable = "UNVERIFIABLE",
}

export enum ResidenceStatus {
  Owned = "OWNED",
  Rented = "RENTED",
  Other = "OTHER",
}

export interface CollectedField {
  readonly id: string;
  readonly labelKey: string;
  readonly phase: CensusPhase;
  readonly category: string;
  readonly isNew2027: boolean;
}

export interface PhaseDefinition {
  readonly phase: CensusPhase;
  readonly titleKey: string;
  readonly summaryKey: string;
  readonly windowStartISO: string;
  readonly windowEndISO: string;
  readonly referenceMomentISO: string;
  readonly fields: readonly CollectedField[];
  readonly isOfficial: boolean;
}

export interface StateSchedule {
  readonly code: string; // ISO 3166-2:IN subdivision, e.g. "MH"
  readonly nameKey: string;
  readonly isUnionTerritory: boolean;
  readonly hloStartISO: string | null;
  readonly hloEndISO: string | null;
  readonly peStartISO: string;
  readonly peEndISO: string;
  readonly selfEnumOpenISO: string | null;
  readonly selfEnumCloseISO: string | null;
  readonly isSnowBound: boolean;
  readonly isOfficial: boolean;
  readonly notes: string | null;
}

export interface CensusYearRecord {
  readonly year: number;
  readonly population: number; // absolute
  readonly decadalGrowthPct: number | null;
  readonly literacyRatePct: number | null;
  readonly sexRatio: number | null; // females per 1000 males
  readonly urbanSharePct: number | null;
  readonly densityPerSqKm: number | null;
  readonly isProjection: boolean;
}

export interface StateMetricRecord {
  readonly stateCode: string;
  readonly population2011: number;
  readonly literacyRatePct: number;
  readonly sexRatio: number;
  readonly urbanSharePct: number;
  readonly densityPerSqKm: number;
}

export interface KnowledgeEntry {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
  readonly sourceLabel: string;
  readonly sourceUrl: string | null;
  readonly tags: readonly string[];
}

export interface ChatMessage {
  readonly id: string;
  readonly role: "user" | "assistant";
  readonly content: string;
  readonly citations: readonly string[];
  readonly createdAt: number;
}

export interface HouseholdDraft {
  readonly buildingUse: string | null;
  readonly residenceStatus: ResidenceStatus | null;
  readonly roomCount: number | null;
  readonly drinkingWaterSource: string | null;
  readonly hasElectricity: boolean | null;
  readonly latrineType: string | null;
  readonly cookingFuel: string | null;
  readonly assets: readonly string[];
  readonly members: readonly MemberDraft[];
}

export interface MemberDraft {
  readonly localId: string;
  readonly relationshipToHead: string | null;
  readonly sex: "M" | "F" | "O" | null;
  readonly ageYears: number | null;
  readonly maritalStatus: string | null;
  readonly motherTongue: string | null;
  readonly literacyStatus: string | null;
  readonly educationLevel: string | null;
  readonly workStatus: string | null;
  readonly hasDisability: boolean | null;
}

export type WizardAction =
  | { type: "SET_HOUSEHOLD_FIELD"; key: keyof HouseholdDraft; value: unknown }
  | { type: "ADD_MEMBER" }
  | { type: "REMOVE_MEMBER"; localId: string }
  | { type: "SET_MEMBER_FIELD"; localId: string; key: keyof MemberDraft; value: unknown }
  | { type: "GOTO_STEP"; step: number }
  | { type: "HYDRATE"; draft: HouseholdDraft }
  | { type: "RESET" };
