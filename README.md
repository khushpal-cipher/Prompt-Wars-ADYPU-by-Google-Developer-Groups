# Jan Ganana 2027 (जन गणना २०२७)
### India's First Fully Digital Census & Self-Enumeration Platform

Built for **Google for Developers × Hack2skill Hackathon** on **Census 2027 & Digital Enumeration**.

---

## 🏛️ Problem Statement & Mission
India's 16th National Census (Census 2027) is the historic first fully digital and paperless census for 1.4+ billion residents. Transitioning from paper questionnaires to digital self-enumeration requires:
1. Complete transparency on the **Two-Phase Operational Architecture** (Phase 1 HLO vs Phase 2 PE).
2. Transparent, state-wise survey schedules and snow-bound zone timelines.
3. Accessible, accessible **5-Step Digital Self-Enumeration** with instant QR Token generation.
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
- **🤖 Jan Ganana Sahayak (Gemini 2.5 AI Assistant)**: Floating global assistant providing real-time streaming answers grounded in official Census rules and gazette notifications, with automatic graceful offline knowledge degradation.
- **🌐 22 Scheduled Indian Languages**: Full UI localization switcher supporting Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Odia, Punjabi, Assamese, Urdu, etc.

---

## 🛠️ Technology Stack
- **Framework**: Next.js 15 (App Router, Server Components + Route Handlers)
- **Runtime**: React 19, TypeScript 5.x Strict (`strict: true`, zero `any`)
- **Styling**: Tailwind CSS + Custom National Design System (#1B2A6B Deep Indigo, #FF8A3D Saffron, #0E7C57 India Green)
- **Data Visualization**: Recharts 2.x
- **Validation**: Zod 3.x
- **Generative AI**: `@google/genai` (Google Gemini 2.5 Flash with fallback to Gemini 2.0 Flash)
- **Icons**: `lucide-react`

---

## 🔒 Privacy & Architecture Guarantees
- **No Database / Zero Server Storage**: Citizen self-enumeration drafts are stored strictly inside the user's browser `localStorage["jg27.draft"]` (with Safari private mode error wrapping).
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

5. **Type Check & Production Build**:
   ```bash
   npm run typecheck
   npm run build
   ```

---

## ⚖️ AI-Usage Disclosure
This platform uses **Google Gemini 2.5 Flash** via `@google/genai` for conversational Q&A, rumor claim fact-checking, plain-language field guidance, and demographic data trend narration. All AI prompts are guarded against prompt injection and cross-checked against official Gazette notifications.
