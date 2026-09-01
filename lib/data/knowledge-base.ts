import type { KnowledgeEntry } from "../types";

export const KNOWLEDGE_BASE: readonly KnowledgeEntry[] = [
  {
    id: "kb_two_phases",
    question: "What are the two phases of Census 2027?",
    answer:
      "Census 2027 is conducted in two distinct phases: Phase 1 is House Listing Operations (HLO) & Housing Census, running between 1 April and 30 September 2026. Phase 2 is Population Enumeration (PE), taking place from 9 February to 28 February 2027 with a revisional round from 1 to 5 March 2027.",
    sourceLabel: "Gazette of India, 16 June 2025 Notification",
    sourceUrl: "https://censusindia.gov.in",
    tags: ["phases", "hlo", "pe", "timeline", "dates"],
  },
  {
    id: "kb_reference_moment",
    question: "What is the official reference moment for Census 2027?",
    answer:
      "The reference moment for most of India is 00:00 hours on 1 March 2027. For snow-bound areas (Ladakh, higher reaches of Himachal Pradesh, Uttarakhand, and Jammu & Kashmir), the reference moment is 00:00 hours on 1 October 2026.",
    sourceLabel: "Office of the Registrar General of India (ORGI)",
    sourceUrl: "https://censusindia.gov.in",
    tags: ["reference moment", "dates", "snow-bound", "ladakh"],
  },
  {
    id: "kb_phase1_hlo_details",
    question: "What information is collected in Phase 1 (House Listing Operations)?",
    answer:
      "Phase 1 collects data on building structure (wall, roof, floor materials), use of house, number of dwelling rooms, drinking water source and availability, electricity connection, toilet and bathing facilities, kitchen type and cooking fuel (LPG/PNG), and ownership of household assets including mobile phones, internet connection, computers, and vehicles.",
    sourceLabel: "HLO Schedule Specification, ORGI",
    sourceUrl: "https://censusindia.gov.in",
    tags: ["phase1", "hlo", "housing", "amenities", "assets"],
  },
  {
    id: "kb_phase2_pe_details",
    question: "What information is collected in Phase 2 (Population Enumeration)?",
    answer:
      "Phase 2 collects individual demographic particulars: full name, relationship to head of household, sex, date of birth and age, marital status, age at marriage, religion, SC/ST status, caste enumeration, mother tongue, other languages known, literacy and educational level, economic activity/work status, industry/occupation, migration history, and disability.",
    sourceLabel: "PE Schedule Specification, ORGI",
    sourceUrl: "https://censusindia.gov.in",
    tags: ["phase2", "pe", "demographics", "caste", "education", "jobs"],
  },
  {
    id: "kb_caste_enumeration",
    question: "Is caste being counted in Census 2027?",
    answer:
      "Yes, caste enumeration is officially included in Census 2027 for the first time since the 1931 Census. Citizens will be asked their caste/sub-caste particulars as part of the Phase 2 Population Enumeration schedule.",
    sourceLabel: "Ministry of Home Affairs & ORGI Gazette",
    sourceUrl: "https://censusindia.gov.in",
    tags: ["caste", "social", "demographics", "phase2"],
  },
  {
    id: "kb_privacy_sec15",
    question: "How is my personal census data protected by law?",
    answer:
      "Under Section 15 of the Census Act, 1948, all individual census records are strictly confidential and legally privileged. They cannot be inspected by any individual, tax authority, police department, or intelligence agency, and individual census returns are NOT admissible as evidence in any court of law.",
    sourceLabel: "Census Act 1948, Section 15 & Section 11",
    sourceUrl: "https://censusindia.gov.in",
    tags: ["privacy", "security", "census act", "confidentiality", "law"],
  },
  {
    id: "kb_myth_bank_otp",
    question: "Does Census 2027 ask for bank details, credit card, or OTPs?",
    answer:
      "NO. Census officials and the digital portal NEVER ask for bank accounts, IFSC codes, credit/debit card numbers, UPI PINs, or banking OTPs. Any person asking for financial details claiming to be a census enumerator is an impostor.",
    sourceLabel: "Official Anti-Fraud Advisory, Ministry of Home Affairs",
    sourceUrl: "https://censusindia.gov.in",
    tags: ["fraud", "bank", "otp", "security", "myth"],
  },
  {
    id: "kb_myth_fee",
    question: "Do citizens need to pay any fee for self-enumeration?",
    answer:
      "NO. Self-enumeration on the official web portal and mobile app is 100% FREE for all citizens. There is zero charge for participating or receiving your Census Reference Number (CRN).",
    sourceLabel: "ORGI Digital Portal Directives",
    sourceUrl: "https://censusindia.gov.in",
    tags: ["fee", "free", "self-enumeration", "cost"],
  },
  {
    id: "kb_myth_aadhaar",
    question: "Is Aadhaar mandatory to be counted in Census 2027?",
    answer:
      "No, Aadhaar is NOT mandatory. Census enumeration in India is universal and covers every person residing in India, regardless of whether they have an Aadhaar card or any specific identity document. You can provide any valid mobile number for self-enumeration verification.",
    sourceLabel: "ORGI General Instructions",
    sourceUrl: "https://censusindia.gov.in",
    tags: ["aadhaar", "mandatory", "id", "verification"],
  },
  {
    id: "kb_myth_court_evidence",
    question: "Can census data be used against someone in a court of law or legal dispute?",
    answer:
      "NO. Section 15 of the Census Act, 1948 explicitly bars the use of individual census responses in any judicial or administrative proceedings. Census data is compiled solely for macroeconomic, developmental, and demographic planning in aggregated anonymous form.",
    sourceLabel: "Census Act, 1948 (Section 15)",
    sourceUrl: "https://censusindia.gov.in",
    tags: ["court", "evidence", "legal", "privacy"],
  },
  {
    id: "kb_self_enumeration_process",
    question: "How does the digital self-enumeration process work?",
    answer:
      "Citizens can log in to the official Census 2027 web portal using their mobile number and OTP. They fill in their household details (Phase 1) and family roster (Phase 2), review the data, and submit to generate a unique Census Reference Number (CRN) and QR Pass. When the enumerator visits, simply display the QR code for instant 10-second verification.",
    sourceLabel: "ORGI Self-Enumeration User Manual",
    sourceUrl: "https://censusindia.gov.in",
    tags: ["self-enumeration", "qr", "crn", "how to", "wizard"],
  },
  {
    id: "kb_verify_enumerator",
    question: "How can I verify if an enumerator visiting my home is genuine?",
    answer:
      "A genuine Census enumerator carries a government-issued QR-coded photo Identity Card, an authorized mobile device with the official ORGI Census App, and will NEVER ask for bank credentials, passwords, or fees. You can scan their ID QR code or verify their 6-digit Enumerator ID on the official portal.",
    sourceLabel: "ORGI Field Staff Verification Guide",
    sourceUrl: "https://censusindia.gov.in",
    tags: ["impostor", "verifier", "safety", "field visit"],
  },
  {
    id: "kb_snowbound_schedule",
    question: "Why do Ladakh and certain Himalayan regions have an earlier schedule?",
    answer:
      "Snow-bound regions in Ladakh, Himachal Pradesh, Uttarakhand, and Jammu & Kashmir become inaccessible during the winter months of February. Therefore, Population Enumeration in these areas is conducted ahead of time, between 11 September and 30 September 2026, with 1 October 2026 as the reference moment.",
    sourceLabel: "Gazette of India, Non-Synchronous Enumeration Order",
    sourceUrl: "https://censusindia.gov.in",
    tags: ["ladakh", "snowbound", "himalayan", "schedule"],
  },
  {
    id: "kb_homeless_enumeration",
    question: "How are homeless and pavement dwellers counted?",
    answer:
      "Houseless population is enumerated specifically on the night of 28 February 2027 (and 30 September 2026 in snow-bound regions) across all railway platforms, bus shelters, roadside pavements, flyovers, and night shelters by designated special flying squads.",
    sourceLabel: "ORGI Houseless Population Enumeration Circular",
    sourceUrl: "https://censusindia.gov.in",
    tags: ["homeless", "houseless", "special enumeration", "night count"],
  },
  {
    id: "kb_language_support",
    question: "Which Indian languages are supported in the digital census portal?",
    answer:
      "The portal supports all 22 official languages listed in the Eighth Schedule of the Indian Constitution, including Hindi, English, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Odia, Punjabi, Assamese, Urdu, Maithili, Santali, Sanskrit, Nepali, Sindhi, Konkani, Dogri, Manipuri, and Bodo.",
    sourceLabel: "Eighth Schedule of the Constitution of India",
    sourceUrl: "https://censusindia.gov.in",
    tags: ["languages", "i18n", "multilingual", "translation"],
  },
  {
    id: "kb_nri_foreigners",
    question: "Are NRIs and foreign nationals staying in India counted?",
    answer:
      "Any person, regardless of nationality, who is residing in India during the 21-day enumeration window (9-28 Feb 2027) is counted at their usual place of residence. Indian citizens temporarily abroad who will not return before 1 March 2027 are not counted in the domestic census.",
    sourceLabel: "ORGI Residency & Eligibility Norms",
    sourceUrl: "https://censusindia.gov.in",
    tags: ["nri", "foreigners", "eligibility", "residence"],
  },
];
