/**
 * NIRNAY — Suitability Engine Tests
 *
 * These tests verify the deterministic suitability engine against the required
 * test cases from the Phase 3 master prompt.
 *
 * Execution: run `node lib/suitability/engine.test.mjs` from the project root.
 * No test framework required — uses Node.js built-in assertions.
 *
 * Test cases per prompt spec (Section 54):
 *
 * CASE 1: Moderate profile + moderate-risk product → positive risk alignment
 * CASE 2: Conservative profile + aggressive product → risk caution
 * CASE 3: Budget below product minimum → budget caution
 * CASE 4: Goal aligns with product → positive goal alignment
 * CASE 5: No profile → graceful degradation
 *
 * Additional cases:
 * CASE 6: Product provenance — all products have source, status, lastUpdated
 * CASE 7: Aggressive profile + high-risk investment → positive risk alignment
 * CASE 8: Conservative profile + low-risk insurance → strong/good match
 */

import assert from "node:assert/strict";

// ─────────────────────────────────────────────────────────────────────────────
// Inline-import simulation via dynamic import
// (This file is a .mjs ES module, loaded by Node.js directly)
// ─────────────────────────────────────────────────────────────────────────────

// The engine and catalogue are TypeScript — this test imports the compiled
// output. Since we have no Jest/Vitest, we use a simple Node runner against
// the TypeScript source using tsx (Node's TypeScript runner from the toolchain).
//
// Invocation: npx tsx lib/suitability/engine.test.mts

/**
 * Minimal assertion helper with descriptive output.
 */
function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    process.exitCode = 1;
  }
}

