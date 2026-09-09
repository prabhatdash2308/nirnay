# NIRNAY — Trust & Data Policy

> **Document:** TRUST_AND_DATA_POLICY.md
> **Project:** NIRNAY
> **Purpose:** Define how NIRNAY handles financial information, product data, sources, AI-generated insights, recommendations, calculations, uncertainty, disclaimers, and user trust.

---

# 1. Purpose

NIRNAY is a financial protection and investment decision-support platform.

Its purpose is to help users:

```text
Discover
Compare
Decide
Manage
Optimize
```

NIRNAY must therefore prioritize:

```text
Accuracy
Transparency
Traceability
Explainability
User control
Responsible AI
```

The product must never create confidence by hiding uncertainty.

---

# 2. Core Trust Principle

The central trust principle is:

> **NIRNAY should be useful without pretending to know what it does not know.**

If information is:

```text
Verified
```

say so.

If information is:

```text
Estimated
```

say so.

If information is:

```text
User-provided
```

say so.

If information is:

```text
AI-generated
```

say so.

If information is:

```text
Unavailable
```

say so.

Never silently convert uncertainty into certainty.

---

# 3. What NIRNAY Is

NIRNAY is:

```text
A financial decision-support and organization platform.
```

It helps users:

- Understand financial products
- Compare alternatives
- Organize financial information
- Track policies and investments
- Monitor goals
- Identify relevant considerations
- Generate explainable recommendations
- Make more informed decisions

---

# 4. What NIRNAY Is Not

NIRNAY must not represent itself as:

```text
A guaranteed-return platform
A guaranteed-savings platform
A replacement for regulated professional advice
A provider of insurance coverage
A bank
A broker
A fund manager
A financial institution
```

Unless the product's legal and regulatory structure explicitly changes, the product should remain positioned as decision support.

---

# 5. Decision Support vs Financial Advice

NIRNAY may provide:

```text
Comparisons
Suitability-oriented insights
Educational explanations
Financial calculations
Product summaries
Personalized decision-support
```

However, recommendations must be presented responsibly.

Avoid language that implies certainty about a user's financial outcome.

Avoid:

```text
"You will make money."
"This is guaranteed to be the best policy."
"You cannot lose money."
"This investment will definitely outperform."
"You are guaranteed to save ₹X."
```

Prefer:

```text
"This may be a better fit based on the information provided."
"Consider these trade-offs."
"Based on the current information available..."
"This option appears more suitable for your stated priorities."
```

---

# 6. User Remains the Decision Maker

NIRNAY provides decision support.

The final financial decision remains with the user.

The product should make this clear through appropriate UX and copy.

Conceptually:

```text
NIRNAY
   ↓
Understand
   ↓
Compare
   ↓
Explain
   ↓
Recommend
   ↓
User decides
```

NIRNAY should not imply that the AI is making an irreversible decision on the user's behalf.

---

# 7. Financial Product Facts

Financial product facts must be treated differently from AI-generated explanations.

Examples of product facts:

```text
Premium
Coverage amount
Deductible
Policy term
Eligibility
Fees
Fund category
Expense ratio
Investment minimum
Renewal date
Product features
```

These should come from a defined source.

---

# 8. Source Requirement

Important externally sourced product information should have provenance where possible.

Relevant metadata may include:

```text
Source
Source URL
External ID
Retrieved at
Last updated
```

The purpose is to allow users and developers to understand:

```text
Where did this information come from?
When was it retrieved?
How current is it?
```

---

# 9. Source Hierarchy

When collecting product information, prefer authoritative sources.

A general preference order is:

```text
1. Official provider / issuer source
2. Official regulatory or government source
3. Official product documentation
4. Trusted structured data source
5. Secondary source
```

The exact source hierarchy may vary by product category.

Do not present a secondary source as if it were the official provider.

---

# 10. Source Freshness

Financial information can change.

Examples:

```text
Premiums
Policy terms
Fees
Eligibility
Offers
Fund information
Interest rates
Product availability
```

Therefore, where freshness matters, NIRNAY should display:

```text
Last updated
```

or equivalent freshness information.

---

# 11. Stale Data Policy

If data may be outdated:

```text
Do not present it as unquestionably current.
```

Possible UI language:

```text
"Last updated recently."
"Information may have changed."
"Verify current terms with the provider."
```

The exact wording should match the context.

---

# 12. Unavailable Data

If an important product fact is unavailable:

```text
Do not invent it.
```

Preferred behavior:

```text
"Not available"
"Could not verify"
"Check provider documentation"
```

Never fill a missing value with a plausible-looking number.

---

# 13. AI Hallucination Policy

AI must never fabricate financial facts.

The following must not be invented:

```text
Premiums
Coverage limits
Returns
Fees
Eligibility
Policy exclusions
Discounts
Offers
Provider partnerships
Regulatory status
Product availability
Historical performance
Guaranteed savings
Guaranteed returns
```

If the required information is not available:

```text
The AI must say that it cannot verify it.
```

---

# 14. AI as an Explanation Layer

Where possible, AI should operate primarily as an interpretation and reasoning layer over structured information.

Preferred architecture:

```text
Verified / structured data
        ↓
Business calculations
        ↓
AI reasoning
        ↓
Human-readable explanation
```

Avoid:

```text
AI guesses product facts
        ↓
Application treats guesses as truth
```

---

# 15. Recommendation Architecture

NIRNAY's recommendation flow should conceptually be:

```text
User information
        ↓
Relevant constraints
        ↓
Structured product information
        ↓
Eligibility / suitability checks
        ↓
Comparison
        ↓
Recommendation logic
        ↓
AI explanation
        ↓
User decision
```

The AI should explain the reasoning.

It should not manufacture the underlying facts.

---

# 16. Recommendation Transparency

Recommendations should explain:

```text
Why this option was considered
Which user preferences mattered
Which trade-offs exist
What assumptions were used
What information may be missing
```

A useful recommendation should answer:

> "Why are you showing me this?"

---

# 17. Recommendation Factors

Depending on the feature, recommendation factors may include:

```text
Budget
Coverage needs
Investment amount
Time horizon
Goal
User preferences
Risk-related preferences
Existing protection
Existing investments
Product features
Known constraints
```

Only use factors that are actually supported by the available data.

---

# 18. Recommendation Limitations

Recommendations should not imply:

```text
Perfect suitability
Guaranteed performance
Guaranteed savings
Guaranteed approval
Guaranteed coverage
Guaranteed returns
```

Use appropriate uncertainty language.

---

# 19. Explainability

NIRNAY should prefer explanations such as:

```text
"Recommended because..."
"Compared with..."
"This matters because..."
"Trade-off:"
"Based on your stated budget..."
"Based on the information currently available..."
```

Avoid opaque statements such as:

```text
"The AI says this is best."
```

---

# 20. Recommendation Score

If NIRNAY introduces a score, the score must have a clear meaning.

Do not create a number merely because it looks intelligent.

For example:

```text
92/100
```

is not meaningful unless users can understand:

```text
What does 92 mean?
What factors produced it?
Can it change?
What does a higher score represent?
```

---

# 21. Confidence

If the product displays confidence, it must describe what confidence means.

Avoid:

```text
AI Confidence: 98%
```

unless there is a well-defined and validated interpretation.

Prefer contextual indicators such as:

```text
High information coverage
Some information missing
Needs verification
```

when these better represent the actual state of the data.

---

# 22. Missing Information

Missing information should be visible when it affects a recommendation.

Example:

```text
Your recommendation may change after we know:
- Your current health coverage
- Your renewal date
- Your investment horizon
```

Do not hide material uncertainty.

---

# 23. User-Provided Information

Information entered by the user should be treated as:

```text
User-provided
```

until independently verified.

Examples:

