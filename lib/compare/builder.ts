// ─────────────────────────────────────────────────────────────────────────────
// NIRNAY — Comparison Row Builder
//
// Builds structured comparison data from a set of products.
//
// DESIGN PRINCIPLES:
// - Only compares structured catalogue facts — no LLM, no invented data
// - Insurance rows are insurance-specific; investment rows are investment-specific
// - Mixed-category sets show all rows with "N/A" for non-applicable cells
// - Each row is labelled as FACT or INTERPRETATION per the Trust Policy
// - Cost values are always labelled as indicative
//
// OUTPUT:
// ComparisonSection[] — grouped rows displayed in the comparison table
// ─────────────────────────────────────────────────────────────────────────────

import type { Product } from "@/lib/types/product";
import { isInsuranceProduct, isInvestmentProduct } from "@/lib/types/product";
import type { SuitabilityResult } from "@/lib/suitability/engine";
import { BAND_LABELS } from "@/lib/suitability/engine";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** Distinguishes raw catalogue facts from NIRNAY-generated heuristics */
export type RowKind = "fact" | "interpretation";

/** A single cell value for one product in a comparison row */
export interface CompareCell {
  /** Display value */
  value: string;
  /** Optional sentiment to color the cell */
  sentiment?: "positive" | "caution" | "neutral" | "info";
  /** If true, this value is not available for this product */
  notApplicable?: boolean;
}

/** A single comparison row */
export interface CompareRow {
  label: string;
  kind: RowKind;
  /** Optional tooltip explaining the row */
  tooltip?: string;
  cells: CompareCell[]; // one cell per product in comparison order
}

