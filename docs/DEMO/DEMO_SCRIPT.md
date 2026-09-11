# NIRNAY Judge Demo Script

## Product One-Liner
"NIRNAY is an AI-powered financial protection and investment copilot that evaluates products against your unique financial profile, explaining complex deterministic math in simple, human terms."

## Demo Persona
**Rahul**
- Age: 27
- Monthly income: ₹60,000
- Monthly expenses: ₹30,000
- Annual insurance budget: ₹15,000
- Financial experience: Beginner
- Risk profile: Balanced
- Primary goals: Health insurance, Emergency fund, Retirement.

## Required Demo Data
**MUST PREPARE**
- A fresh Google Account (or Firebase Auth email/pass account) ready for the sign-up flow.
- A pre-configured returning user account (Rahul) with a completed financial profile, a saved health insurance policy in the portfolio, and an upcoming premium renewal in the calendar.

**NICE TO PREPARE**
- Two saved products in the Watchlist to demonstrate persistence.
- One active financial goal (e.g., "Emergency Fund") saved in the Manage section.

## 3-Minute Demo
*(Fast-paced, high impact)*
1. **Problem:** "Marketplaces push products. We start with the person." (Show Landing page).
2. **Personalization:** Sign in as Rahul. Show the Financial Profile and the Dashboard. 
3. **Discovery & Compare:** 
Go to Discover. Acknowledge the trust disclaimer. Select two health policies and hit Compare. 
4. **Explainability:** Show the deterministic score (e.g., "78/100"). Click "Explain Decision". Read the AI summary that translates math into human terms without hallucinating.
5. **Conclusion:** "Deterministic safety, generative explainability. That is NIRNAY."

## 5-Minute Demo
*(The Standard Competition Flow)*
1. **Problem:** Traditional aggregators rely on affiliate pushing; users are overwhelmed by jargon.
2. **Personalization:** Show the onboarding flow (Landing → Auth → Profile setup).
3. **Discovery:** Show the Discover catalogue. Clearly explain that the marketplace uses simulated data for safety, but the math is real.
4. **Comparison:** Select HDFC Ergo and Star Health. Compare them side-by-side. Point out the heuristic match score.
5. **Explainability (WOW Moment):** Trigger the AI Explanation. Highlight that the AI is bounded by a Zod schema—it explains *why* the deterministic engine ranked it higher, it doesn't invent financial advice.
6. **Management:** Save the policy. Navigate to the Portfolio and Calendar to show how a decision turns into active management (upcoming renewals).
7. **Trust:** Reiterate that NIRNAY doesn't sell data. RLS protects the database, and the AI is structurally prevented from giving rogue advice.

## 10-Minute Demo
*(Deep Dive / Q&A Focused)*
Follow the 5-Minute flow, then expand on:
- **Architecture:** Discuss Next.js App Router, Server Actions, and Turbopack.
- **Security:** Show or explain how Firebase JWTs are mapped to Supabase Custom Claims, proving strict user isolation via RLS.
- **Deterministic Engine:** Explain how `computeSuitability()` works in the background before the AI even sees the data.
- **Trust Model:** Discuss why budgeting/transaction scraping was intentionally excluded to prevent scope creep and maintain high trust.

## Click-by-Click Flow
1. **Landing**
   - Route: `/`
   - Action: Scroll hero, click "Get Started".
   - Say: "Most financial marketplaces start with a product. NIRNAY starts with the person."
2. **Auth**
   - Route: `/auth`
   - Action: Sign in via Google.
   - Say: "Authentication is securely handled by Firebase."
3. **Financial Profile**
   - Route: `/settings/financial-profile`
   - Action: Fill in Rahul's data (Income: 60k). Click Save.
   - Say: "We establish a financial baseline first to drive our deterministic engine."
4. **Dashboard**
   - Route: `/dashboard`
   - Action: Point out overview cards. Click "Explore Marketplace".
   - Say: "The dashboard is the central hub, completely isolated to the user."
5. **Discover**
   - Route: `/discover`
   - Action: Point out the "Simulated marketplace data" banner. Select two products for comparison.
   - Say: "Our catalogue relies on simulated data for this prototype, ensuring we don't accidentally mislead users with outdated live quotes."
6. **Compare**
   - Route: `/compare`
   - Action: Scroll through the side-by-side comparison. Point out the Match Score.
   - Say: "The engine runs deterministic math against Rahul's profile to generate a heuristic score."
7. **Decide / Explain**
   - Route: `/compare` (Click "Explain with AI")
   - Action: Wait for Groq/Gemini to stream the JSON explanation.
   - Say: "This is our AI explanation layer. It translates the math into human trade-offs without inventing facts."
8. **Manage**
   - Route: `/portfolio` -> `/calendar`
   - Action: Show the saved policy and the upcoming renewal in the calendar.
   - Say: "NIRNAY doesn't just help you buy; it helps you manage."