```text
Income
Expenses
Existing policies
Investment amount
Goal amount
Renewal date
```

Do not silently label user-entered values as externally verified facts.

---

# 24. Calculated Values

Calculated values are different from source facts.

Examples:

```text
Total annual premium
Portfolio allocation
Goal progress
Estimated contribution
Comparison score
Projected value
```

The application should distinguish:

```text
Source value
Calculated value
```

where confusion is possible.

---

# 25. Estimates

Estimates must be clearly labeled.

Examples:

```text
Estimated annual cost
Estimated future value
Estimated goal progress
Illustrative return
```

Do not present estimates as guaranteed outcomes.

---

# 26. Investment Projections

Investment projections must be presented as scenarios or estimates.

Avoid:

```text
"You will have ₹25 lakh in 10 years."
```

Prefer:

```text
"At an illustrative assumed return of X%, the projected value would be approximately ₹Y."
```

The assumptions must be visible when material to the result.

---

# 27. Return Assumptions

If an investment calculation uses an assumed return, clearly identify:

```text
Assumed return
Time period
Contribution frequency
Contribution amount
Compounding assumption
```

Do not imply that an assumed return is guaranteed.

---

# 28. Insurance Comparisons

Insurance comparison should consider multiple dimensions rather than reducing everything to price.

Possible dimensions:

```text
Premium
Coverage
Deductible
Waiting periods
Exclusions
Claim-related considerations
Network / service features
Renewal
Add-ons
Policy terms
```

The exact dimensions depend on the insurance type.

---

# 29. "Cheapest" Does Not Mean "Best"

NIRNAY should avoid equating:

```text
Lowest price
=
Best choice
```

A lower premium may come with different:

```text
Coverage
Limits
Exclusions
Deductibles
Features
Eligibility
```

The product should make meaningful trade-offs visible.

---

# 30. Investment Comparisons

Investment comparisons should avoid relying on a single metric.

Potential dimensions include:

```text
Category
Risk characteristics
Investment horizon
Historical performance
Fees
Minimum investment
Liquidity
User goal
```

Historical performance must never be represented as a guarantee of future returns.

---

# 31. Product Availability

A product appearing in NIRNAY does not automatically mean it is currently available to every user.

Where availability can change, the application should distinguish:

```text
Listed
Available
Eligible
Verified
```

These concepts must not be conflated.

---

# 32. Eligibility

Eligibility information should come from authoritative product information when possible.

If eligibility cannot be verified:

```text
"Eligibility needs to be confirmed with the provider."
```

Do not infer guaranteed eligibility from a user's basic profile.

---

# 33. Offers and Discounts

Offers must never be fabricated.

Never claim:

```text
"20% discount"
"Special partner offer"
"Guaranteed cashback"
```

unless the application has verified evidence for the claim.

Where an offer is time-sensitive, show its relevant validity information.

---

# 34. Savings Claims

NIRNAY must be careful with savings claims.

Avoid:

```text
"Save ₹50,000 guaranteed."
```

Prefer:

```text
"Potential annual difference based on the compared options."
```

The calculation and assumptions should be transparent.

---

# 35. Guaranteed Language

The following language should generally be avoided unless factually and legally justified:

```text
Guaranteed
Certain
Risk-free
Best
Always
Never lose
Guaranteed savings
Guaranteed returns
Guaranteed approval
Guaranteed coverage
```

Use precise language instead.

---

# 36. Comparison Language

Good comparison language:

```text
Lower premium
Higher coverage
More suitable for your stated budget
Higher flexibility
Lower stated fee
Different trade-off
Requires verification
```

Bad comparison language:

```text
Definitely better
Perfect policy
Best investment
No-brainer
Guaranteed winner
```

---

# 37. Financial Disclaimers

The product should include appropriate contextual disclaimers.

A general example:

```text
NIRNAY provides decision-support information and does not guarantee financial outcomes. Product terms, prices, eligibility, and performance may change. Verify important information with the relevant provider before making a financial decision.
```

