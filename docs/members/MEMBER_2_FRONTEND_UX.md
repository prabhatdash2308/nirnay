# NIRNAY — Member 2: Frontend / Product UX

> **Owner:** Aryan Gupta
> **Role:** Frontend / Product UX
> **Project:** NIRNAY
> **Team:** TATVAH
> **Primary Responsibility:** User experience, interface implementation, responsive design, and product presentation

---

# 1. Role Purpose

The Frontend / Product UX owner is responsible for turning the NIRNAY product concept into a clear, polished, responsive, and usable experience.

The goal is not simply to make screens look attractive.

The goal is to make the user's financial decision journey understandable.

The frontend should communicate:

```text
What is happening?
        ↓
Why does it matter?
        ↓
What should I do next?
```

---

# 2. Primary Ownership

The Frontend / Product UX owner owns:

```text
Application UI
Product UX
Navigation
Page Layouts
Responsive Design
Design System Implementation
Component Composition
Dashboard Experience
Discovery Experience
Comparison Experience
Recommendation Experience
Loading States
Empty States
Error States
Accessibility
Visual Polish
```

---

# 3. Primary Technologies

The frontend currently uses:

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
Base UI
Lucide icons where appropriate
```

The frontend should remain consistent with the project's established technology stack.

Do not introduce another UI framework without technical-lead approval.

---

# 4. Primary Documentation

The Frontend / Product UX owner should be familiar with:

```text
docs/PROJECT.md
docs/PRODUCT.md
docs/ARCHITECTURE.md
docs/TECH_STACK.md
docs/DESIGN_SYSTEM.md
docs/DEVELOPMENT.md
docs/GIT_WORKFLOW.md
docs/SECURITY.md
docs/TRUST_AND_DATA_POLICY.md
docs/QUALITY_STANDARDS.md
docs/TEAM.md
```

Especially:

```text
PRODUCT.md
DESIGN_SYSTEM.md
QUALITY_STANDARDS.md
```

---

# 5. Product UX Principle

Every screen should have a clear purpose.

Before building a page, answer:

1. Who is using it?
2. What are they trying to accomplish?
3. What information do they need?
4. What action should they take?
5. What happens after that action?

If these questions cannot be answered, the page probably needs better product definition before implementation.

---

# 6. NIRNAY Core User Journey

The frontend should support the core loop:

```text
DISCOVER
   ↓
COMPARE
   ↓
DECIDE
   ↓
MANAGE
   ↓
OPTIMIZE
```

And eventually:

```text
TRACK
   ↓
DETECT
   ↓
COMPARE
   ↓
RECOMMEND
   ↓
ACT
   ↓
TRACK
```

The UI should make this loop feel natural.

---

# 7. Primary Application Areas

The frontend will progressively implement:

```text
Landing
Authentication
Onboarding
Financial Profile
Dashboard
Discover
Compare
Recommend
Portfolio
Goals
Watchlist
Alerts
Calendar
Profile
Settings
```

Do not build every route as a placeholder merely to populate navigation.

A route should become visible when its experience is sufficiently meaningful.

---

# 8. Application Shell

The application shell establishes the foundation for authenticated users.

It should include:

- navigation
- header
- user menu
- page container
- responsive layout
- consistent spacing
- application-level loading behavior
- notification handling where appropriate

The shell should feel like one product across all pages.

---

# 9. Navigation

Navigation should clearly communicate:

- current section
- available sections
- important actions
- user context

Avoid excessive navigation items.

Prioritize the user's primary financial workflow.

Potential structure:

```text
Dashboard

Discover
Compare

Portfolio
Goals

Watchlist
Alerts
Calendar

Profile
Settings
```

The exact structure may evolve with the product.

---

# 10. Dashboard UX

The dashboard should answer:

> **"What should I pay attention to right now?"**

It should not simply become a collection of cards.

Potential hierarchy:

```text
Financial Snapshot
       ↓
Important Alerts
       ↓
Goals / Progress
       ↓
Insurance
       ↓
Investments
       ↓
Recommended Actions
```

The most important information should appear first.

---

# 11. Dashboard Cards

Every dashboard card should communicate something useful.

A card should ideally contain:

```text
Context
Value
Meaning
Action
```

Avoid decorative cards with no actionable or informative purpose.

---

# 12. Financial Profile UX

The financial profile should feel approachable.

Do not overwhelm the user with a giant financial questionnaire.

Prefer progressive collection:

```text
Basic Context
      ↓