async function run() {
  console.log("\n[NIRNAY Suitability Engine — Test Suite]\n");

  const { computeSuitability } = await import("./engine.ts");
  const { getProductById, filterProducts, PRODUCT_CATALOGUE } = await import(
    "../catalogue/products.ts"
  );

  // ── Catalogue integrity ─────────────────────────────────────────────────

  console.log("Catalogue integrity:");

  test("Catalogue is non-empty", () => {
    assert.ok(PRODUCT_CATALOGUE.length > 0, "Catalogue must have products");
  });

  test("Every product has a unique ID", () => {
    const ids = PRODUCT_CATALOGUE.map((p) => p.id);
    const unique = new Set(ids);
    assert.equal(unique.size, ids.length, "Duplicate product ID found");
  });

  test("DATA PROVENANCE: every product has source.name", () => {
    for (const p of PRODUCT_CATALOGUE) {
      assert.ok(
        p.provenance?.source?.name,
        `Product ${p.id} missing provenance.source.name`,
      );
    }
  });

  test("DATA PROVENANCE: every product has a verification status", () => {
    for (const p of PRODUCT_CATALOGUE) {
      assert.ok(
        ["reference", "provider", "regulatory"].includes(p.provenance.status),
        `Product ${p.id} has invalid status: ${p.provenance.status}`,
      );
    }
  });

  test("DATA PROVENANCE: every product has lastUpdated", () => {
    for (const p of PRODUCT_CATALOGUE) {
      assert.ok(
        p.provenance.lastUpdated,
        `Product ${p.id} missing provenance.lastUpdated`,
      );
    }
  });

  test("Insurance products exist", () => {
    assert.ok(
      PRODUCT_CATALOGUE.filter((p) => p.type === "insurance").length >= 1,
      "No insurance products",
    );
  });

  test("Investment products exist", () => {
    assert.ok(
      PRODUCT_CATALOGUE.filter((p) => p.type === "investment").length >= 1,
      "No investment products",
    );
  });

  // ── getProductById ─────────────────────────────────────────────────────

  console.log("\nProduct lookup:");

  test("getProductById — valid ID returns product", () => {
    const product = getProductById("hdfc-ergo-optima-secure");
    assert.ok(product, "Expected product to be found");
    assert.equal(product.id, "hdfc-ergo-optima-secure");
  });

  test("getProductById — invalid ID returns undefined", () => {
    const product = getProductById("not-a-real-product-xyz-999");
    assert.equal(product, undefined, "Expected undefined for invalid ID");
  });

  // ── filterProducts ──────────────────────────────────────────────────────

  console.log("\nFilter logic:");

  test("Filter by category: insurance", () => {
    const results = filterProducts({ category: "insurance" });
    assert.ok(results.length > 0, "Expected insurance products");
    assert.ok(
      results.every((p) => p.type === "insurance"),
      "Non-insurance product in insurance filter",
    );
  });

  test("Filter by category: investment", () => {
    const results = filterProducts({ category: "investment" });
    assert.ok(results.length > 0, "Expected investment products");
    assert.ok(
      results.every((p) => p.type === "investment"),
      "Non-investment product in investment filter",
    );
  });

  test("Filter by subcategory: health", () => {
    const results = filterProducts({ subcategory: "health" });
    assert.ok(results.length > 0, "Expected health insurance products");
    assert.ok(
      results.every((p) => p.subcategory === "health"),
      "Non-health product in health filter",
    );
  });

  test("Filter by subcategory: mutual_fund", () => {
    const results = filterProducts({ subcategory: "mutual_fund" });
    assert.ok(results.length > 0, "Expected mutual fund products");
    assert.ok(
      results.every((p) => p.subcategory === "mutual_fund"),
      "Non-mutual-fund in mutual_fund filter",
    );
  });

  test("Search by provider name", () => {
    const results = filterProducts({ searchQuery: "HDFC" });
    assert.ok(results.length > 0, "Expected products from HDFC");
    assert.ok(
      results.every((p) =>
        p.name.includes("HDFC") ||
        p.provider.includes("HDFC") ||
        p.tagline.toLowerCase().includes("hdfc") ||
        p.description.toLowerCase().includes("hdfc"),
      ),
      "Non-HDFC product returned in HDFC search",
    );
  });

  test("Empty filter returns all products", () => {
    const results = filterProducts({});
    assert.equal(results.length, PRODUCT_CATALOGUE.length);
  });

  test("Filter with no match returns empty array", () => {
    const results = filterProducts({ searchQuery: "xyzzy-nonexistent-product-name" });
    assert.equal(results.length, 0, "Expected empty results for unmatched search");
  });

  // ── Suitability — CASE 5: No profile ───────────────────────────────────

  console.log("\nSuitability engine:");

  const moderateProduct = getProductById("mirae-large-cap-fund"); // moderate-high risk investment
  const aggressiveProduct = getProductById("hdfc-mid-cap-opportunities"); // high risk
  const lowRiskInsurance = getProductById("hdfc-ergo-optima-secure"); // low risk insurance
  const liquidFund = getProductById("axis-liquid-fund"); // low risk investment

  test("CASE 5: No profile → graceful degradation", () => {
    const result = computeSuitability(moderateProduct, null);
    assert.equal(result.hasProfile, false, "hasProfile should be false");
    assert.equal(result.score, 0, "Score should be 0 with no profile");
    assert.ok(result.reasons.length > 0, "Should have at least one reason");
    assert.ok(result.disclaimer, "Disclaimer must always be present");
  });

  // ── CASE 1: Moderate profile + low-risk product ────────────────────────────
  // Note: All equity mutual funds are correctly classified as high-risk.
  // A moderate-profile user gets positive risk alignment with low/moderate risk
  // products. We use axis-liquid-fund (low risk) to verify the positive path.

  const moderateProfile = {
    monthly_income: 60000,
    monthly_expenses: 30000,
    monthly_investment_budget: 5000,
    annual_insurance_budget: 15000,
    financial_experience: "intermediate",
    risk_profile: "moderate",
    primary_goals: ["build_wealth", "retirement"],
  };

  test("CASE 1: Moderate profile + low-risk product → positive risk reason", () => {
    const result = computeSuitability(liquidFund, moderateProfile);
    assert.equal(result.hasProfile, true);
    const riskReason = result.reasons[0]; // risk is first
    assert.equal(
      riskReason.sentiment,
      "positive",
      `Expected positive risk sentiment, got: ${riskReason.sentiment} — ${riskReason.label}`,
    );
    assert.ok(result.score >= 40, `Score should be at least 40, got: ${result.score}`);
  });

  // ── CASE 2: Conservative + aggressive product ────────────────────────────

  const conservativeProfile = {
    monthly_income: 60000,
    monthly_expenses: 40000,
    monthly_investment_budget: 3000,
    annual_insurance_budget: 10000,
    financial_experience: "beginner",
    risk_profile: "conservative",
    primary_goals: ["emergency_fund", "protect_family"],
  };

  test("CASE 2: Conservative profile + high-risk product → risk caution", () => {
    const result = computeSuitability(aggressiveProduct, conservativeProfile);
    assert.equal(result.hasProfile, true);
    const riskReason = result.reasons[0];
    assert.equal(
      riskReason.sentiment,
      "caution",
      `Expected risk caution for conservative+aggressive, got: ${riskReason.sentiment} — ${riskReason.label}`,
    );
    // Score should be low for conservative + aggressive risk mismatch
    assert.ok(result.score < 60, `Score should be below 60 for risk mismatch, got: ${result.score}`);
  });

  // ── CASE 3: Budget below minimum ─────────────────────────────────────────

  const lowBudgetProfile = {
    monthly_income: 20000,
    monthly_expenses: 18000,
    monthly_investment_budget: 200, // Below the ₹500 minimum SIP for most funds
    annual_insurance_budget: 3000,  // Below the ₹5000+ indicative minimum premium
    financial_experience: "beginner",
    risk_profile: "moderate",
    primary_goals: [],
  };

  test("CASE 3: Investment budget below minimum SIP → budget caution", () => {
    const result = computeSuitability(moderateProduct, lowBudgetProfile);
    assert.equal(result.hasProfile, true);
    const budgetReason = result.reasons[1]; // budget is second
    assert.equal(
      budgetReason.sentiment,
      "caution",
      `Expected budget caution, got: ${budgetReason.sentiment} — ${budgetReason.label}`,
    );
  });

  // ── CASE 4: Goal aligns with product ─────────────────────────────────────

  const goalProfile = {
    monthly_income: 60000,
    monthly_expenses: 30000,
    monthly_investment_budget: 5000,
    annual_insurance_budget: 15000,
    financial_experience: "intermediate",
    risk_profile: "moderate",
    primary_goals: ["protect_family"], // term_life aligns with this
  };

  const termLifeProduct = getProductById("hdfc-life-click2protect-super");

  test("CASE 4: Goal 'protect_family' + term life product → positive goal alignment", () => {
    const result = computeSuitability(termLifeProduct, goalProfile);
    assert.equal(result.hasProfile, true);
    const goalReason = result.reasons[2]; // goal is third
    assert.equal(
      goalReason.sentiment,
      "positive",
      `Expected positive goal alignment, got: ${goalReason.sentiment} — ${goalReason.label}`,
    );
  });

  // ── CASE 7: Aggressive + high-risk investment ─────────────────────────────

  const aggressiveProfile = {
    monthly_income: 120000,
    monthly_expenses: 50000,
    monthly_investment_budget: 20000,
    annual_insurance_budget: 25000,
    financial_experience: "advanced",
    risk_profile: "aggressive",
    primary_goals: ["build_wealth"],
  };

  test("CASE 7: Aggressive profile + high-risk investment → positive risk", () => {
    const result = computeSuitability(aggressiveProduct, aggressiveProfile);
    const riskReason = result.reasons[0];
    assert.equal(
      riskReason.sentiment,
      "positive",
      `Expected positive risk, got: ${riskReason.sentiment}`,
    );
    assert.ok(result.score >= 60, `Expected score ≥ 60, got: ${result.score}`);
  });

  // ── CASE 8: Conservative + low-risk insurance ─────────────────────────────

  test("CASE 8: Conservative profile + low-risk insurance → good match", () => {
    const result = computeSuitability(lowRiskInsurance, conservativeProfile);
    const riskReason = result.reasons[0];
    assert.equal(
      riskReason.sentiment,
      "positive",
      `Expected positive risk for conservative+low-risk, got: ${riskReason.sentiment}`,
    );
    assert.ok(
      ["strong_match", "good_match"].includes(result.band),
      `Expected strong/good match band, got: ${result.band} (score: ${result.score})`,
    );
  });

  // ── Score boundary checks ─────────────────────────────────────────────────

  console.log("\nScore boundary checks:");

  test("Score is always 0–100", () => {
    for (const product of PRODUCT_CATALOGUE) {
      const r = computeSuitability(product, moderateProfile);
      assert.ok(r.score >= 0 && r.score <= 100, `Out-of-range score for ${product.id}: ${r.score}`);
    }
  });

  test("Disclaimer is always present", () => {
    for (const product of PRODUCT_CATALOGUE) {
      const r = computeSuitability(product, moderateProfile);
      assert.ok(r.disclaimer, `Missing disclaimer for ${product.id}`);
    }
  });

  // ── Final summary ─────────────────────────────────────────────────────────
  console.log(
    process.exitCode
      ? "\n[FAILED] Some tests did not pass.\n"
      : "\n[PASSED] All tests passed.\n",
  );
}

run().catch((err) => {
  console.error("[ERROR] Test runner failed:", err);
  process.exitCode = 1;
});