The final legal wording should be reviewed appropriately before production use.

---

# 38. Disclaimer Placement

Disclaimers should appear where they are relevant.

Do not hide every important warning in a single footer.

Examples:

```text
Investment projection
→ Show projection assumptions

Insurance comparison
→ Show product verification note

AI recommendation
→ Show decision-support context
```

---

# 39. Disclaimer Design

Disclaimers should be:

```text
Readable
Concise
Relevant
Visible
Non-alarming
```

Do not make the product unusable through excessive warning text.

Trust comes from useful context, not from legal text everywhere.

---

# 40. User Control

Users should be able to:

```text
Review
Compare
Edit
Remove
Dismiss
Save
Track
```

their relevant financial information.

The application should not make irreversible financial decisions automatically.

---

# 41. No Autonomous Financial Transactions

Unless explicitly designed, authorized, and secured in a future version, NIRNAY should not autonomously:

```text
Purchase insurance
Invest money
Transfer money
Cancel policies
Change investment allocations
Submit financial applications
```

AI recommendations should not silently trigger financial transactions.

---

# 42. External Action Confirmation

If a future feature can initiate an external financial action:

```text
Recommendation
    ↓
Review
    ↓
User confirmation
    ↓
Action
```

There should be a clear point where the user understands what will happen.

---

# 43. Financial Calendar Trust

Dates shown in the financial calendar should have a clear origin.

Examples:

```text
User-created event
Imported policy renewal
Investment schedule
System-generated reminder
```

Do not imply that a date was verified by an insurer or financial institution unless it actually was.

---

# 44. Alerts Trust

Alerts should clearly communicate why they were generated.

Example:

```text
Insurance renewal approaching
Source: Your saved policy
```

rather than:

```text
Important financial event detected
```

without explanation.

---

# 45. AI-Generated Alerts

If AI contributes to an alert:

```text
The underlying trigger must still be explainable.
```

Do not generate alarming financial alerts solely because a language model produced concerning text.

---

# 46. Data Provenance Model

Where practical, NIRNAY should distinguish:

```text
SOURCE
  ↓
RAW / EXTERNAL DATA
  ↓
NORMALIZED DATA
  ↓
CALCULATION
  ↓
AI INTERPRETATION
  ↓
USER-FACING INSIGHT
```

This makes debugging and trust substantially easier.

---

# 47. Trust Metadata

Useful trust metadata may include:

```text
Source
Last updated
Retrieved at
Calculation timestamp
Recommendation timestamp
Data status
Verification status
```

Only expose metadata that improves user understanding.

---

# 48. Verification States

A future product implementation may use states such as:

```text
Verified
Partially verified
User provided
Estimated
AI generated
Needs verification
Unavailable
```

These labels should have consistent meanings across the product.

Do not use the same visual label for different trust levels.

---

# 49. Trust Indicators

Trust indicators should be meaningful.

Examples:

```text
✓ Verified source
Updated recently
User provided
Estimated
Needs verification
```

Avoid decorative "verified" badges that do not represent a real verification process.

---

# 50. Data Freshness

Freshness is part of trust.

Where external information is used, consider:

```text
Last updated:
2 days ago
```

or:

```text
Updated:
September 2026
```

The exact display depends on the data type.

---

# 51. Conflicting Sources

If multiple sources disagree:

```text
Do not silently choose one.
```

Where material:

```text
Flag the discrepancy
Prefer the authoritative source
Require verification
```

The system should avoid creating false certainty.

---

# 52. Source Failure

If an external source becomes unavailable:

```text
Do not fabricate replacement data.
```

Possible behavior:

```text
"Unable to refresh this information right now."
```

Cached data may be displayed only when its age/status is clear and appropriate.

---

# 53. Cached Financial Data

Cached information must retain freshness metadata.

Conceptually:

```text
Data
+
Retrieved at
+
Source
+
Freshness status
```

A cache must not erase the distinction between current and stale information.

