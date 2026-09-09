# NIRNAY — Design System

> **NIRNAY — Your Financial Protection & Investment Copilot**

**Document type:** Product Design System & UX Standards
**Status:** MVP / Active Development
**Audience:** Product, UX, Frontend, Technical Lead, AI Coding Agents
**Authority:** Shared visual and interaction standard

---

# 1. Purpose

This document defines the visual language, interaction principles, component standards, and UX rules for NIRNAY.

The goal is to ensure that:

- every screen feels like part of the same product
- the interface communicates trust
- financial information is easy to understand
- important decisions receive appropriate visual hierarchy
- the application feels modern and premium
- the UI remains consistent across contributors
- AI-generated frontend code follows the same design language

The design system is not intended to prevent creativity.

It exists to prevent inconsistency.

---

# 2. Design North Star

NIRNAY should feel:

> **Calm. Intelligent. Trustworthy. Modern. Clear. Premium.**

It should feel like a serious financial product.

It should not feel like:

- a generic SaaS dashboard
- a crypto trading interface
- a casino
- a gaming application
- a generic AI chatbot
- a collection of template components
- an overly futuristic concept demo

---

# 3. Core Design Principle

The UI should reduce financial complexity rather than add visual complexity.

The interface should answer:

1. What am I looking at?
2. Why does it matter?
3. What should I do next?

A screen that looks impressive but makes those questions harder to answer is not a successful design.

---

# 4. Design Priorities

When visual decisions conflict, prioritize:

```text
1. Clarity
2. Trust
3. Hierarchy
4. Usability
5. Accessibility
6. Consistency
7. Visual polish
8. Decorative effects
```

Never sacrifice clarity for aesthetics.

---

# 5. Design Language

NIRNAY's visual language should combine:

```text
Fintech
   +
Editorial clarity
   +
Modern product design
   +
Subtle intelligence
```

The product should communicate confidence without becoming visually aggressive.

---

# 6. Visual Personality

The interface should communicate:

### Trust

Through:

- clean hierarchy
- restrained color usage
- transparent information
- source indicators
- predictable interactions

### Intelligence

Through:

- useful insights
- clear comparisons
- contextual recommendations
- meaningful data visualization
- concise explanations

### Simplicity

Through:

- progressive disclosure
- focused screens
- limited simultaneous actions
- clear labels

### Premium Quality

Through:

- consistent spacing
- typography
- careful alignment
- polished states
- deliberate interactions

---

# 7. Design System Hierarchy

The UI should be built in layers:

```text
Design Tokens
     ↓
UI Primitives
     ↓
Shared Components
     ↓
Domain Components
     ↓
Page Layouts
     ↓
Application Experience
```

Example:

```text
Button
  ↓
Action Button
  ↓
Compare Button
  ↓
Product Card
  ↓
Discover Page
```

Do not skip directly from page to random one-off styling.

---

# 8. Existing UI Foundation

NIRNAY uses:

- Tailwind CSS v4
- shadcn/ui
- Base UI
- Lucide-style iconography where appropriate

The existing component foundation should be reused.

Do not introduce a second component system without explicit justification.

---

# 9. Component Philosophy

Components should be:

- reusable
- composable
- accessible
- predictable
- focused
- visually consistent

Avoid giant components that contain:

- data fetching
- business logic
- financial calculations
- AI logic
- UI rendering
- unrelated state

all in one file.

---

# 10. Design Tokens

Where practical, shared visual decisions should be represented through reusable design tokens rather than repeated arbitrary values.

Relevant token categories include:

```text
Color
Typography
Spacing
Radius
Shadow
Border
Motion
Layout
Breakpoints
```

The exact implementation belongs in the application styling system.

---

# 11. Color Philosophy

NIRNAY should use a restrained color system.

Color should communicate:

- hierarchy
- status
- action
- attention
- success
- warning
- error

Do not use color simply because a component feels empty.

---

# 12. Primary Color

NIRNAY should have one recognizable primary accent.

