# Jan Ganana 2027 (जन गणना २०२७)
### India's First Fully Digital Census & Self-Enumeration Platform

Built for **Google for Developers × Hack2skill Hackathon** on **Census 2027 & Digital Enumeration**.

---

## 🏛️ Problem Statement & Mission
India's 16th National Census (Census 2027) is the historic first fully digital and paperless census for 1.4+ billion residents. Transitioning from paper questionnaires to digital self-enumeration requires:
1. Complete transparency on the **Two-Phase Operational Architecture** (Phase 1 HLO vs Phase 2 PE).
2. Transparent, state-wise survey schedules and snow-bound zone timelines.
3. Accessible **5-Step Digital Self-Enumeration** with instant QR Token generation.
4. Uncompromising statutory data privacy under **Section 15, Census Act 1948** and the DPDP Act 2023.
5. AI-driven **Misinformation & Fake News Buster** for WhatsApp and social media claims.
6. 70+ years of demographic time-series insights (1951–2011) with 2027 projections.
7. Multilingual accessibility across **all 22 Eighth Schedule Indian Languages**.

---

## 🚀 Key Features

- **⏱️ Live Reference Moment Countdown**: Precision countdown to 00:00 hrs, 1 March 2027 IST (and 1 Oct 2026 for snow-bound Ladakh/Himalayan zones).
- **📋 Two-Phase Deep Dive**: Complete question catalog for House Listing Operations (HLO) and Population Enumeration (PE), with filters for 2027 innovations including the historic return of Caste Enumeration.
- **🗺️ Interactive State Schedule Directory**: Real-time survey windows, self-enumeration dates, and nodal officer advisories for all 36 States and Union Territories. Includes deep-linking (`/schedule?state=MH`).
- **📝 5-Step Self-Enumeration Simulator**: 100% on-device private questionnaire with smart field validation, age clamping, and local JSON export + printable QR Pass card.
- **🛡️ Privacy Immunity & Rumor Buster**: Explainer on Section 15 of Census Act 1948 (inadmissibility in court, zero inter-agency leakage), AI-powered fake news verifier (`/api/verify-claim`), and field enumerator badge verifier.
- **📊 Demographic Timeseries Explorer**: Recharts-powered interactive charts (Population Growth with dashed 2027 projection, Dual-axis Literacy vs Sex Ratio, Urban-Rural area split, and Shareable 2-State Comparator `?a=MH&b=KL`).
- **🤖 Jan Ganana Sahayak (Gemini AI Assistant)**: Floating global assistant providing real-time streaming answers grounded in official Census rules and gazette notifications, with automatic graceful offline knowledge degradation.
- **🌐 Multilingual & Tiered Localization**: Six hand-verified dictionaries (`en`, `hi`, `bn`, `ta`, `te`, `mr`), with remaining Eighth Schedule Indian languages machine-translated at runtime via `/api/translate` and labelled `machine` in the UI.

---

## 🛠️ Technology Stack
- **Framework**: Next.js 15 (App Router, Server Components + Route Handlers)
- **Runtime**: React 19, TypeScript 5.x Strict (`strict: true`, zero `any`)
- **Styling**: Tailwind CSS + Custom National Design System (#1B2A6B Deep Indigo, #FF8A3D Saffron, #0E7C57 India Green)
- **Data Visualization**: Recharts 2.x
- **Validation**: Zod 3.x
- **Generative AI**: `@google/genai` (Google Gemini `gemini-3.6-flash` with graceful offline knowledge degradation)
- **Icons**: `lucide-react`
- **Testing**: Vitest, @vitest/coverage-v8, React Testing Library, JSDOM

---

## 🧪 Test Suites & Code Coverage

The platform enforces exhaustive automated unit and integration tests across schemas, data integrity, client state hooks, and API routes:

- **Schemas & Network Boundaries** (`tests/unit/schemas.test.ts`): Strict request and response contract validation, length bounds, message limits, and default fallback flags.
- **Census Data Integrity** (`tests/unit/data-integrity.test.ts`): State schedules (all 36 states), ascending historical timeseries, snow-bound advisories, and knowledge base integrity.
- **i18n & Dictionaries** (`tests/unit/i18n.test.ts`): Exact bidirectional key parity across all 6 verified dictionaries (218 keys), RTL categorization, and non-empty translations.
- **Zero-Server Local Draft** (`tests/unit/use-local-draft.test.ts`): Reducer transitions, member management, age clamping, and corrupted storage / quota exception handling.
- **Gemini Engine & Resilience** (`tests/unit/gemini.test.ts`): Safe JSON schema parsing, prompt injection safeguards, timeout handling, and fallback activation.
- **API Route Handlers** (`tests/integration/routes.test.ts`): Full integration tests for `/api/chat`, `/api/verify-claim`, `/api/translate`, `/api/explain-field`, and `/api/narrate-chart`.

### Running Tests

```bash
# Run all unit and integration tests
npm run test

# Run tests with V8 code coverage
npm run test:coverage
```

**Achieved Coverage**: **79.94% Line Coverage / 97 Tests Passing (0 Failures)**.

---

## 🔒 Privacy & Architecture Guarantees
- **No Database / Zero Server Storage**: Citizen self-enumeration drafts are stored strictly inside the user's browser `localStorage["jg27.selfEnum.draft"]` (with Safari private mode error wrapping).
- **Statutory Immunity**: Grounded in Section 15 of The Census Act, 1948.
- **AI Graceful Degradation**: If `GEMINI_API_KEY` is unset or times out, all AI routes automatically serve curated offline knowledge-base responses with visible status indicators.

---

## 🏃 Local Setup & Run

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd "Prompt Wars × ADYPU"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment** (Optional):
   ```bash
   cp .env.example .env.local
   # Add your GEMINI_API_KEY in .env.local (AI features will use offline fallback if omitted)
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. **Type Check, Lint, Test & Production Build**:
   ```bash
   npx tsc --noEmit
   npm run lint
   npm run test:coverage
   npm run build
   ```

---

## ⚖️ AI-Usage Disclosure
This platform uses **Google Gemini (`gemini-3.6-flash`)** via `@google/genai` for conversational Q&A, rumor claim fact-checking, plain-language field guidance, and demographic data trend narration. All AI prompts are guarded against prompt injection and cross-checked against official Gazette notifications.