Financial Situation
      ↓
Protection
      ↓
Investments
      ↓
Goals
```

Only ask for information that has a meaningful product purpose.

---

# 13. Onboarding

Onboarding should establish enough context for NIRNAY to become useful quickly.

The experience should:

- explain why information is requested
- minimize unnecessary questions
- show progress
- validate inputs
- allow correction
- save safely
- avoid making the user feel interrogated

---

# 14. Financial Input UX

Financial fields should make units obvious.

Examples:

```text
₹60,000 / month
₹15,000 / year
₹5,000 / month
```

Avoid ambiguous fields such as:

```text
Amount: ______
```

when the user needs to know:

- currency
- frequency
- period

---

# 15. Product Discovery UX

Discovery should help users find relevant products rather than overwhelm them with a catalog.

Recommended hierarchy:

```text
Need
 ↓
Category
 ↓
Filters
 ↓
Products
 ↓
Product Details
```

Examples:

```text
Health Insurance
Motor Insurance
Life Insurance
Mutual Funds / SIP
```

---

# 16. Product Cards

Product cards should prioritize important information.

Potential structure:

```text
Product Name
Provider
Category

Key Feature
Price / Premium where verified
Important limitation

Trust Metadata

[View Details]
[Compare]
```

Do not overload cards with every available field.

---

# 17. Product Details

A product detail page should help the user understand the product before comparing or deciding.

Potential sections:

```text
Overview
Key Features
Coverage / Benefits
Limitations / Exclusions
Pricing
Suitability Context
Source
Last Updated
```

Information that is unavailable should be clearly marked as unavailable.

Do not fill missing information with guesses.

---

# 18. Comparison UX

Comparison is one of the most important NIRNAY experiences.

The user should be able to understand:

```text
What is better?
What is different?
What does each option cost?
What trade-offs exist?
```

Comparison should prioritize differences rather than simply repeating identical information.

---

# 19. Comparison Layout

Desktop may use:

```text
             Product A   Product B   Product C

Premium         ₹X          ₹Y          ₹Z
Coverage        ...         ...         ...
Feature         ✓           ✓           —
Exclusion       ...         ...         ...
```

Mobile may require:

- stacked comparison
- horizontal scrolling
- prioritized fields
- expandable sections

The mobile design must remain usable.

---

# 20. Recommendation UX

The recommendation experience should not feel like:

```text
AI says:
BUY THIS.
```

Instead:

```text
Recommended Option

Why it fits you
----------------
Reason 1
Reason 2
Reason 3

Trade-offs
----------
...

Alternatives
------------
...

Data / Trust
------------
Source
Last Updated
```

The user should remain in control.

---

# 21. Recommendation Hierarchy

Recommended visual hierarchy:

```text
Recommendation
      ↓
Why
      ↓
Trade-offs
      ↓
Alternatives
      ↓
Important assumptions
      ↓
Source / freshness
```

Do not bury important limitations below decorative content.

---

# 22. AI UI

AI should feel like an intelligent assistant integrated into NIRNAY rather than an unrelated chatbot.

Good AI experiences include:

- explanation
- contextual help
- recommendation reasoning
- comparison summaries
- financial terminology explanations

Avoid making the entire product dependent on a chat interface.

---

# 23. AI Response UX

AI responses should support:

```text
Answer
 ↓
Reasoning / Explanation
 ↓
Relevant Facts
 ↓
Suggested Next Action
```

Where appropriate, distinguish AI-generated explanations from verified data.

---

# 24. Trust UX

Trust must be visible without becoming visually noisy.

Useful patterns include:

```text
Verified
User Provided
Calculated
AI Generated

Source: ...
Updated: ...
```

The user should be able to understand what kind of information they are seeing.

---

# 25. Trust Visual Hierarchy

Trust information should be accessible but should not overpower the primary decision.

Recommended hierarchy:

```text
Primary Financial Information
        ↓
Recommendation / Action
        ↓
Important Trade-offs
        ↓
Trust Metadata
```

For high-risk or important claims, trust information may need stronger emphasis.

---

# 26. Loading States

Every asynchronous experience needs appropriate feedback.

Examples:

```text
Loading dashboard...
Loading products...
Comparing...
Generating recommendation...
Saving policy...
Updating goal...
```

Avoid blocking the entire application when only one section is loading.

Prefer localized loading states where practical.

---

# 27. Skeleton Loading

Skeletons may be used for predictable content layouts.

They should resemble the eventual content structure.

Do not use skeletons simply for decoration.

---

# 28. Empty States

Example:

```text
No insurance policies yet.