/** A grouped section of comparison rows */
export interface ComparisonSection {
  title: string;
  rows: CompareRow[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared label maps
// ─────────────────────────────────────────────────────────────────────────────

const SUBCATEGORY_LABELS: Record<string, string> = {
  health: "Health Insurance",
  motor: "Motor Insurance",
  term_life: "Term Life Insurance",
  sip: "SIP",
  mutual_fund: "Mutual Fund",
};

const RISK_LABELS: Record<string, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
};

const RISK_SENTIMENT: Record<string, "positive" | "caution" | "neutral"> = {
  low: "positive",
  moderate: "neutral",
  high: "caution",
};

const VERIFICATION_LABELS: Record<string, string> = {
  reference: "Reference / Demo data",
  provider: "Provider documentation",
  regulatory: "Regulatory source",
};

const NA_CELL: CompareCell = { value: "N/A", notApplicable: true };

// ─────────────────────────────────────────────────────────────────────────────
// Section builders
// ─────────────────────────────────────────────────────────────────────────────

function buildOverviewSection(products: Product[]): ComparisonSection {
  return {
    title: "Overview",
    rows: [
      {
        label: "Provider",
        kind: "fact",
        cells: products.map((p) => ({ value: p.provider })),
      },
      {
        label: "Product",
        kind: "fact",
        cells: products.map((p) => ({ value: p.name })),
      },
      {
        label: "Category",
        kind: "fact",
        cells: products.map((p) => ({
          value: p.type === "insurance" ? "Insurance" : "Investment",
        })),
      },
      {
        label: "Type",
        kind: "fact",
        cells: products.map((p) => ({
          value: SUBCATEGORY_LABELS[p.subcategory] ?? p.subcategory,
        })),
      },
      {
        label: "Risk level",
        kind: "fact",
        tooltip: "Risk level as stated in product documentation. Fact, not a NIRNAY assessment.",
        cells: products.map((p) => ({
          value: RISK_LABELS[p.riskLevel] ?? p.riskLevel,
          sentiment: RISK_SENTIMENT[p.riskLevel],
        })),
      },
    ],
  };
}

function buildInsuranceCostSection(products: Product[]): ComparisonSection {
  return {
    title: "Indicative Cost — Insurance",
    rows: [
      {
        label: "Annual premium (indicative)",
        kind: "fact",
        tooltip:
          "Reference range only. Not a quote. Actual premium depends on age, health, location, and other factors. Verify directly with the provider.",
        cells: products.map((p) => {
          if (!isInsuranceProduct(p)) return NA_CELL;
          const min = p.cost.indicativeAnnualMin;
          const max = p.cost.indicativeAnnualMax;
          if (!min && !max) return { value: "Not specified" };
          if (min && max)
            return {
              value: `₹${min.toLocaleString("en-IN")} – ₹${max.toLocaleString("en-IN")}/yr`,
              sentiment: "info",
            };
          return { value: `₹${(min ?? max)!.toLocaleString("en-IN")}/yr`, sentiment: "info" };
        }),
      },
      {
        label: "Coverage amount",
        kind: "fact",
        tooltip: "Sum assured / sum insured. Verify with provider for current limits.",
        cells: products.map((p) => {
          if (!isInsuranceProduct(p)) return NA_CELL;
          const cov = p.cost.coverageAmount;
          if (!cov) return { value: "Not specified" };
          return { value: `₹${cov.toLocaleString("en-IN")}`, sentiment: "info" };
        }),
      },
    ],
  };
}

function buildInvestmentCostSection(products: Product[]): ComparisonSection {
  return {
    title: "Indicative Cost — Investment",
    rows: [
      {
        label: "Minimum SIP",
        kind: "fact",
        tooltip:
          "Minimum SIP amount per month as stated in public scheme documentation. Reference figure — verify with the fund house / AMFI.",
        cells: products.map((p) => {
          if (!isInvestmentProduct(p)) return NA_CELL;
          const sip = p.cost.minimumSipAmount;
          if (!sip) return { value: "Not specified" };
          return { value: `₹${sip.toLocaleString("en-IN")}/month`, sentiment: "info" };
        }),
      },
      {
        label: "Expense ratio (indicative)",
        kind: "fact",
        tooltip:
          "Indicative expense ratio for the regular plan. Actual ratio changes quarterly. Direct plans typically have lower expense ratios. Verify on AMFI website.",
        cells: products.map((p) => {
          if (!isInvestmentProduct(p)) return NA_CELL;
          const er = p.cost.indicativeExpenseRatioPct;
          if (!er) return { value: "Not specified" };
          return { value: `~${er}%`, sentiment: "neutral" };
        }),
      },
    ],
  };
}

function buildFeaturesSection(products: Product[]): ComparisonSection {
  // Find the maximum number of key features across all products
  const maxFeatures = Math.min(
    4,
    Math.max(...products.map((p) => p.keyFeatures.length)),
  );

  const rows: CompareRow[] = [];
  for (let i = 0; i < maxFeatures; i++) {
    rows.push({
      label: `Key feature ${i + 1}`,
      kind: "fact",
      cells: products.map((p) => {
        const feature = p.keyFeatures[i];
        if (!feature) return { value: "—" };
        return { value: feature.label };
      }),
    });
  }

  return { title: "Key Features", rows };
}

function buildEligibilitySection(products: Product[]): ComparisonSection | null {
  const hasInsurance = products.some(isInsuranceProduct);
  if (!hasInsurance) return null;

  return {
    title: "Eligibility",
    rows: [
      {
        label: "Eligibility",
        kind: "fact",
        cells: products.map((p) => {
          if (!isInsuranceProduct(p)) return NA_CELL;
          return { value: p.eligibility };
        }),
      },
    ],
  };
}

function buildConsiderationsSection(products: Product[]): ComparisonSection {
  const maxConsiderations = Math.min(
    3,
    Math.max(...products.map((p) => p.importantConsiderations.length)),
  );

  const rows: CompareRow[] = [];
  for (let i = 0; i < maxConsiderations; i++) {
    rows.push({
      label: `Consideration ${i + 1}`,
      kind: "fact",
      cells: products.map((p) => {
        const c = p.importantConsiderations[i];
        if (!c) return { value: "—" };
        return { value: c, sentiment: "caution" };
      }),
    });
  }

  return { title: "Important Considerations", rows };
}

function buildSuitabilitySection(
  products: Product[],
  suitabilityMap: Record<string, SuitabilityResult>,
): ComparisonSection {
  return {
    title: "Profile Match",
    rows: [
      {
        label: "Match score",
        kind: "interpretation",
        tooltip:
          "Heuristic score (0–100) based on your financial profile: risk preference, budget, goals, and experience. Not financial advice. Deterministic rule-based model — no LLM.",
        cells: products.map((p) => {
          const s = suitabilityMap[p.id];
          if (!s) return { value: "—" };
          if (!s.hasProfile)
            return { value: "Profile not set", sentiment: "neutral" };
          return {
            value: `${s.score} / 100`,
            sentiment:
              s.band === "strong_match"
                ? "positive"
                : s.band === "good_match"
                  ? "positive"
                  : s.band === "partial_match"
                    ? "neutral"
                    : "caution",
          };
        }),
      },
      {
        label: "Match band",
        kind: "interpretation",
        cells: products.map((p) => {
          const s = suitabilityMap[p.id];
          if (!s || !s.hasProfile) return { value: "—" };
          return {
            value: BAND_LABELS[s.band],
            sentiment:
              s.band === "strong_match"
                ? "positive"
                : s.band === "good_match"
                  ? "positive"
                  : s.band === "partial_match"
                    ? "neutral"
                    : "caution",
          };
        }),
      },
    ],
  };
}

function buildProvenanceSection(products: Product[]): ComparisonSection {
  return {
    title: "Data Source",
    rows: [
      {
        label: "Source",
        kind: "fact",
        cells: products.map((p) => ({ value: p.provenance.source.name })),
      },
      {
        label: "Verification status",
        kind: "fact",
        tooltip:
          "Reference = demo/reference data. Provider = sourced from provider documentation. Regulatory = IRDAI/SEBI/AMFI data.",
        cells: products.map((p) => ({
          value: VERIFICATION_LABELS[p.provenance.status],
          sentiment: "neutral",
        })),
      },
      {
        label: "Last reviewed",
        kind: "fact",
        cells: products.map((p) => ({ value: p.provenance.lastUpdated })),
      },
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main builder — called by the Compare client component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build all comparison sections for a set of products.
 * Sections are category-aware — insurance-only sections are omitted for
 * all-investment sets, and vice versa.
 *
 * @param products - The products to compare (1–3)
 * @param suitabilityMap - Map of product.id → SuitabilityResult
 */
export function buildComparisonSections(
  products: Product[],
  suitabilityMap: Record<string, SuitabilityResult>,
): ComparisonSection[] {
  if (products.length === 0) return [];

  const hasInsurance = products.some(isInsuranceProduct);
  const hasInvestment = products.some(isInvestmentProduct);

  const sections: ComparisonSection[] = [
    buildOverviewSection(products),
  ];

  // Cost sections — only include if the set contains the relevant type
  if (hasInsurance) sections.push(buildInsuranceCostSection(products));
  if (hasInvestment) sections.push(buildInvestmentCostSection(products));

  sections.push(buildFeaturesSection(products));

  const eligibility = buildEligibilitySection(products);
  if (eligibility) sections.push(eligibility);

  sections.push(buildConsiderationsSection(products));
  sections.push(buildSuitabilitySection(products, suitabilityMap));
  sections.push(buildProvenanceSection(products));

  return sections;
}

// ─────────────────────────────────────────────────────────────────────────────
// Compare summary — a brief plain-English summary of key differences
// This is a NIRNAY interpretation, not financial advice.
// Based on structured data only — no LLM.
// ─────────────────────────────────────────────────────────────────────────────

export interface CompareSummaryItem {
  label: string;
  sentiment: "positive" | "caution" | "neutral";
}

/**
 * Generate a list of key observations about the comparison set.
 * All observations are derived from structured catalogue data + suitability scores.
 * Every item is clearly framed as an observation, not a recommendation.
 */
export function buildCompareSummary(
  products: Product[],
  suitabilityMap: Record<string, SuitabilityResult>,
): CompareSummaryItem[] {
  if (products.length < 2) return [];

  const items: CompareSummaryItem[] = [];

  // ── Risk spread ───────────────────────────────────────────────────────────
  const riskLevels = products.map((p) => p.riskLevel);
  const uniqueRisks = new Set(riskLevels);
  if (uniqueRisks.size > 1) {
    items.push({
      label: `These products have different risk levels (${[...uniqueRisks].join(", ")}). Consider your risk tolerance before deciding.`,
      sentiment: "caution",
    });
  } else {
    items.push({
      label: `All compared products share the same risk level: ${riskLevels[0]}.`,
      sentiment: "neutral",
    });
  }

  // ── Mixed category notice ─────────────────────────────────────────────────
  const hasInsurance = products.some(isInsuranceProduct);
  const hasInvestment = products.some(isInvestmentProduct);
  if (hasInsurance && hasInvestment) {
    items.push({
      label:
        "You are comparing insurance and investment products. These serve different financial purposes — direct cost comparison may not be meaningful.",
      sentiment: "caution",
    });
  }

  // ── Suitability summary ───────────────────────────────────────────────────
  const suitabilityAvailable = products.some(
    (p) => suitabilityMap[p.id]?.hasProfile,
  );

  if (suitabilityAvailable) {
    // Find highest scoring product
    const scored = products
      .map((p) => ({ product: p, s: suitabilityMap[p.id] }))
      .filter((x) => x.s?.hasProfile)
      .sort((a, b) => (b.s?.score ?? 0) - (a.s?.score ?? 0));

    if (scored.length >= 2) {
      const best = scored[0];
      const diff = (best.s?.score ?? 0) - (scored[1].s?.score ?? 0);
      if (diff >= 15) {
        items.push({
          label: `${best.product.name} appears to align more closely with your stated profile (score: ${best.s?.score}). This is a heuristic observation, not a recommendation.`,
          sentiment: "positive",
        });
      } else {
        items.push({
          label:
            "Profile match scores are similar across compared products. Review the individual reasons below for more detail.",
          sentiment: "neutral",
        });
      }
    }
  } else {
    items.push({
      label:
        "Set up your financial profile to see which product better fits your risk level, budget, and goals.",
      sentiment: "neutral",
    });
  }

  // ── Investment-specific: expense ratio ───────────────────────────────────
  const investmentProducts = products.filter(isInvestmentProduct);
  if (investmentProducts.length >= 2) {
    const withER = investmentProducts.filter(
      (p) => p.cost.indicativeExpenseRatioPct != null,
    );
    if (withER.length >= 2) {
      const lowestER = withER.reduce((a, b) =>
        (a.cost.indicativeExpenseRatioPct ?? Infinity) <
        (b.cost.indicativeExpenseRatioPct ?? Infinity)
          ? a
          : b,
      );
      items.push({
        label: `${lowestER.name} has the lower indicative expense ratio (~${lowestER.cost.indicativeExpenseRatioPct}%). Lower expense ratios generally reduce the drag on returns over time. Verify current ratios with AMFI.`,
        sentiment: "positive",
      });
    }
  }

  // ── Insurance-specific: coverage amount ──────────────────────────────────
  const insuranceProducts = products.filter(isInsuranceProduct);
  if (insuranceProducts.length >= 2) {
    const withCoverage = insuranceProducts.filter(
      (p) => p.cost.coverageAmount != null,
    );
    if (withCoverage.length >= 2) {
      const highestCoverage = withCoverage.reduce((a, b) =>
        (a.cost.coverageAmount ?? 0) > (b.cost.coverageAmount ?? 0) ? a : b,
      );
      items.push({
        label: `${highestCoverage.name} offers the higher indicative coverage amount (₹${highestCoverage.cost.coverageAmount?.toLocaleString("en-IN")}). Verify current terms with the provider.`,
        sentiment: "positive",
      });
    }
  }

  return items;
}