The exact final color may be refined during implementation.

The primary color should be used primarily for:

- primary actions
- selected states
- links where appropriate
- important highlights
- active navigation

Do not cover the entire interface in the primary accent.

---

# 13. Neutral Colors

Neutral colors should provide the majority of the interface.

Use neutral tones for:

- page backgrounds
- cards
- borders
- secondary text
- dividers
- navigation surfaces

The interface should have enough contrast without feeling visually heavy.

---

# 14. Semantic Colors

Semantic colors should have consistent meaning.

### Success

Use for:

- completed actions
- positive status
- successful operations

### Warning

Use for:

- attention-required states
- upcoming deadlines
- caution

### Error

Use for:

- failed operations
- invalid inputs
- critical problems

### Informational

Use for:

- contextual explanations
- neutral guidance
- educational information

Never use semantic colors inconsistently.

---

# 15. Color Accessibility

Color must never be the only way information is communicated.

For example, do not rely only on:

```text
green = good
red = bad
```

Also provide:

- labels
- icons
- text
- patterns
- status indicators

---

# 16. Typography

Typography should prioritize readability.

The hierarchy should clearly distinguish:

```text
Display
Page Title
Section Title
Card Title
Body
Secondary Text
Caption
Metadata
```

Do not use many unrelated font sizes.

---

# 17. Typography Hierarchy

A typical hierarchy:

```text
Display
   ↓
H1 / Page Title
   ↓
H2 / Section
   ↓
H3 / Component
   ↓
Body
   ↓
Secondary
   ↓
Caption
```

The exact sizes should be implemented through the project's styling tokens.

---

# 18. Financial Number Typography

Important financial values should have strong visual hierarchy.

Examples:

```text
₹60,000
₹15,000 / year
₹10,000 / month
₹3,00,000 target
```

Financial values should be:

- readable
- aligned
- consistently formatted
- easy to scan

Avoid excessive decorative typography.

---

# 19. Currency Formatting

The primary MVP currency is INR.

Use:

```text
₹
```

for user-facing Indian financial values.

Formatting should be consistent.

Examples:

```text
₹60,000
₹1,20,000
₹3,00,000
```

Do not inconsistently mix:

```text
60000
60K
₹60k
₹60,000
```

within the same visual context.

---

# 20. Spacing

Use a consistent spacing system.

Prefer a small number of reusable spacing increments.

Spacing should establish:

- grouping
- hierarchy
- rhythm
- readability

Avoid arbitrary margins added only to fix one screen.

---

# 21. Layout

The application should use a consistent layout system.

Typical structure:

```text
Application Shell
â”œâ”€â”€ Navigation
â””â”€â”€ Main Content
    â”œâ”€â”€ Page Header
    â”œâ”€â”€ Primary Content
    â””â”€â”€ Supporting Content
```

Pages should align to a consistent content width.

---

# 22. Responsive Layout

NIRNAY must support:

- desktop
- laptop
- tablet
- mobile

Responsive behavior should be intentional.

Do not simply allow desktop layouts to overflow on mobile.

---

# 23. Mobile Principle

On smaller screens:

```text
Complex Desktop Layout
        ↓
Prioritize
        ↓
Essential Information
        ↓
Primary Action
```

Do not attempt to fit every desktop element onto a phone.

---

# 24. Cards

Cards are useful for grouping related information.

Use cards for:

- financial summaries
- product previews
- policies
- investments
- goals
- alerts
- recommendations

A card should represent one coherent concept.

---

# 25. Card Rule

Avoid:

```text
Card
 â”œâ”€â”€ Card
 â”‚    â”œâ”€â”€ Card
 â”‚    â””â”€â”€ Card
 â””â”€â”€ Card
```

Excessive nesting makes the interface visually noisy.

Use whitespace and sections instead.

---

# 26. Product Cards

A product card should answer:

> "What is this, and why might I care?"

Typical content:

```text
Provider
Product Name
Category
Key Attribute
Important Metric
Suitability / Relevance
Primary Action
```

Do not display every available data field.

---

# 27. Product Detail Layout

A product details page may use:

```text
Product Header
     ↓
Overview
     ↓
Key Facts
     ↓
Benefits / Features
     ↓
Costs
     ↓
Eligibility
     ↓
Limitations
     ↓
Why It May Fit
     ↓
Source / Verification
     ↓
Actions
```

The order may vary based on product type.

---

# 28. Comparison Design

Comparison is one of NIRNAY's most important experiences.

It should make differences immediately understandable.

Preferred structure:

```text
Product A       Product B
   â”‚               â”‚
   â”œâ”€â”€â”€â”€ Facts â”€â”€â”€â”€â”¤
   â”œâ”€â”€ Differences â”¤
   â”œâ”€â”€ Trade-offs â”€â”¤
   â”” Recommendation
```

---

# 29. Comparison Table

A comparison table should:

- use consistent rows
- align values
- highlight meaningful differences
- avoid unnecessary columns
- support responsive behavior

Do not use visual highlighting to imply superiority unless the underlying logic supports it.

---

# 30. Comparison Highlighting

Useful highlighting includes:

- better fit for user's stated requirement
- lower cost
- relevant benefit
- missing information
- important difference

Avoid misleading labels such as:

> "BEST"

unless there is a clearly defined and defensible basis for that label.

Prefer:

> "Better fit for your profile"

when the recommendation engine supports that conclusion.

---

# 31. Recommendation Card

A recommendation should visually distinguish:

```text
Recommendation
     ↓
Why
     ↓
Strengths
     ↓
Trade-offs
     ↓
Alternatives
```

The user should understand the result without reading a long paragraph.

---

# 32. Recommendation Visual Language

A recommendation should feel informative, not promotional.

Avoid:

- excessive green
- sales-like badges
- fake urgency
- "guaranteed" language
- aggressive CTAs

Prefer:

- calm emphasis
- evidence
- concise reasoning
- visible trade-offs

---

# 33. Trust Indicator

Financial/product information may include a subtle trust indicator.

Possible structure:

```text
✓ Verified
Source: Provider
Updated: Date
```

or:

```text
Source
Last verified
```

The exact visual treatment may vary.

The important thing is that trust metadata remains understandable.

---

# 34. Source Links

When source URLs are available, users should be able to reach the source.

Links should:

- be clearly identifiable
- open safely
- not pretend to be first-party when they are not
- remain associated with the relevant information

---

# 35. Last Updated Information

When data freshness matters, display an appropriate timestamp.

Examples:

```text
Updated 2 days ago
Last verified Sep 9, 2026
```

Avoid presenting stale data as live information.

---

# 36. Dashboard Design

The dashboard should answer:

> "What should I know right now?"

A recommended hierarchy:

```text
Welcome / Context
       ↓
Financial Summary
       ↓
Important Actions
       ↓
Protection
       ↓
Investments
       ↓
Goals
       ↓
Alerts / Calendar
       ↓
Recommendations
```

The exact layout can evolve.

---

# 37. Dashboard Density

The dashboard should not become a wall of cards.

Prioritize:

1. most important financial information
2. actionable items
3. meaningful summaries
4. secondary information

Use progressive disclosure for details.

---

# 38. Navigation

Navigation should remain stable throughout the authenticated experience.

Recommended areas:

```text
Dashboard
Discover
Compare
Manage
Goals
Calendar
Watchlist
Alerts
```

Navigation labels should be short and understandable.

---

# 39. Active Navigation

The active page should be clearly identifiable.

Use:

- contrast
- background
- accent
- indicator
- typography

Do not rely only on subtle color changes.

---

# 40. Page Headers

A page header should usually contain:

```text
Title
Description / Context
Primary Action
```

Example:

```text
Your Goals

Track what you're working toward and how you're progressing.

[Create Goal]
```

Do not overfill page headers.

---

