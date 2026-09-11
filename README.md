# NIRNAY

An AI-powered financial protection and investment copilot.

## Overview

NIRNAY is an AI-powered financial protection and investment copilot. 

Our core user journey is simple but powerful:
**Discover → Compare → Decide → Manage → Optimize**

We also incorporate a continuous intelligence loop to serve the user long-term:
**Track → Detect → Compare → Recommend → Act → Track**

## Problem

People face fragmented financial products, complex terminology, difficulty comparing suitability, and limited continuity after a decision. Traditional aggregators focus on lead generation and one-off transactions, leaving users overwhelmed and unsupported post-purchase.

## Solution

NIRNAY solves this by combining:
- A personalized financial profile baseline
- Deterministic financial calculations
- Intuitive product discovery
- Side-by-side comparison
- Suitability and decision support
- AI explanation that translates complex math into human terms
- Financial management tools to track renewals and goals

## Key Features

- **Firebase authentication:** Secure identity management.
- **Financial profile onboarding:** Captures income, budgets, and risk profile.
- **Insurance/investment product discovery:** Browse health, motor, term life, SIP, and mutual funds.
- **Comparison:** Side-by-side feature and cost comparison.
- **Suitability/decision support:** Heuristic scoring based on the user's specific profile.
- **AI explanations:** Generative AI translates mathematical trade-offs without hallucinating.
- **Portfolio management:** Track active policies and investments.
- **Goals:** Map out and track financial objectives.
- **Financial calendar:** Manage upcoming renewals and premium schedules.
- **Watchlist:** Save products for later review.
- **Financial engine:** The deterministic core that drives all suitability calculations.

## How NIRNAY Works

The architecture follows a strict, safe flow:
**User Financial Profile → Financial Engine → Discover → Compare → Decide → AI Explanation → Manage**

We clearly distinguish between deterministic calculations (which handle the authoritative math) and AI-generated explanations (which translate that math into readable summaries).

## AI & Trust Model

- AI is primarily an **explainability layer**.
- Deterministic application logic performs all financial calculations and suitability scoring.
- Structured schemas heavily constrain the AI's output.
- The AI is structurally prevented from inventing product facts.
- No guaranteed returns or guaranteed savings claims are made.

## Marketplace Data Disclaimer

**The current insurance and investment marketplace catalogue uses simulated reference/demo data for this prototype. Product details, prices, returns and availability are not live offers.**

## Security

NIRNAY uses a robust, isolated security architecture:
- **Firebase Authentication** handles identity.
- A **Firebase custom role claim** bridges identity safely to the database.
- **Supabase integration** manages the PostgreSQL data layer.
- **Row Level Security (RLS)** enforces strict user-level data isolation.
- All data mutations occur through authenticated Next.js **Server Actions**.

## Technology Stack

- **Next.js 16.3.4** (App Router)
- **React 19.2.8**
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui / Base UI**
- **Firebase Authentication**
- **Supabase**
- **Vitest**

## Project Structure

- `app/` — Next.js routes, Server Actions, and API endpoints
- `components/` — Reusable React UI components
- `lib/` — Financial engine, AI foundation, types, and deterministic calculations
- `docs/` — Extensive architectural, product, and integration documentation
- `supabase/` — Database migrations and RLS policies

## Local Development

1. Clone the repository and run:
   ```bash
   npm install
   ```
2. Configure your environment variables. You will need:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, etc.
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (for the API backend)
   - `GEMINI_API_KEY` / `GROQ_API_KEY`
   
   *IMPORTANT: Firebase service-account credentials must remain private and must NOT be committed to the repository.*
3. Start the development server:
   ```bash
   npm run dev
   ```

## Validation

The current application state enforces strict validation:
- **ESLint**: Clean
- **TypeScript**: Clean (`tsc --noEmit`)
- **Vitest**: Passing (Note: Three empty test suites exist as placeholders)
- **Production build**: Passing

*Note: NIRNAY is currently a competition/demo prototype, not a production-ready financial advisor.*

## Demo

**Recommended Flow:**
Landing → Authentication → Financial Profile → Dashboard → Discover → Compare → Decide → AI Explanation → Manage.

*(Note: The marketplace utilizes simulated data transparently during the demo).*

## Limitations / Prototype Scope

- Marketplace data is simulated/reference data.
- Production deployment would require authoritative live data integrations (via aggregator or direct insurer APIs).
- The current product is a prototype/demo.
- Transaction-level budgeting and bank integration are outside the current scope.

## Team

- **Prabhat (App Shell & UX):** High-fidelity UI, routing, Tailwind v4 configuration, and global integrations.
- **Sarvesh (Financial Engine):** Deterministic calculations, suitability logic, and Supabase database architecture.
- **Ananya (AI Foundation):** LLM integration, Zod schemas, prompt boundaries, and intent extraction.
- **Aryan (Frontend UI):** Baseline UI components and initial onboarding layouts.

## Documentation

For deep dives into the project's strategy and architecture, see the `docs/` directory:
- [PROJECT.md](docs/PROJECT.md)
- [PRODUCT.md](docs/PRODUCT.md)
- [ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [SECURITY.md](docs/SECURITY.md)
- [TRUST_AND_DATA_POLICY.md](docs/TRUST_AND_DATA_POLICY.md)
- [PHASE_STATUS.md](docs/PHASE_STATUS.md)
- [Integration Audits](docs/INTEGRATION/)
- [Demo Script](docs/DEMO/DEMO_SCRIPT.md)