Add your current policy to keep your
coverage organized and receive renewal reminders.

[Add Policy]
```

A useful empty state provides:

```text
Explanation
+
Context
+
Next Action
```

---

# 29. Error States

Example:

```text
We couldn't load your policies.

Please try again.

[Retry]
```

Avoid showing raw backend/database errors.

---

# 30. Forms

Forms should:

- have clear labels
- validate inputs
- show errors near the relevant field
- preserve user input when possible
- show submission state
- prevent accidental duplicate submissions

Example:

```text
Monthly SIP
₹ _______

Frequency
[ Monthly â–¼ ]

[Save Investment]
```

---

# 31. Destructive Actions

Actions such as:

- deleting a policy
- removing an investment
- deleting a goal

should require appropriate confirmation.

Use clear language.

Bad:

```text
Are you sure?
```

Better:

```text
Delete this insurance policy?

This will remove it from your NIRNAY financial dashboard.

[Cancel] [Delete Policy]
```

---

# 32. Responsive Design

Design from the smallest practical viewport upward.

Important layouts must support:

```text
Mobile
Tablet
Desktop
```

Do not simply shrink desktop interfaces until they technically fit.

Mobile may require a different information hierarchy.

---

# 33. Mobile Navigation

On mobile:

- avoid oversized navigation
- prioritize primary actions
- use appropriate bottom navigation or compact menus where suitable
- keep important actions reachable
- prevent horizontal overflow

---

# 34. Accessibility

Frontend implementation should use:

- semantic HTML
- accessible labels
- keyboard navigation
- visible focus states
- meaningful button names
- appropriate heading hierarchy
- sufficient contrast
- accessible dialogs
- accessible form controls

Do not use ARIA as a replacement for semantic HTML.

---

# 35. Keyboard Navigation

Important workflows should be usable without a mouse.

Test:

```text
Tab
Shift + Tab
Enter
Space
Escape
Arrow keys where appropriate
```

Especially for:

- menus
- dialogs
- forms
- filters
- comparison controls

---

# 36. Component Strategy

Before creating a component:

1. search existing components
2. determine whether it already exists
3. reuse where appropriate
4. extend if necessary
5. create a new component only when justified

Avoid duplicate primitives.

---

# 37. Component Boundaries

Components should have clear responsibilities.

Avoid:

```text
MassiveDashboard.tsx
```

containing:

- database queries
- financial calculations
- AI calls
- authentication
- every dashboard section
- all rendering

Prefer composition:

```text
Dashboard
â”œâ”€â”€ FinancialSummary
â”œâ”€â”€ AlertsSection
â”œâ”€â”€ GoalsSection
â”œâ”€â”€ InsuranceSection
â”œâ”€â”€ InvestmentSection
â””â”€â”€ RecommendationSection
```

---

# 38. Client vs Server Components

Use client components when interaction/state requires them.

Do not automatically mark entire pages:

```tsx
"use client";
```

if only a small interactive portion needs client-side behavior.

Keep server-side work server-side where appropriate.

Coordinate with the Technical Lead when the boundary is unclear.

---

# 39. Data Fetching

Frontend should not bypass established backend/security architecture.

Do not directly expose privileged credentials.

Follow the project's established:

```text
Authentication
Authorization
Supabase
RLS
API
```

architecture.

---

# 40. Mock Data

Mock data is acceptable during parallel development.

When using mock data:

- clearly identify it
- keep its shape compatible with real data
- avoid fake claims presented as real
- replace it before production where necessary

Example:

```ts
const demoProducts = [...]
```

is acceptable for development.

Do not present fabricated product statistics as verified facts.

---

# 41. Financial Number Formatting

Use consistent formatting.

Examples:

```text
₹60,000
₹15,000 / year
₹5,000 / month
```

Avoid inconsistent styles across screens.

Financial numbers should be easy to scan.

---

# 42. Percentage Formatting

Use consistent precision.

For example:

```text
12.5%
```

instead of inconsistent values such as:

```text
12.500000%
```

unless additional precision is meaningful.

Do not imply false precision.

---

# 43. Dates

Use readable financial dates.

Example:

```text
Renewal: 15 April 2027
```

rather than forcing users to interpret:

```text
2027-04-15T00:00:00Z
```

The underlying data may remain machine-readable.

---

# 44. Tables

Tables should be used when comparison or structured scanning benefits from them.

Use:

- clear headers
- aligned numbers
- consistent spacing
- responsive behavior
- sorting/filtering only when useful

Do not force large tables onto small screens without a mobile strategy.

---

# 45. Charts

Charts should communicate a clear insight.

Before adding a chart, ask:

> What decision does this chart help the user make?

Examples:

```text
Goal progress
Portfolio allocation
Upcoming financial events
```

Avoid decorative charts.

---

# 46. Design Consistency

All pages should feel like they belong to NIRNAY.

Maintain consistency in:

- typography
- spacing
- border radius
- buttons
- cards
- forms
- icons
- colors
- states
- motion

See:

```text
docs/DESIGN_SYSTEM.md
```

---

# 47. No Frankenstein UI

Do not combine unrelated visual systems.

Avoid a page containing:

```text
Library A buttons
+
Library B cards
+
Custom modal
+
Random icon set
+
Different typography
```

Prefer the established NIRNAY design system.

---

# 48. Visual Hierarchy

Every page should have a clear hierarchy:

```text
Page Purpose
     ↓