---

# 54. Data Corrections

If incorrect data is discovered:

```text
Identify
Correct
Recalculate affected values
Refresh recommendations where necessary
Update timestamps
```

Do not silently leave known incorrect financial information in the system.

---

# 55. User Corrections

Users should be able to correct their own user-entered financial information where appropriate.

For example:

```text
Income changed
Premium changed
Policy renewed
Investment amount changed
Goal amount changed
```

The application should not make users fight the system to correct their own data.

---

# 56. Recommendation Refresh

Recommendations may become stale when important user information changes.

Potential triggers include:

```text
Income changed
Budget changed
Policy changed
Investment changed
Goal changed
Product information changed
```

The system should be designed so recommendations can be recalculated when their inputs materially change.

---

# 57. AI Memory and Financial Data

AI systems should not retain unnecessary financial information.

When AI processing is required:

```text
Send the minimum required context.
```

Avoid sending an entire financial profile when only one field is needed.

---

# 58. Sensitive Financial Context

Examples of sensitive information include:

```text
Income
Expenses
Policy numbers
Premiums
Investment values
Financial goals
Risk preferences
```

AI features should use only the subset necessary for the requested operation.

---

# 59. AI Prompt Construction

Prompts should provide structured context where possible.

Prefer:

```text
User budget:
₹15,000/year

Desired coverage:
₹10 lakh

Existing policy:
Yes

Goal:
Increase protection
```

over dumping unnecessary user data into a prompt.

---

# 60. AI Output Validation

Structured AI output should be validated before application use.

If expecting:

```json
{
  "recommendation": "...",
  "reasons": ["..."],
  "cautions": ["..."]
}
```

the application should validate:

```text
Types
Required fields
Array lengths
Maximum lengths
Allowed enum values
```

before trusting the structure.

---

# 61. AI Cannot Override Business Rules

If the application has a business rule:

```text
Product is ineligible
```

the AI must not override it simply because the model thinks the product is attractive.

The system should prioritize:

```text
Hard business constraints
        ↓
Verified facts
        ↓
Calculations
        ↓
AI interpretation
```

---

# 62. AI Cannot Override Security

AI output must never determine:

```text
Authentication
Authorization
Database ownership
Admin access
Secret access
Payment authorization
```

Security controls remain outside the language model.

---

# 63. AI Cannot Override User Intent

If the user asks:

```text
"Show me options under ₹15,000."
```

the system should not silently change the budget to:

```text
₹50,000
```

because the AI believes it would be better.

The user's constraints must be respected unless the user explicitly changes them.

---

# 64. Recommendation Explanation Pattern

A recommended UI pattern is:

```text
Recommended option

Why it fits
â€¢ Reason 1
â€¢ Reason 2
â€¢ Reason 3

Trade-offs
â€¢ Trade-off 1
â€¢ Trade-off 2

Based on
â€¢ User budget
â€¢ Coverage requirement
â€¢ Product information

Source
â€¢ Provider/source

Last updated
â€¢ Date
```

This gives users context instead of an unexplained AI verdict.

---

# 65. Comparison Explanation Pattern

A useful comparison may show:

```text
                    Option A       Option B

Premium             ₹X             ₹Y
Coverage            ₹X             ₹Y
Feature             Included       Optional
Trade-off            ...            ...

Why it matters
...
```

The comparison should make meaningful differences easy to understand.

---

# 66. User Consent

If a future feature requires sending financial information to an external AI or third-party service, the product should clearly communicate the relevant data use and obtain any required consent.

Do not silently send unnecessary personal financial data to third parties.

---

# 67. Third-Party AI Providers

Before integrating an external AI provider, evaluate:

```text
Data retention
Training usage
Privacy controls
Regional processing
Security
API logging
Data deletion
```

Do not assume that every AI API handles sensitive financial information in the same way.

---

# 68. Analytics

Analytics should avoid unnecessary financial detail.

Prefer events such as:

```text
comparison_started
recommendation_viewed
policy_added
goal_created
```

Avoid sending:

```text
exact income
exact policy number
full investment portfolio
```

unless there is a clearly justified and secure reason.

---

# 69. Product Metrics vs Financial Data

Product analytics should answer:

```text
What feature was used?
How often?
Where did users stop?
```

It should not unnecessarily collect:

```text
How much money does this specific user have?
```

---

# 70. Demo Data

Competition/demo environments must use fictional financial information.

Example fictional persona:

```text
Rahul
27 years old
₹60,000 monthly income
₹15,000 annual insurance budget
Health insurance
Car insurance
Monthly SIP
Car insurance renewal in April
```

This persona is for demonstration purposes only.

Do not use real users' financial information for demo screenshots.

---

# 71. No Fabricated Statistics

NIRNAY must not invent:

```text
Market size
User count
Revenue
Savings
Accuracy
Model performance
Partnerships
Certifications
Customer numbers
```

unless these are backed by actual evidence.

This applies to:

```text
Product UI
Pitch deck
README
Website
Documentation
AI-generated content
```

---

# 72. No Fabricated Partnerships

Never display:

```text
"Powered by XYZ Bank"
"Official partner of XYZ"
"Partnered with XYZ Insurance"
```

unless the relationship actually exists and is authorized for public representation.

---

# 73. No Fabricated Certifications

Do not display:

```text
Certified
Regulated
Approved
Government verified
IRDAI approved
SEBI approved
```

unless the exact claim is factually supported and legally appropriate.

---

# 74. No Guaranteed Outcomes

NIRNAY must not promise:

```text
Guaranteed savings
Guaranteed investment returns
Guaranteed claim approval
Guaranteed policy approval
Guaranteed portfolio growth
Guaranteed financial success
```

The product can explain possibilities and trade-offs.

---

# 75. Responsible Microcopy

Prefer:

```text
"Compare your options"
"See what fits your priorities"
"Review the trade-offs"
"Verify current terms"
"Based on the information available"
"Estimated"
"Illustrative"
```

Avoid:

```text
"Win financially"
"Never lose"
"Guaranteed profit"
"Perfect policy"
"100% safe"
"Best investment guaranteed"
```

---

# 76. Trust and Visual Design

Trust should also be communicated visually.

Use:

```text
Clear hierarchy
Readable numbers
Source labels
Freshness labels
Consistent status indicators
Calm warnings
Transparent assumptions
```

Avoid:

```text
Fake verification badges
Aggressive urgency
Manipulative countdowns
Excessive red warnings
Unexplained AI scores
```

---

# 77. Urgency

Financial products can involve deadlines, but NIRNAY must avoid manipulative urgency.

Good:

```text
Your policy renews in 12 days.
```

Bad:

```text
ACT NOW OR YOU'LL LOSE EVERYTHING!
```

Alerts should communicate the fact without manufacturing panic.

---

# 78. Recommendations and User Autonomy

Recommendations should support user autonomy.

The UI should allow users to:

```text
Compare alternatives
Inspect reasons
Review assumptions
Dismiss recommendations
Choose another option
```

A recommendation should not feel like a forced decision.

---

# 79. Trust Failure Handling

If NIRNAY cannot verify an important financial fact:

```text
Admit the limitation.
```

Example:

```text
"We couldn't verify the current premium from the available source."
```

This is preferable to displaying a plausible but potentially incorrect value.

---

# 80. Trust Incident

A trust incident may include:

```text
Incorrect financial fact
Wrong recommendation caused by bad data
Stale information presented as current
Fabricated source
Fabricated offer
Incorrect calculation
AI hallucination presented as fact
Cross-user data exposure
```

Such incidents should be treated seriously.

---

# 81. Trust Incident Response

When a material trust issue is discovered:

```text
1. Identify the affected data.
2. Stop further propagation.
3. Correct the source/data.
4. Recalculate affected results.
5. Refresh recommendations if required.
6. Review the root cause.
7. Add regression coverage.
8. Update documentation/processes.
```

