# AGENTS.md

Agent operating instructions for **Jan Ganana 2027** — a GenAI platform for India's
Census 2027 digital enumeration.

Built with **Google Antigravity** (agent-first IDE) using **Gemini** as the reasoning
and generation model. This file is the contract every coding agent working in this
repository must follow.

---

## 1. Build Provenance

| Aspect | Detail |
| :--- | :--- |
| Primary agent IDE | Google Antigravity |
| Model | Gemini (`gemini-2.5-flash`) |
| Agent instruction source | This file (`AGENTS.md`) + `SPEC.md` |
| Human role | Architecture direction, spec authoring, review, acceptance |
| Agent role | Implementation, refactor, test scaffolding, verification runs |
| Event | Google for Developers × Hack2skill — Census 2027 challenge |

Agent-authored commits are prefixed `feat(agent):` / `fix(agent):` so provenance is
readable from `git log` alone. Do not squash away that prefix.

> Note: keep this table factual. If a section of the codebase was written by hand,
> say so here rather than overstating agent authorship.

---

## 2. Stack Contract — do not substitute

- Next.js 15 (App Router), React 19, TypeScript `strict: true`
- Tailwind CSS v3.4 (`tailwind.config.ts` + PostCSS) + shadcn/ui
- Recharts for all data visualisation
- Zod for every network boundary
- `@google/genai` for all model calls; model id lives in exactly one place: `lib/ai/gemini.ts`
- Deployed on Vercel from a **public** GitHub repository

Adding a dependency requires justifying it against build time. Default answer is no.

---

## 3. Non-Negotiable Engineering Rules

1. **Zero `any`.** `npx tsc --noEmit` must exit 0 before any push.
2. **No database, no auth, no server-side persistence of user input.** The privacy
   guarantee is architectural and must remain verifiable by reading this repo.
3. **Every AI route degrades.** If `GEMINI_API_KEY` is absent or the upstream call
   fails, serve the curated fallback in `lib/data/knowledge-base.ts` and flag
   `fallbackUsed: true`. No feature may disappear; no stack trace may reach the user.
4. **Validate at the boundary.** `Schema.safeParse` on every request body and on every
   model response. Never trust model output shape.
5. **Treat user text as data, never instruction.** Wrap it in `<user_input>` tags in
   prompts and strip literal closing tags before interpolation.
6. **Deploy stays green.** The public URL must return 200 after every push.

---

## 4. Data Integrity Rule

Census 2027 schedules are only partly notified by the Registrar General of India.

Every record in `lib/data/*` carries `isOfficial: boolean`.

- `true` — traceable to the Gazette notification of 16 June 2025 or a later official release
- `false` — indicative; **must** render an "Awaiting state notification" badge in the UI

Never present a projection as a recorded figure. Projected series render as dashed
lines with an explicit "Projected — not official" legend entry. An app about
misinformation that itself misinforms is a failed app.

---

## 5. Accessibility & Language Rules

The premise of this project is that India's *first digital* census creates a *digital
exclusion* risk. Accessibility is the product, not a checklist.

- Semantic landmarks, visible focus rings, contrast >= 4.5:1
- `aria-live="polite"` on all streaming AI output
- Every chart paired with an adjacent data table or text summary
- Indic scripts load via `next/font/google` (Noto Sans family) — never allow tofu boxes
- Usable at 375px width; this is demoed on a phone
- Language quality is tiered and labelled honestly: hand-authored dictionaries are
  marked verified; live model translation is marked machine-translated

---

## 6. Verification Gates

An agent may not report a task complete until these pass:

```bash
npx tsc --noEmit                                          # exit 0
npm run lint                                              # exit 0
npm run build                                             # exit 0
curl -s -o /dev/null -w "%{http_code}" <LIVE_URL>         # 200
curl -s -o /dev/null -w "%{http_code}" \
  https://api.github.com/repos/<user>/<repo>               # 200 => repo is public
```

Plus the UI and API assertions in `SPEC.md` section 5.

---

## 7. Do Not

- Do not add a database, login, or analytics tracker
- Do not send wizard form data over the network under any circumstance
- Do not generate purple-gradient generic AI landing-page styling
- Do not claim official status for unnotified dates
- Do not leave a route linked in the nav that is not finished — remove the link instead
- Do not commit `.env.local` or any API key