Primary Information
     ↓
Primary Action
     ↓
Secondary Information
     ↓
Supporting Details
```

Do not make every element visually loud.

---

# 49. CTA Design

Every important screen should have an obvious primary action.

Examples:

```text
Compare Products
Add Policy
Create Goal
Review Recommendation
Add Investment
```

Avoid multiple competing primary CTAs unless the product context requires them.

---

# 50. Product Copy

UI text should be:

- concise
- clear
- human
- action-oriented
- financially responsible

Avoid unnecessarily technical language.

Bad:

```text
Execute CRUD mutation.
```

Good:

```text
Save Policy
```

---

# 51. Financial Trust Copy

Avoid absolute language.

Bad:

```text
Best insurance for you.
```

Prefer:

```text
Best fit based on the information you provided.
```

Bad:

```text
Guaranteed savings.
```

Prefer:

```text
Potential savings based on the available information.
```

The exact wording should reflect the actual evidence.

---

# 52. Recommendation Labels

Avoid presenting model output as absolute truth.

Prefer:

```text
Recommended for your profile
```

rather than:

```text
The objectively best option
```

when the recommendation depends on user preferences or incomplete information.

---

# 53. Error Prevention

Frontend should prevent invalid actions when possible.

Examples:

- disable submit while saving
- validate dates
- validate amounts
- prevent duplicate clicks
- prevent impossible combinations
- warn before destructive actions

---

# 54. Optimistic UI

Use optimistic updates only when the operation is safe to reverse or failure can be handled clearly.

For important financial records, prefer correctness over perceived speed.

---

# 55. Performance

Frontend performance priorities:

- avoid unnecessary client-side JavaScript
- minimize unnecessary rerenders
- avoid duplicate requests
- optimize images
- lazy-load heavy UI
- keep initial pages focused
- avoid unnecessary dependencies

Do not sacrifice readability for micro-optimizations.

---

# 56. Frontend Testing

At minimum, manually verify:

```text
Authentication
Navigation
Dashboard
Forms
Comparison
Recommendation
Responsive layouts
Loading states
Empty states
Error states
```

Critical interactive components should receive stronger automated testing where practical.

---

# 57. Browser Testing

Before final demo, test the application in the primary supported browser environment.

Also test:

- responsive mobile viewport
- desktop viewport
- keyboard interaction
- authentication flow
- refresh behavior
- navigation after login

---

# 58. Frontend Security

Never place secrets in frontend code.

Never expose:

```text
Firebase Admin credentials
Supabase secret key
AI API keys
Database passwords
```

The frontend should only receive information appropriate for the authenticated user.

---

# 59. User Data Isolation

Frontend must never assume that hiding another user's data is sufficient.

Security must be enforced through:

```text
Authentication
+
Authorization
+
RLS
```

UI filtering is not a security mechanism.

---

# 60. Collaboration with Backend

Aryan should communicate backend requirements clearly.

Example:

```text
FRONTEND REQUIREMENT

Screen:
Comparison

Needs:
Product name
Provider
Premium
Coverage
Exclusions
Source
Last updated