# 41. Buttons

Buttons should have clear action labels.

Prefer:

```text
Compare
View Details
Add Policy
Create Goal
Review Recommendation
```

Avoid vague labels:

```text
Click Here
Continue
Submit
Action
Proceed
```

when a more meaningful label is possible.

---

# 42. Button Hierarchy

Use a clear hierarchy:

### Primary

The main action.

### Secondary

An important alternative action.

### Tertiary / Ghost

Lower-priority actions.

### Destructive

Actions that remove or permanently change information.

Do not make every button primary.

---

# 43. Destructive Actions

Destructive actions should:

- be visually distinguishable
- use explicit language
- require confirmation when appropriate

Example:

> Delete Policy

is preferable to:

> Remove

when deletion is the actual operation.

---

# 44. Forms

Forms should be:

- concise
- grouped logically
- clearly labeled
- accessible
- forgiving
- validated

Use:

```text
Label
Input
Helper Text
Error
```

where necessary.

---

# 45. Form Labels

Do not rely on placeholder text as the only label.

Bad:

```text
[ Enter your income ]
```

Good:

```text
Monthly income
[ ₹60,000 ]
```

---

# 46. Financial Input

Financial inputs should communicate expected format.

Examples:

```text
Monthly income
₹ [          ]

Annual insurance budget
₹ [          ]

Monthly SIP
₹ [          ]
```

Formatting should be consistent.

---

# 47. Form Validation

Validation messages should explain:

- what is wrong
- how to fix it

Bad:

> Invalid input.

Better:

> Enter a valid monthly income.

---

# 48. Loading States

Loading states should preserve the page structure.

Prefer:

- skeletons
- inline progress
- button loading states

Avoid unnecessary full-screen spinners.

---

# 49. Button Loading

During async actions:

```text
[ Save Policy ]
```

becomes:

```text
[ Saving... ]
```

The button should generally prevent accidental duplicate submissions.

---

# 50. Empty States

Every major domain should have a useful empty state.

Structure:

```text
Icon / Illustration
Title
Explanation
Primary Action
```

Example:

```text
No investments yet

Track your investments to see them here.

[Add Investment]
```

---

# 51. Error States

Error states should be:

- calm
- understandable
- actionable

Example:

```text
We couldn't load your policies.

Please try again.

[Retry]
```

Do not expose raw database or API errors to ordinary users.

---

# 52. Toasts and Feedback

Use temporary notifications for:

- successful saves
- updates
- deletions
- lightweight feedback

Do not use toasts for information users need to retain.

Important financial information should remain visible in the page.

---

# 53. Modals

Use modals when:

- confirmation is required
- a focused task is appropriate
- context should remain visible

Avoid putting entire complex workflows inside modals.

Complex workflows should usually have dedicated screens.

---

# 54. Drawers

Drawers may be useful for:

- quick details
- filters
- secondary context
- mobile navigation

They should not become the default container for major product journeys.

---

# 55. Tables

Tables are appropriate for:

- comparisons
- structured financial records
- policy lists
- investments

Tables should:

- align values
- maintain readable column hierarchy
- handle mobile appropriately
- avoid excessive columns

---

# 56. Data Visualization

Charts should communicate a decision-relevant insight.

Good examples:

- goal progress
- portfolio allocation
- contribution trend
- protection coverage summary

Bad examples:

- charts added only because the dashboard feels empty
- decorative graphs without meaningful interpretation

Every chart should answer:

> "What does this tell the user?"

---

# 57. Chart Accessibility

Charts should not rely only on color.

Provide:

- labels
- values
- legends where necessary
- textual interpretation where useful

---

# 58. AI Copilot Design

The AI Copilot should feel like an integrated product capability.

It should not dominate the application.

The Copilot should support:

- explanation
- question answering
- navigation
- contextual assistance

---

# 59. AI Copilot Placement

The Copilot may appear as:

- a dedicated page
- a contextual panel
- a floating entry point
- a side panel

