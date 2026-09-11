// ─────────────────────────────────────────────────────────────────────────────
// NIRNAY — Product Data Types
//
// All product data in NIRNAY is reference/demo data for this MVP.
// Fields with financial figures (premiums, returns, expense ratios) are clearly
// labelled as indicative. No live market data is fetched or implied.
//
// The source model ensures every product carries explicit provenance so the UI
// can correctly surface verification status and data freshness.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Category taxonomy — mirrors watchlist.product_type DB enum where applicable
// ─────────────────────────────────────────────────────────────────────────────

export type ProductCategory = "insurance" | "investment";

export type InsuranceSubcategory = "health" | "motor" | "term_life";
export type InvestmentSubcategory = "sip" | "mutual_fund";

export type ProductSubcategory = InsuranceSubcategory | InvestmentSubcategory;

// DB watchlist product_type values — must match the DB CHECK constraint
export type WatchlistProductType = "insurance" | "mutual_fund" | "investment" | "other";

// ─────────────────────────────────────────────────────────────────────────────
// Risk level — aligns with financial_profiles.risk_profile
// ─────────────────────────────────────────────────────────────────────────────

export type ProductRiskLevel = "low" | "moderate" | "high";

// ─────────────────────────────────────────────────────────────────────────────
// Provenance — every product must carry this
// ─────────────────────────────────────────────────────────────────────────────

export interface ProductSource {
  /** Human-readable name of the data source */
  name: string;
  /** Public URL to source — omit if no verifiable URL exists */
  url?: string;
}

export type ProductVerificationStatus =
  | "reference"   // Demo/reference data — not verified against live data
  | "provider"    // Sourced from provider public documentation
  | "regulatory"; // Sourced from IRDAI / SEBI / AMFI regulatory data

export interface ProductProvenance {
  source: ProductSource;
  status: ProductVerificationStatus;
  /** ISO 8601 date string: when this record was last reviewed */
  lastUpdated: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Key feature item — short bullet point for the product card / detail view
// ─────────────────────────────────────────────────────────────────────────────

export interface ProductFeature {
  label: string;
  /** Optional icon hint — used to pick a lucide icon in the UI */
  icon?: "shield" | "trend" | "clock" | "check" | "info";
}

// ─────────────────────────────────────────────────────────────────────────────
// Insurance-specific fields
// ─────────────────────────────────────────────────────────────────────────────

export interface InsuranceCost {
  /**
   * Indicative annual premium range in INR.
   * These are reference ranges, NOT guaranteed quotes.
   * Always labelled as "indicative" in the UI.
   */
  indicativeAnnualMin?: number;
  indicativeAnnualMax?: number;
  /** Coverage sum assured in INR where applicable */
  coverageAmount?: number;
  /** Notes about what affects the premium */
  pricingNote?: string;
}

export interface InsuranceProduct {
  readonly type: "insurance";
  readonly id: string;
  readonly name: string;
  readonly provider: string;
  readonly subcategory: InsuranceSubcategory;
  readonly tagline: string;
  readonly description: string;
  readonly keyFeatures: readonly ProductFeature[];
  readonly importantConsiderations: readonly string[];
  readonly eligibility: string;
  readonly cost: InsuranceCost;
  readonly riskLevel: ProductRiskLevel;
  readonly provenance: ProductProvenance;
}

// ─────────────────────────────────────────────────────────────────────────────
// Investment-specific fields
// ─────────────────────────────────────────────────────────────────────────────

export interface InvestmentCost {
  /**
   * Indicative minimum SIP in INR.
   * Reference figure — verify with provider before investing.
   */
  minimumSipAmount?: number;
  /**
   * Indicative expense ratio range in percent.
   * Reference figure — actual ratio changes; verify before investing.
   */
  indicativeExpenseRatioPct?: number;
  /** Notes about costs */
  costNote?: string;
}

export interface InvestmentProduct {
  readonly type: "investment";
  readonly id: string;
  readonly name: string;
  readonly provider: string;
  readonly subcategory: InvestmentSubcategory;
  readonly tagline: string;
  readonly description: string;
  readonly investmentObjective: string;
  readonly keyFeatures: readonly ProductFeature[];
  readonly importantConsiderations: readonly string[];
  readonly riskLevel: ProductRiskLevel;
  readonly cost: InvestmentCost;
  readonly provenance: ProductProvenance;
}

// ─────────────────────────────────────────────────────────────────────────────
// Union type
// ─────────────────────────────────────────────────────────────────────────────

export type Product = InsuranceProduct | InvestmentProduct;

// ─────────────────────────────────────────────────────────────────────────────
// Type guards
// ─────────────────────────────────────────────────────────────────────────────

export function isInsuranceProduct(p: Product): p is InsuranceProduct {
  return p.type === "insurance";
}

export function isInvestmentProduct(p: Product): p is InvestmentProduct {
  return p.type === "investment";
}

// ─────────────────────────────────────────────────────────────────────────────
// Catalogue-level filter shape
// ─────────────────────────────────────────────────────────────────────────────

export interface ProductFilter {
  category?: ProductCategory;
  subcategory?: ProductSubcategory;
  riskLevel?: ProductRiskLevel;
  searchQuery?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Watchlist row as returned from Supabase
// Mirrors the public.watchlist table schema exactly.
// ─────────────────────────────────────────────────────────────────────────────

export interface WatchlistRow {
  id: number;
  user_id: string;
  product_type: WatchlistProductType;
  product_id: string;
  created_at: string;
}