Preferred response:
Structured product comparison object
```

This helps Sarvesh implement the correct data contract.

---

# 61. Collaboration with AI

When Ananya provides AI functionality, Aryan should focus on how it is presented.

Frontend should clearly distinguish:

```text
Verified Facts
Calculated Results
AI Explanation
Recommendation
```

Do not visually present AI-generated text as if it were verified database information.

---

# 62. Collaboration with Technical Lead

Consult Prabhat when a frontend change affects:

- authentication
- routing architecture
- server/client boundaries
- environment variables
- API architecture
- shared infrastructure
- security
- deployment
- major dependencies

Do not wait until after implementation to raise architectural concerns.

---

# 63. Collaboration with Backend

Consult Sarvesh when:

- new database fields are needed
- new financial entities are needed
- API responses need changes
- validation rules depend on backend logic
- calculations are required

Do not create frontend assumptions that conflict with the database model.

---

# 64. Frontend Branch Strategy

Use a dedicated feature branch.

Examples:

```text
feature/frontend-shell
feature/dashboard-ui
feature/discovery-ui
feature/comparison-ui
feature/profile-ui
```

Follow:

```text
docs/GIT_WORKFLOW.md
```

---

# 65. Frontend Commit Standards

Use focused commits.

Examples:

```text
feat: add authenticated dashboard shell
feat: add financial profile form
feat: add product discovery interface
feat: add product comparison view
fix: handle empty policy state
fix: improve mobile navigation
```

Avoid unrelated changes in the same commit.

---

# 66. Frontend Pull Request Checklist

Before opening a PR:

```text
[ ] UI requirement completed
[ ] Responsive behavior checked
[ ] Loading state handled
[ ] Empty state handled
[ ] Error state handled
[ ] Accessibility checked
[ ] Existing design system reused
[ ] No unrelated files changed
[ ] No secrets added
[ ] npm run lint passes
[ ] npm run build passes
```

---

# 67. Visual Review Checklist

Before marking a UI feature complete:

### Layout

- [ ] spacing consistent
- [ ] alignment correct
- [ ] hierarchy clear

### Typography

- [ ] headings consistent
- [ ] body text readable
- [ ] financial values prominent

### Components

- [ ] buttons consistent
- [ ] cards consistent
- [ ] forms consistent
- [ ] dialogs consistent

### Responsive

- [ ] mobile
- [ ] tablet
- [ ] desktop

### States

- [ ] loading
- [ ] empty
- [ ] error
- [ ] success

---

# 68. Competition Priority

During the two-day sprint, prioritize:

```text
1. Application Shell
2. Dashboard
3. Financial Profile
4. Discovery
5. Comparison
6. Recommendation UI
7. Management UI
8. Responsive Polish
9. Animation / Visual Polish
```

Do not spend large amounts of time polishing a page that is not part of the demo journey.

---

# 69. Competition Demo Path

The primary frontend demo should support:

```text
Landing
 ↓
Login
 ↓
Profile
 ↓
Dashboard
 ↓
Discover
 ↓
Compare
 ↓
Recommendation
 ↓
Manage
 ↓
Track / Alert
```

The UI should make transitions between these stages obvious.

---

# 70. Frontend Definition of Done

A frontend feature is complete when:

```text
Design
+
Implementation
+
Responsive Layout
+
Interaction
+
Loading State
+
Empty State
+
Error State
+
Accessibility
+
Data Integration
+
Trust Presentation
+
Lint
+
Build
```

are appropriately handled.

---

# 71. Frontend Anti-Patterns

Avoid:

### Giant components

One file containing the entire product page.

### Magic values

Random spacing, colors, or sizes that contradict the design system.

### UI-only security

Hiding data instead of enforcing authorization.

### Fake financial data

Presenting mock values as verified facts.

### Overloaded dashboards

Showing everything instead of prioritizing what matters.

### Chatbot-first design

Turning every product interaction into a chat.

### Excessive animation

Making the product feel slower or distracting.

---

# 72. Frontend Success Criteria

The frontend succeeds when a user can quickly understand:

```text
Where am I?
What does NIRNAY know?
What matters?
What are my options?
Why is something recommended?
What can I do next?
```

The interface should reduce financial complexity rather than add visual complexity.

---

# 73. Final Frontend Principle

The frontend is not decoration.

It is the layer that translates NIRNAY's intelligence into user understanding.

The ideal experience is:

```text
Complex Financial Data
        ↓
Clear Information
        ↓
Meaningful Comparison
        ↓
Understandable Recommendation
        ↓
Confident User Action
```

**Make complex financial decisions feel clear, trustworthy, and actionable.**
```