The final implementation should prioritize discoverability without covering important financial content.

---

# 60. AI Conversation Design

AI responses should be:

- concise by default
- understandable
- contextual
- grounded
- transparent about uncertainty

Avoid huge blocks of text when a short explanation is enough.

---

# 61. AI Recommendation Explanation

When explaining a recommendation, structure the response where appropriate:

```text
Why this may fit
    ↓
What influenced it
    ↓
Trade-offs
    ↓
What to consider next
```

This makes AI useful without pretending to be an unquestionable authority.

---

# 62. AI Trust Indicator

Where appropriate, the UI should distinguish between:

```text
Verified Product Fact
Calculated Result
NIRNAY Recommendation
AI Explanation
```

These should not visually appear to be the same type of information.

---

# 63. Disclaimer Design

Disclaimers should be:

- readable
- relevant
- contextual
- not hidden unnecessarily

Do not place giant disclaimers everywhere.

Do not hide important limitations in tiny text.

---

# 64. Trust and Financial UI

Financial information deserves more visual discipline than ordinary content.

Important numbers should have:

- clear labels
- appropriate units
- consistent formatting
- contextual meaning

Avoid:

```text
₹15,000
```

without explaining whether it is:

- monthly
- yearly
- invested
- premium
- target
- current value

---

# 65. Information Hierarchy

Every screen should establish:

```text
Primary Information
       ↓
Secondary Information
       ↓
Supporting Metadata
```

Users should not have to scan every element to understand the page.

---

# 66. Progressive Disclosure

Do not show everything immediately.

Example:

```text
Product Card
     ↓
Key facts
     ↓
View Details
     ↓
Full information
```

This keeps discovery screens readable.

---

# 67. Microcopy

Use clear, human language.

Prefer:

> "Compare plans that fit your needs."

over:

> "Initiate comparative product evaluation."

Prefer:

> "Your renewal is coming up."

over:

> "Renewal event detected."

---

# 68. Financial Language

Avoid unnecessary jargon.

When a technical financial term is required:

- explain it
- provide contextual help
- use plain language around it

NIRNAY should make financial concepts easier to understand.

---

# 69. Trust Language

Use careful language.

Prefer:

- "may fit"
- "appears suitable"
- "based on the information available"
- "according to the available source"
- "consider reviewing"

Avoid unsupported:

- "best"
- "guaranteed"
- "risk-free"
- "will save"
- "will earn"
- "definitely"

---

# 70. Responsive Comparison

Comparison tables may be difficult on mobile.

Possible approaches:

- horizontal scrolling
- prioritized fields
- stacked comparison cards
- condensed layouts

Do not simply shrink every column until text becomes unreadable.

---

# 71. Responsive Dashboard

On mobile:

```text
Summary
 ↓
Priority Action
 ↓
Protection
 ↓
Investments
 ↓
Goals
 ↓
Alerts
```

The order may change based on importance.

---

# 72. Responsive Navigation

Desktop may use:

```text
Sidebar
```

Mobile may use:

```text
Bottom Navigation
Drawer
Compact Header
```

The implementation should preserve the same information architecture.

---

# 73. Accessibility

NIRNAY should prioritize:

- keyboard navigation
- visible focus
- semantic HTML
- accessible names
- correct labels
- meaningful error messages
- sufficient contrast
- readable text
- reduced-motion consideration

---

# 74. Focus States

Interactive elements must have visible focus states.

Do not remove browser focus indicators without providing an equivalent accessible treatment.

---

# 75. Icon Rules

Icons should support meaning.

Use icons for:

- navigation
- visual reinforcement
- familiar actions
- status

Do not use obscure icons that require users to guess their meaning.

Important actions should include text when ambiguity is possible.

---

# 76. Icon Consistency

Use one primary icon style.

Avoid mixing:

```text
outlined icons
filled icons
3D icons
emoji
random SVG styles
```

within the same UI without a deliberate reason.

---

# 77. Illustrations

Illustrations should be:

- minimal
- relevant
- consistent
- supportive

Do not use generic stock illustrations that make NIRNAY look like a template.

---

# 78. Images

Images should have a clear purpose.

Avoid decorative images that:

- increase loading time
- distract from financial information
- make the interface visually noisy

---

# 79. Motion Design

Motion should communicate:

- state change
- hierarchy
- continuity
- feedback

Examples:

- page transitions
- expanding details
- loading
- success confirmation

Avoid:

- excessive bouncing
- constant floating
- attention-seeking animation
- unnecessary parallax

---

# 80. Motion Duration

Motion should feel fast and controlled.

The user should never wait for animation to finish before understanding a financial action.

---

# 81. Reduced Motion

Where animation is implemented, respect users who prefer reduced motion.

---

# 82. Design Consistency Rule

If the same pattern appears more than once, consider making it a shared component.

Examples:

```text
Financial Summary Card
Product Card
Status Badge
Source Indicator
Recommendation Card
Empty State
Page Header
```

---

# 83. Avoid One-Off Components

Do not create:

```text
SpecialCardForPageA
SpecialCardForPageB
SpecialCardForPageC
```

when the underlying pattern is the same.

Instead:

```text
Shared Card
   ↓
Variant / Props
```

---

# 84. Component Variants

Use variants when components genuinely share the same behavior.

Example:

```text
Button
â”œâ”€â”€ primary
â”œâ”€â”€ secondary
â”œâ”€â”€ ghost
â””â”€â”€ destructive
```

Do not create variants for every tiny visual difference.

---

# 85. Design Tokens Before Custom Styling

Before creating custom CSS, check whether the existing system already supports the required result.

Preferred order:

```text
Existing token
   ↓
Existing component
   ↓
Component variant
   ↓
Small custom styling
   ↓
New design primitive only if necessary
```

---

# 86. Global CSS

Global styles should remain limited to:

- foundational tokens
- typography
- global layout behavior
- accessibility
- application-wide styling

Avoid putting page-specific styling into global CSS.

---

# 87. Page-Specific Styling

Page-specific styles should remain close to the component/page that owns them.

Avoid global selectors that unexpectedly affect unrelated screens.

---

# 88. Dark Mode

If dark mode is implemented, it should be intentional and complete.

Do not create a partially supported dark mode where:

- some cards change
- some text becomes unreadable
- charts break
- borders disappear
- dialogs use inconsistent colors

If dark mode is not part of the MVP, do not spend critical time implementing it.

---

# 89. Fintech Trust Pattern

The following visual pattern should be used consistently for important financial information:

```text
VALUE
Label / Context
Status
Source / Verification
```

Example:

```text
₹15,000
Annual insurance budget
Within stated budget

Source: User profile
```

---

# 90. Recommendation Trust Pattern

Use:

```text
RECOMMENDED FOR YOU

Product Name

Why:
â€¢ Reason 1
â€¢ Reason 2

Trade-offs:
â€¢ Trade-off 1

Based on:
Your financial profile + product information
```

This should remain informative rather than promotional.

---

# 91. Comparison Trust Pattern

Use:

```text
COMPARING

Product A       Product B

Cost            ...
Coverage        ...
Key Feature     ...
Limitation      ...

What stands out:
...
```

The user should understand the evidence behind the comparison.

---

# 92. Empty-State Principle

An empty state should answer:

> "What can I do now?"

Never leave the user with:

> "Nothing here."

---

# 93. Error-State Principle

An error state should answer:

> "What happened and what can I do?"

Do not expose technical implementation details.

---

# 94. Loading-State Principle

A loading state should answer:

> "Is the application working?"

Avoid blank screens whenever possible.

---

# 95. Security UX

The UI should not reveal sensitive implementation information.

Avoid exposing:

- database identifiers unnecessarily
- Firebase internal errors
- JWTs
- API keys
- service credentials
- internal stack traces

---

# 96. Trust UX