## Three WOW Moments
1. **The AI Explanation Bounded by JSON**
   - **Screen:** `/compare`
   - **Action:** Clicking "Explain with AI".
   - **Result:** A structured, neutral explanation appears based purely on math.
   - **Why it matters:** Proves we solved the AI hallucination problem in FinTech.
   - **Say:** "Notice how the AI doesn't say 'Buy this.' It simply translates the deterministic math into human trade-offs. It's an explainer, not a rogue advisor."

2. **The Discover Trust Banner**
   - **Screen:** `/discover`
   - **Action:** Pointing out the blue banner at the top.
   - **Result:** Immediate transparency about simulated data.
   - **Why it matters:** Judges look for ethical design. 
   - **Say:** "Because financial trust is paramount, we clearly disclose that our current catalogue is simulated for the prototype. We never fake live offers."

3. **The Portfolio & Calendar Integration**
   - **Screen:** `/calendar`
   - **Action:** Navigating from Portfolio to Calendar.
   - **Result:** Seeing the premium renewal mapped automatically.
   - **Why it matters:** Shows the "Manage" part of the product loop.
   - **Say:** "A transaction isn't the end of the journey. NIRNAY tracks your renewals so you never lapse on protection."

## Screens to Avoid
- **Avoid:** Empty states on the Dashboard (always use an account with some seeded portfolio/goals data to show the app's full potential).
- **Avoid:** Clicking randomly through 15 different product detail pages (it wastes time).
- **Avoid:** Settings/Profile edits mid-demo (it breaks the flow).

## Trust / Simulated Data Explanation
**Correct presentation:**
"For this prototype, we've populated the Discover catalogue with simulated, reference data. We did this intentionally to demonstrate our matching engine and AI safely, without implying these are live, guaranteed offers. The math evaluating the user's budget against the premium is real; the product pricing itself is a static reference."

## Technical Judge Questions
- **"What is actually AI here?"**
  - *Answer:* "The AI is an explainability layer. The actual product ranking and suitability score are 100% deterministic TypeScript math. We pass that math to Gemini/Groq via strict Zod schemas so it can explain the reasoning in plain English without hallucinating."
- **"Why isn't this just a comparison website?"**
  - *Answer:* "Comparison sites ask 'What do you want to buy?' NIRNAY asks 'Who are you?' We build a financial profile first, then contextualize the entire marketplace against your specific budget and goals."
- **"Where does the recommendation come from?"**
  - *Answer:* "Our deterministic engine (`computeSuitability()`). It evaluates coverage limits, premium-to-budget ratios, and risk profiles using heuristics."
- **"How is financial data protected?"**
  - *Answer:* "Firebase handles identity. Supabase handles data. We use a custom JWT claim bridge so that Supabase Row Level Security (RLS) physically prevents any query from accessing another user's rows."
- **"Is your marketplace data live?"**
  - *Answer:* "No, it is currently simulated reference data, clearly disclosed in the UI. For production, we would integrate with aggregator APIs or direct insurer APIs."

## Policybazaar / Competitor Question
**"How is this different from Policybazaar?"**
"Policybazaar is a transaction engine optimized for lead generation. Their loop is: Search → Compare → Buy → Sell your lead. 
NIRNAY is a copilot. Our loop is: Profile → Discover → Compare → Decide → **Manage**. We sit on the user's side of the table, helping them track renewals and suitability long after the point of sale."

## Failure Recovery
- **AI Explanation times out/fails:**
  - *Do:* Gracefully point out the deterministic score. 
  - *Say:* "If the LLM provider times out, the user still has our deterministic engine's heuristic score to rely on. The core application never breaks when AI fails."
- **Database fetch fails (Empty Portfolio):**
  - *Do:* Navigate to Discover.
  - *Say:* "It looks like my network connection dropped the Supabase fetch, but let me show you how we evaluate products in the meantime."

## Demo-Day Checklist
**MUST PREPARE**
- [ ] Fresh Firebase account for the "New User" flow.
- [ ] Seeded "Rahul" account with a completed profile.
- [ ] Seeded "Rahul" account with 1 Health Policy in the portfolio.
- [ ] Local environment running (`npm run build && npm run start`).
- [ ] Internet connection verified for Firebase/Supabase/AI APIs.

**NICE TO PREPARE**
- [ ] Secondary browser profile (Incognito) ready for the fresh account.

## Demo-Day Rules
1. Don't type unnecessarily during the demo (use pre-filled profiles where possible).
2. Don't explore unknown screens or try edge cases live.
3. Don't claim simulated data is live.
4. Don't promise future functionality without qualifying it as "post-prototype."
5. Keep the judge focused on the core loop (Discover → Compare → Decide → Manage).
6. Never apologize for a bug; smoothly pivot to the fallback explanation.
7. Don't mention the budgeting/transactions feature that was scoped out.
8. Keep your hands off the mouse while talking to avoid distracting cursor movement.
9. End on the dashboard to show a "complete" loop.
10. Respect the time limit strictly.

## Final Closing Statement
"NIRNAY proves that FinTech doesn't have to be a choice between dangerous AI hallucinations and confusing spreadsheet aggregators. By layering generative AI *over* deterministic math, we've built a copilot that is safe, personalized, and truly on the user's side. Thank you."