Do not hide known material errors.

---

# 82. Data Ownership

User-owned information must remain associated with the correct Firebase UID.

The database enforces this through RLS.

Conceptually:

```text
Firebase UID
    =
user_profiles.user_id
    =
user-owned records
```

---

# 83. Security and Trust Relationship

Trust depends on security.

NIRNAY must ensure:

```text
Correct user
    ↓
Correct data
    ↓
Correct source
    ↓
Correct calculation
    ↓
Correct explanation
```

A beautiful interface cannot compensate for incorrect or insecure financial information.

---

# 84. Trust Rules for Developers

Developers must:

```text
[ ] Preserve source information
[ ] Preserve freshness information
[ ] Avoid fabricated data
[ ] Label estimates
[ ] Label AI-generated content where relevant
[ ] Validate financial calculations
[ ] Protect user ownership
[ ] Preserve RLS
[ ] Avoid unnecessary financial-data collection
[ ] Review user-facing claims
```

---

# 85. Trust Rules for AI Agents

AI coding agents must follow these rules:

1. Never fabricate financial product facts.
2. Never fabricate statistics.
3. Never fabricate partnerships.
4. Never fabricate certifications.
5. Never fabricate user numbers.
6. Never fabricate savings.
7. Never fabricate returns.
8. Never create fake source URLs.
9. Never mark unverified information as verified.
10. Never remove source/freshness information to simplify UI.
11. Never turn estimates into guarantees.
12. Never remove important disclaimers merely to improve visual polish.
13. Never use AI output as the source of truth for product facts.
14. Never override hard business rules with model output.
15. Never allow AI to override authentication or authorization.
16. Never expose private financial information unnecessarily.
17. Never send secrets to AI services.
18. Preserve the distinction between user data, verified data, calculations, and AI output.
19. Update this document when trust architecture changes.

---

# 86. Trust Review Checklist

Before shipping a financial feature:

```text
[ ] Where does the data come from?
[ ] Is the source known?
[ ] Is the data current?
[ ] Is the value verified?
[ ] Is the value user-provided?
[ ] Is the value calculated?
[ ] Is the value AI-generated?
[ ] Are assumptions visible?
[ ] Could the user misunderstand the result?
[ ] Are claims too strong?
[ ] Could this be interpreted as a guarantee?
[ ] Are relevant trade-offs visible?
[ ] Can the user verify important information?
```

---

# 87. Recommendation Review Checklist

Before shipping a recommendation:

```text
[ ] User inputs are correct
[ ] Relevant constraints are applied
[ ] Product facts are sourced
[ ] Eligibility is handled correctly
[ ] Calculations are validated
[ ] AI reasoning uses known information
[ ] Missing information is acknowledged
[ ] Trade-offs are visible
[ ] No guarantee is implied
[ ] Recommendation is explainable
[ ] User remains the final decision maker
```

---

# 88. Definition of Trust Done

A feature is trust-complete when:

```text
[ ] Data source is known
[ ] Data freshness is known where relevant
[ ] User data is clearly distinguished
[ ] Calculated values are distinguishable
[ ] AI output is distinguishable
[ ] Missing information is handled honestly
[ ] Recommendations are explainable
[ ] Assumptions are visible
[ ] No fabricated claims exist
[ ] No guaranteed outcomes are implied
[ ] Relevant disclaimers are present
[ ] User retains control
[ ] Security controls are intact
[ ] Documentation is updated
```

---

# 89. Final Trust Principle

NIRNAY should earn trust through behavior, not branding.

The product should consistently communicate:

```text
Here is what we know.
Here is where it came from.
Here is when it was updated.
Here is what we calculated.
Here is what the AI thinks.
Here is what is uncertain.
Here is what you should verify.
```

The final principle is:

> **Never manufacture certainty. Make the truth understandable.**

---