Trust should be communicated through the product experience rather than only through a disclaimer.

Examples:

```text
Source
Updated
Verified
Why this recommendation
What we don't know
Trade-offs
```

These are product features.

---

# 97. Demo Optimization

The final competition demo should have:

- strong visual hierarchy
- minimal friction
- obvious navigation
- realistic but clearly controlled demo data
- fast transitions
- coherent storytelling

Do not optimize only for screenshots.

The evaluator should be able to understand the product while interacting with it.

---

# 98. Demo Visual Priority

The most polished areas should be:

1. Landing page
2. Dashboard
3. Discover
4. Compare
5. Recommendation
6. AI Copilot
7. Manage

Secondary screens may receive less visual polish if time is constrained.

---

# 99. Frontend Implementation Rule

Before creating a new UI component:

1. Search existing components.
2. Check shadcn/ui.
3. Check shared application components.
4. Reuse where possible.
5. Create a new component only when necessary.

---

# 100. AI Coding Agent Design Rule

AI agents generating frontend code must:

- read this document first
- inspect existing components
- reuse the existing design system
- avoid introducing another component library
- avoid arbitrary colors
- avoid arbitrary spacing
- avoid inconsistent typography
- support loading/empty/error states
- preserve responsive behavior
- maintain accessibility
- avoid excessive animation
- keep financial information visually trustworthy

---

# 101. AI-Generated UI Rule

AI agents must not generate:

```text
random gradients
random glassmorphism
random neon colors
random rounded cards
random dashboard charts
random animated backgrounds
```

simply because they look impressive.

Every visual choice must serve the product.

---

# 102. No Franken-UI Rule

NIRNAY must never become:

```text
Page A → one design language
Page B → another design language
Page C → another component library
Page D → AI-generated template
```

All screens must belong to one design system.

---

# 103. Design Review Checklist

Before considering a screen complete, ask:

### Visual

- Is the hierarchy clear?
- Is spacing consistent?
- Are typography levels consistent?
- Are colors restrained?
- Are components consistent?

### UX

- Is the primary action obvious?
- Are loading states handled?
- Are empty states handled?
- Are errors handled?
- Is the flow understandable?

### Financial

- Are numbers labeled?
- Are units clear?
- Are facts distinguished from recommendations?
- Is source/verification shown where necessary?

### Accessibility

- Can the screen be navigated by keyboard?
- Are controls labeled?
- Is focus visible?
- Is color sufficient but not the only indicator?

### Responsive

- Does it work on mobile?
- Does content overflow?
- Are tables usable?
- Are actions still accessible?

---

# 104. Definition of Design Done

A screen is design-complete when:

- it follows the shared visual system
- the hierarchy is clear
- interactions are understandable
- loading/empty/error states exist
- financial information is properly labeled
- trust indicators are present where needed
- responsive behavior works
- accessibility basics are satisfied
- no unnecessary visual complexity remains

---

# 105. Design Change Rule

A developer may improve a screen without approval when the change:

- improves consistency
- improves accessibility
- improves clarity
- fixes a bug
- follows existing design tokens

Coordinate before introducing:

- a new visual language
- new component library
- major navigation change
- new global styling approach
- major branding change

---

# 106. Design System Ownership

Primary owner:

> **Member 2 — Frontend / Product UX**

Supporting owners:

- Member 1 — architecture/integration
- Member 3 — data presentation requirements
- Member 4 — AI interaction design

The design system is shared across the entire team.

---

# 107. Design-to-Code Principle

Design decisions should map cleanly to reusable code.

```text
Design Pattern
     ↓
Reusable Component
     ↓
Consistent Implementation
```

Avoid designs that require every page to invent its own implementation.

---

# 108. Final Design Principle

NIRNAY should look like a product that understands financial decisions.

The interface should communicate:

> **"I can trust this enough to understand what is happening and decide what to do next."**

The visual design should therefore be:

> **Calm enough to trust, clear enough to understand, and polished enough to remember.**

---
