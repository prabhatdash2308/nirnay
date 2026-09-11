// ─────────────────────────────────────────────────────────────────────────────
// NIRNAY — Product Catalogue
//
// DATA NOTICE:
// All products in this catalogue are REFERENCE DATA for the MVP demonstration.
// Financial figures (premiums, expense ratios, coverage amounts, SIP minimums)
// are indicative reference ranges sourced from publicly available information
// as of September 2026. They are NOT:
//   - Live quotes
//   - Guaranteed premiums
//   - Verified current rates
//   - NIRNAY recommendations
//
// Users must verify all figures directly with the product provider before
// making any financial decision.
//
// Verification status: "reference" — see ProductProvenance.status.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  Product,
  InsuranceProduct,
  InvestmentProduct,
  ProductFilter,
} from "@/lib/types/product";

// ─────────────────────────────────────────────────────────────────────────────
// Shared provenance for reference-data products in this catalogue
// ─────────────────────────────────────────────────────────────────────────────

const REFERENCE_PROVENANCE = {
  source: { name: "Public provider documentation / IRDAI public data" },
  status: "reference" as const,
  lastUpdated: "2026-09-01",
};

// ─────────────────────────────────────────────────────────────────────────────
// INSURANCE PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────

const INSURANCE_PRODUCTS: readonly InsuranceProduct[] = [
  // ── Health Insurance ──────────────────────────────────────────────────────

  {
    type: "insurance",
    id: "hdfc-ergo-optima-secure",
    name: "Optima Secure",
    provider: "HDFC ERGO",
    subcategory: "health",
    tagline: "Comprehensive health cover with no sub-limits",
    description:
      "A comprehensive individual and family health insurance plan that covers hospitalisation, day-care procedures, and pre/post hospitalisation expenses with no sub-limits on room rent.",
    keyFeatures: [
      { label: "No room-rent sub-limit", icon: "check" },
      { label: "Covers 60 days pre-hospitalisation", icon: "clock" },
      { label: "Day-care procedures covered", icon: "shield" },
      { label: "Restoration benefit available", icon: "trend" },
    ],
    importantConsiderations: [
      "Pre-existing conditions covered after waiting period (typically 2–4 years).",
      "Verify exact waiting periods in the policy schedule.",
      "Network hospital cashless claims — check network list before hospitalisation.",
      "Reference data — verify current terms with HDFC ERGO directly.",
    ],
    eligibility: "Ages 18–65 (adults). Children from 91 days. Senior citizen plans available separately.",
    cost: {
      indicativeAnnualMin: 8000,
      indicativeAnnualMax: 22000,
      coverageAmount: 500000,
      pricingNote:
        "Indicative premium for a 30-year-old individual with ₹5L cover. Actual premium depends on age, cover amount, city, and medical history. Verify with HDFC ERGO.",
    },
    riskLevel: "low",
    provenance: REFERENCE_PROVENANCE,
  },

  {
    type: "insurance",
    id: "star-health-comprehensive",
    name: "Star Comprehensive Insurance Policy",
    provider: "Star Health Insurance",
    subcategory: "health",
    tagline: "Wide-coverage health plan for individuals and families",
    description:
      "Star Health's flagship family floater plan covering hospitalisation, AYUSH treatments, domestic road ambulance, and outpatient consultations.",
    keyFeatures: [
      { label: "Family floater option", icon: "shield" },
      { label: "AYUSH treatments covered", icon: "check" },
      { label: "Outpatient consultation benefit", icon: "info" },
      { label: "Annual health check-up", icon: "check" },
    ],
    importantConsiderations: [
      "Outpatient benefit may have a sub-limit — verify in policy schedule.",
      "Pre-existing conditions subject to standard waiting period.",
      "Maternity cover available as an add-on with additional waiting period.",
      "Reference data — verify current terms with Star Health directly.",
    ],
    eligibility: "Ages 18–65. Children from 16 days. Family floater covers up to 4 members.",
    cost: {
      indicativeAnnualMin: 10000,
      indicativeAnnualMax: 28000,
      coverageAmount: 500000,
      pricingNote:
        "Indicative range for ₹5L family floater. Actual premium varies by age, number of members, and sum insured. Verify with Star Health.",
    },
    riskLevel: "low",
    provenance: REFERENCE_PROVENANCE,
  },

  // ── Motor Insurance ───────────────────────────────────────────────────────

  {
    type: "insurance",
    id: "bajaj-allianz-motor-own-damage",
    name: "Car Insurance — Own Damage",
    provider: "Bajaj Allianz General Insurance",
    subcategory: "motor",
    tagline: "Own damage cover for your car with add-on options",
    description:
      "Covers damage to your own vehicle from accidents, fire, natural calamities, and theft. Third-party liability is legally mandatory and sold separately or as a comprehensive package.",
    keyFeatures: [
      { label: "Own damage cover", icon: "shield" },
      { label: "Zero-depreciation add-on available", icon: "check" },
      { label: "Roadside assistance option", icon: "info" },
      { label: "Cashless repairs at network garages", icon: "check" },
    ],
    importantConsiderations: [
      "Own damage cover is optional — third-party liability is legally mandatory in India.",
      "IDV (Insured Declared Value) determines the payout on total loss — verify before buying.",
      "Zero-depreciation add-on removes depreciation deduction for parts — increases premium.",
      "Reference data — verify current terms and premiums with Bajaj Allianz directly.",
    ],
    eligibility: "Any private car registered in India. Premium depends on car model, year, and city.",
    cost: {
      indicativeAnnualMin: 5000,
      indicativeAnnualMax: 18000,
      pricingNote:
        "Indicative own-damage premium for a mid-segment car (1.2L petrol). Actual premium depends on car make, model, year of manufacture, and city. Verify with Bajaj Allianz.",
    },
    riskLevel: "low",
    provenance: REFERENCE_PROVENANCE,
  },

  {
    type: "insurance",
    id: "icici-lombard-motor-comprehensive",
    name: "Motor Insurance — Comprehensive",
    provider: "ICICI Lombard",
    subcategory: "motor",
    tagline: "All-round motor protection with extensive add-on options",
    description:
      "Comprehensive motor insurance combining third-party liability and own-damage cover. ICICI Lombard offers an instant claims process and a wide cashless garage network.",
    keyFeatures: [
      { label: "Third-party + own damage bundled", icon: "shield" },
      { label: "Instant claim settlement for minor repairs", icon: "trend" },
      { label: "Wide garage network across India", icon: "check" },
      { label: "Engine protection add-on available", icon: "info" },
    ],
    importantConsiderations: [
      "NCB (No Claim Bonus) discount applies at renewal if no claims are made.",
      "Engine protection add-on important in flood-prone areas.",
      "Verify exact exclusions (e.g., mechanical breakdown not covered).",
      "Reference data — verify current terms and premiums with ICICI Lombard directly.",
    ],
    eligibility: "Any private vehicle registered in India.",
    cost: {
      indicativeAnnualMin: 7000,
      indicativeAnnualMax: 22000,
      pricingNote:
        "Indicative comprehensive premium for a mid-segment car. Actual premium depends on car value (IDV), location, and add-ons. Verify with ICICI Lombard.",
    },
    riskLevel: "low",
    provenance: REFERENCE_PROVENANCE,
  },

  // ── Term Life Insurance ───────────────────────────────────────────────────

  {
    type: "insurance",
    id: "hdfc-life-click2protect-super",
    name: "Click 2 Protect Super",
    provider: "HDFC Life",
    subcategory: "term_life",
    tagline: "High sum assured term plan with flexibility",
    description:
      "A pure term life insurance plan providing a large death benefit at an affordable premium. Includes options for life-stage benefit increases and critical illness cover as add-ons.",
    keyFeatures: [
      { label: "High sum assured — up to ₹2 crore+", icon: "shield" },
      { label: "Affordable pure term premiums", icon: "trend" },
      { label: "Critical illness add-on option", icon: "check" },
      { label: "Premium waiver on disability option", icon: "info" },
    ],
    importantConsiderations: [
      "Term insurance provides death benefit only — no maturity or savings component.",
      "Medical underwriting required — premium depends on health, age, and lifestyle.",
      "Accurate health disclosure is legally required; non-disclosure can void claims.",
      "Reference data — verify current terms and premiums with HDFC Life directly.",
    ],
    eligibility: "Ages 18–65. Minimum policy term typically 10 years. Maximum coverage age varies.",
    cost: {
      indicativeAnnualMin: 7000,
      indicativeAnnualMax: 18000,
      coverageAmount: 10000000,
      pricingNote:
        "Indicative annual premium for a healthy non-smoking 28-year-old with ₹1 crore cover for 30 years. Actual premium depends on age, health, lifestyle, and term. Verify with HDFC Life.",
    },
    riskLevel: "low",
    provenance: REFERENCE_PROVENANCE,
  },

  {
    type: "insurance",
    id: "lic-tech-term",
    name: "LIC Tech Term",
    provider: "Life Insurance Corporation of India",
    subcategory: "term_life",
    tagline: "Pure term plan from India's largest insurer",
    description:
      "LIC's online pure term plan. Provides a death benefit to the nominee. Backed by LIC's claim settlement record and government backing, offering high trust for the Indian market.",
    keyFeatures: [
      { label: "Available entirely online", icon: "check" },
      { label: "LIC claim settlement history", icon: "shield" },
      { label: "Non-smoker discount available", icon: "trend" },
      { label: "Single-pay or regular-pay options", icon: "info" },
    ],
    importantConsiderations: [
      "Premiums may be higher than private insurers for equivalent cover — compare before buying.",
      "Medical underwriting required for higher cover amounts.",
      "No maturity benefit — this is a pure term plan.",
      "Reference data — verify current terms and premiums with LIC directly.",
    ],
    eligibility: "Ages 18–65. Maximum maturity age 80 years.",
    cost: {
      indicativeAnnualMin: 9000,
      indicativeAnnualMax: 22000,
      coverageAmount: 10000000,
      pricingNote:
        "Indicative premium for a healthy 30-year-old non-smoker with ₹1 crore cover. Premiums depend on age, health, and policy term. Verify with LIC.",
    },
    riskLevel: "low",
    provenance: REFERENCE_PROVENANCE,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// INVESTMENT PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────

const INVESTMENT_PRODUCTS: readonly InvestmentProduct[] = [
  // ── SIP / Equity Mutual Funds ─────────────────────────────────────────────

  {
    type: "investment",
    id: "mirae-large-cap-fund",
    name: "Mirae Asset Large Cap Fund",
    provider: "Mirae Asset Mutual Fund",
    subcategory: "mutual_fund",
    tagline: "Large-cap equity fund targeting stable long-term growth",
    description:
      "An open-ended equity fund investing predominantly in large-cap companies. Suitable for investors seeking long-term capital appreciation with moderate-to-high risk tolerance.",
    investmentObjective:
      "Long-term capital growth by investing primarily in equity and equity-related instruments of large-cap companies.",
    keyFeatures: [
      { label: "Predominantly large-cap stocks", icon: "shield" },
      { label: "Long-term wealth creation focus", icon: "trend" },
      { label: "SIP available from ₹1,000/month", icon: "check" },
      { label: "Open-ended — can redeem anytime", icon: "info" },
    ],
    importantConsiderations: [
      "Mutual fund investments are subject to market risk — past performance does not guarantee future results.",
      "No guaranteed returns — NAV fluctuates with markets.",
      "Exit load may apply for early redemption — verify before investing.",
      "Tax implications depend on holding period and investment amount — consult a tax advisor.",
      "Reference data — verify current scheme details with Mirae Asset / AMFI.",
    ],
    riskLevel: "high",
    cost: {
      minimumSipAmount: 1000,
      indicativeExpenseRatioPct: 1.65,
      costNote:
        "Expense ratio is indicative — actual ratio changes quarterly. Direct plans have lower expense ratios than regular plans. Verify current ratio on AMFI website.",
    },
    provenance: {
      source: { name: "AMFI public scheme data / Mirae Asset AMC website" },
      status: "reference",
      lastUpdated: "2026-09-01",
    },
  },

  {
    type: "investment",
    id: "sbi-bluechip-fund",
    name: "SBI Bluechip Fund",
    provider: "SBI Mutual Fund",
    subcategory: "mutual_fund",
    tagline: "Large-cap fund from India's largest public sector bank AMC",
    description:
      "An open-ended equity scheme investing in large-cap companies. Managed by SBI Funds Management, one of the largest AMCs in India.",
    investmentObjective:
      "To provide investors with opportunities for long-term growth in capital along with liquidity of an open-ended scheme through an active management of investments in a diversified basket of equity stocks of companies whose market capitalisation is at least equal to the full market capitalisation of the smallest stock in the BSE 100 index.",
    keyFeatures: [
      { label: "Invests in BSE 100 universe", icon: "shield" },
      { label: "SBI AMC — one of India's largest", icon: "info" },
      { label: "SIP from ₹500/month", icon: "check" },
      { label: "Long-term horizon recommended (5+ years)", icon: "clock" },
    ],
    importantConsiderations: [
      "Equity mutual fund investments are subject to market risk.",
      "Returns are not guaranteed and depend on market conditions.",
      "Suitable for investors with a long investment horizon (5+ years).",
      "Reference data — verify current scheme details with SBI MF / AMFI.",
    ],
    riskLevel: "high",
    cost: {
      minimumSipAmount: 500,
      indicativeExpenseRatioPct: 1.7,
      costNote:
        "Indicative expense ratio for regular plan. Direct plan typically lower. Verify on AMFI or SBI MF website.",
    },
    provenance: {
      source: { name: "AMFI public scheme data / SBI Mutual Fund website" },
      status: "reference",
      lastUpdated: "2026-09-01",
    },
  },

  {
    type: "investment",
    id: "parag-parikh-flexi-cap",
    name: "Parag Parikh Flexi Cap Fund",
    provider: "PPFAS Mutual Fund",
    subcategory: "mutual_fund",
    tagline: "Diversified flexi-cap fund with international exposure",
    description:
      "A flexi-cap equity fund known for its value-investing philosophy. Uniquely, it invests a portion in international equities (primarily US-listed stocks), providing geographic diversification.",
    investmentObjective:
      "To generate long-term capital growth from an actively managed portfolio primarily of equity and equity-related securities. The scheme will invest in equity and equity-related instruments across market capitalisations.",
    keyFeatures: [
      { label: "Invests in Indian + US equities", icon: "trend" },
      { label: "Value-investing philosophy", icon: "shield" },
      { label: "Low portfolio turnover historically", icon: "check" },
      { label: "SIP from ₹1,000/month", icon: "info" },
    ],
    importantConsiderations: [
      "International equity exposure adds currency risk (INR/USD fluctuation).",
      "Mutual fund investments are subject to market risk.",
      "TDS may apply on US equity dividends — consult a tax advisor.",
      "Reference data — verify current scheme details with PPFAS MF / AMFI.",
    ],
    riskLevel: "high",
    cost: {
      minimumSipAmount: 1000,
      indicativeExpenseRatioPct: 1.45,
      costNote:
        "Indicative expense ratio for regular plan. Verify on PPFAS MF or AMFI website.",
    },
    provenance: {
      source: { name: "AMFI public scheme data / PPFAS Mutual Fund website" },
      status: "reference",
      lastUpdated: "2026-09-01",
    },
  },

  {
    type: "investment",
    id: "hdfc-mid-cap-opportunities",
    name: "HDFC Mid Cap Opportunities Fund",
    provider: "HDFC Mutual Fund",
    subcategory: "mutual_fund",
    tagline: "Mid-cap equity fund for higher growth potential",
    description:
      "An open-ended equity scheme investing predominantly in mid-cap companies. Higher growth potential than large-cap funds, with commensurately higher volatility.",
    investmentObjective:
      "To provide long-term capital appreciation / income by investing predominantly in mid-cap companies.",
    keyFeatures: [
      { label: "Predominantly mid-cap exposure", icon: "trend" },
      { label: "Higher growth potential vs. large-cap", icon: "shield" },
      { label: "SIP from ₹500/month", icon: "check" },
      { label: "Long-term horizon recommended (7+ years)", icon: "clock" },
    ],
    importantConsiderations: [
      "Mid-cap funds are significantly more volatile than large-cap funds.",
      "Suitable for investors with higher risk tolerance and long investment horizons.",
      "Past outperformance does not guarantee future returns.",
      "Reference data — verify current scheme details with HDFC MF / AMFI.",
    ],
    riskLevel: "high",
    cost: {
      minimumSipAmount: 500,
      indicativeExpenseRatioPct: 1.72,
      costNote:
        "Indicative expense ratio for regular plan. Verify on AMFI or HDFC MF website.",
    },
    provenance: {
      source: { name: "AMFI public scheme data / HDFC Mutual Fund website" },
      status: "reference",
      lastUpdated: "2026-09-01",
    },
  },

  {
    type: "investment",
    id: "axis-liquid-fund",
    name: "Axis Liquid Fund",
    provider: "Axis Mutual Fund",
    subcategory: "mutual_fund",
    tagline: "Low-risk liquid fund for short-term parking of funds",
    description:
      "A liquid mutual fund investing in high-quality short-term money market instruments. Suitable for parking surplus funds for short durations with liquidity and capital preservation.",
    investmentObjective:
      "To generate returns commensurate with risk from a portfolio constituted of money market and debt securities with residual maturity of up to 91 days.",
    keyFeatures: [
      { label: "Capital preservation focus", icon: "shield" },
      { label: "T+1 redemption liquidity", icon: "clock" },
      { label: "Low expense ratio", icon: "check" },
      { label: "No lock-in", icon: "info" },
    ],
    importantConsiderations: [
      "Liquid funds are not completely risk-free — credit risk in the underlying securities exists.",
      "Returns are not guaranteed and vary with prevailing interest rates.",
      "Exit load applicable for redemptions within 7 days.",
      "Reference data — verify current scheme details with Axis MF / AMFI.",
    ],
    riskLevel: "low",
    cost: {
      minimumSipAmount: 500,
      indicativeExpenseRatioPct: 0.2,
      costNote:
        "Liquid funds typically have very low expense ratios. Verify on Axis MF or AMFI website.",
    },
    provenance: {
      source: { name: "AMFI public scheme data / Axis Mutual Fund website" },
      status: "reference",
      lastUpdated: "2026-09-01",
    },
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Combined catalogue
// ─────────────────────────────────────────────────────────────────────────────

export const PRODUCT_CATALOGUE: readonly Product[] = [
  ...INSURANCE_PRODUCTS,
  ...INVESTMENT_PRODUCTS,
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Lookup helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Find a product by its ID. Returns undefined if not found.
 * Used by the detail page and watchlist actions.
 */
export function getProductById(id: string): Product | undefined {
  return PRODUCT_CATALOGUE.find((p) => p.id === id);
}

/**
 * Apply filters to the catalogue. All filters are AND-combined.
 * An empty filter object returns the full catalogue.
 */
export function filterProducts(filter: ProductFilter): readonly Product[] {
  return PRODUCT_CATALOGUE.filter((product) => {
    if (filter.category && product.type !== filter.category) return false;

    if (filter.subcategory && product.subcategory !== filter.subcategory)
      return false;

    if (filter.riskLevel && product.riskLevel !== filter.riskLevel)
      return false;

    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      const hit =
        product.name.toLowerCase().includes(q) ||
        product.provider.toLowerCase().includes(q) ||
        product.tagline.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q);
      if (!hit) return false;
    }

    return true;
  });
}

/**
 * Derive the DB product_type value from a Product.
 * Matches the watchlist.product_type CHECK constraint.
 */
export function toWatchlistProductType(
  product: Product,
): "insurance" | "mutual_fund" | "investment" {
  if (product.type === "insurance") return "insurance";
  if (product.subcategory === "mutual_fund") return "mutual_fund";
  return "investment";
}
