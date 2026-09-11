/**
 * NIRNAY — Compare Utilities & Builder Tests
 *
 * Tests for:
 * - resolveCompareProducts (URL param validation)
 * - buildCompareUrl
 * - addToCompareSet / removeFromCompareSet
 * - buildComparisonSections (structure, category awareness)
 * - buildCompareSummary
 *
 * Run: npx tsx lib/compare/compare.test.mts
 */

import assert from "node:assert/strict";

async function run() {
  const { resolveCompareProducts, buildCompareUrl, addToCompareSet, removeFromCompareSet, MAX_COMPARE_PRODUCTS } =
    await import("./utils.ts");
  const { buildComparisonSections, buildCompareSummary } = await import("./builder.ts");
  const { getProductById } = await import("../catalogue/products.ts");
  const { computeSuitability } = await import("../suitability/engine.ts");

  console.log("\n[NIRNAY Compare — Test Suite]\n");

  function test(name: string, fn: () => void) {
    try {
      fn();
      console.log(`  ✓ ${name}`);
    } catch (err: unknown) {
      console.error(`  ✗ ${name}`);
      console.error(`    ${err instanceof Error ? err.message : String(err)}`);
      process.exitCode = 1;
    }
  }

  // ── Constants ─────────────────────────────────────────────────────────────

  const VALID_ID_1 = "hdfc-ergo-optima-secure";       // insurance / health
  const VALID_ID_2 = "star-health-comprehensive";      // insurance / health
  const VALID_ID_3 = "mirae-large-cap-fund";           // investment / mutual_fund
  const VALID_ID_4 = "hdfc-mid-cap-opportunities";     // investment / mutual_fund
  const INVALID_ID = "not-a-real-product-xyz-99999";

  // ── resolveCompareProducts ────────────────────────────────────────────────

  console.log("resolveCompareProducts:");

  test("Empty array → empty result", () => {
    const result = resolveCompareProducts([]);
    assert.equal(result.length, 0);
  });

  test("One valid ID → one product", () => {
    const result = resolveCompareProducts([VALID_ID_1]);
    assert.equal(result.length, 1);
    assert.equal(result[0].id, VALID_ID_1);
  });

  test("Two valid IDs → two products", () => {
    const result = resolveCompareProducts([VALID_ID_1, VALID_ID_2]);
    assert.equal(result.length, 2);
  });

  test("Three valid IDs → three products", () => {
    const result = resolveCompareProducts([VALID_ID_1, VALID_ID_2, VALID_ID_3]);
    assert.equal(result.length, 3);
  });

  test("Four IDs → capped at MAX_COMPARE_PRODUCTS", () => {
    const result = resolveCompareProducts([VALID_ID_1, VALID_ID_2, VALID_ID_3, VALID_ID_4]);
    assert.equal(result.length, MAX_COMPARE_PRODUCTS);
    assert.equal(result.length, 3);
  });

  test("Invalid ID → silently ignored", () => {
    const result = resolveCompareProducts([INVALID_ID]);
    assert.equal(result.length, 0, "Invalid ID should produce no products");
  });

  test("Mixed valid + invalid → only valid returned", () => {
    const result = resolveCompareProducts([VALID_ID_1, INVALID_ID, VALID_ID_2]);
    assert.equal(result.length, 2);
    assert.equal(result[0].id, VALID_ID_1);
    assert.equal(result[1].id, VALID_ID_2);
  });

  test("Duplicate ID → deduplicated to one", () => {
    const result = resolveCompareProducts([VALID_ID_1, VALID_ID_1]);
    assert.equal(result.length, 1, "Duplicate should be deduplicated");
  });

  test("All duplicates of one ID → one product", () => {
    const result = resolveCompareProducts([VALID_ID_1, VALID_ID_1, VALID_ID_1, VALID_ID_1]);
    assert.equal(result.length, 1);
  });

  test("Returns correct Product objects", () => {
    const result = resolveCompareProducts([VALID_ID_1, VALID_ID_3]);
    assert.equal(result[0].type, "insurance");
    assert.equal(result[1].type, "investment");
  });

  // ── buildCompareUrl ───────────────────────────────────────────────────────

  console.log("\nbuildCompareUrl:");

  test("Empty array → /compare", () => {
    const url = buildCompareUrl([]);
    assert.equal(url, "/compare");
  });

  test("One ID → /compare?add=<id>", () => {
    const url = buildCompareUrl([VALID_ID_1]);
    assert.ok(url.includes("add="), "URL should include add= param");
    assert.ok(url.includes(VALID_ID_1));
  });

  test("Two IDs → URL with two add params", () => {
    const url = buildCompareUrl([VALID_ID_1, VALID_ID_2]);
    const count = (url.match(/add=/g) ?? []).length;
    assert.equal(count, 2);
  });

  test("Deduplicates IDs in URL", () => {
    const url = buildCompareUrl([VALID_ID_1, VALID_ID_1]);
    const count = (url.match(/add=/g) ?? []).length;
    assert.equal(count, 1, "Should deduplicate in URL");
  });

  test("Caps at MAX_COMPARE_PRODUCTS", () => {
    const url = buildCompareUrl([VALID_ID_1, VALID_ID_2, VALID_ID_3, VALID_ID_4]);
    const count = (url.match(/add=/g) ?? []).length;
    assert.equal(count, MAX_COMPARE_PRODUCTS);
  });

  // ── addToCompareSet ───────────────────────────────────────────────────────

  console.log("\naddToCompareSet:");

  test("Add to empty set", () => {
    const result = addToCompareSet([], VALID_ID_1);
    assert.deepEqual(result, [VALID_ID_1]);
  });

  test("Add unique ID to existing set", () => {
    const result = addToCompareSet([VALID_ID_1], VALID_ID_2);
    assert.equal(result.length, 2);
    assert.ok(result.includes(VALID_ID_2));
  });

  test("Add duplicate ID → unchanged set", () => {
    const before = [VALID_ID_1, VALID_ID_2];
    const result = addToCompareSet(before, VALID_ID_1);
    assert.deepEqual(result, before);
  });

  test("Add when at max → unchanged set", () => {
    const full = [VALID_ID_1, VALID_ID_2, VALID_ID_3];
    const result = addToCompareSet(full, VALID_ID_4);
    assert.deepEqual(result, full, "Should not add when at max");
  });

  // ── removeFromCompareSet ──────────────────────────────────────────────────

  console.log("\nremoveFromCompareSet:");

  test("Remove existing ID", () => {
    const result = removeFromCompareSet([VALID_ID_1, VALID_ID_2], VALID_ID_1);
    assert.deepEqual(result, [VALID_ID_2]);
  });

  test("Remove non-existent ID → unchanged", () => {
    const before = [VALID_ID_1, VALID_ID_2];
    const result = removeFromCompareSet(before, INVALID_ID);
    assert.deepEqual(result, before);
  });

  test("Remove from empty set → empty", () => {
    const result = removeFromCompareSet([], VALID_ID_1);
    assert.deepEqual(result, []);
  });

  test("Remove last item → empty set", () => {
    const result = removeFromCompareSet([VALID_ID_1], VALID_ID_1);
    assert.deepEqual(result, []);
  });

  // ── buildComparisonSections ───────────────────────────────────────────────

  console.log("\nbuildComparisonSections:");

  const profile = {
    monthly_income: 80000,
    monthly_expenses: 40000,
    monthly_investment_budget: 10000,
    annual_insurance_budget: 20000,
    financial_experience: "intermediate" as const,
    risk_profile: "moderate" as const,
    primary_goals: ["protect_family", "build_wealth"],
  };

  function makeSuitabilityMap(products: Array<{ id: string }>) {
    const allProducts = products.map((p) => getProductById(p.id)!);
    return Object.fromEntries(
      allProducts.map((p) => [p.id, computeSuitability(p, profile)]),
    );
  }

  test("Empty products → empty sections", () => {
    const sections = buildComparisonSections([], {});
    assert.equal(sections.length, 0);
  });

  test("One insurance product → sections include overview", () => {
    const p = getProductById(VALID_ID_1)!;
    const sm = makeSuitabilityMap([p]);
    const sections = buildComparisonSections([p], sm);
    const overview = sections.find((s) => s.title === "Overview");
    assert.ok(overview, "Should have Overview section");
  });

  test("Insurance products → includes insurance cost section", () => {
    const p1 = getProductById(VALID_ID_1)!;
    const p2 = getProductById(VALID_ID_2)!;
    const sm = makeSuitabilityMap([p1, p2]);
    const sections = buildComparisonSections([p1, p2], sm);
    const insuranceCost = sections.find((s) => s.title.includes("Insurance"));
    assert.ok(insuranceCost, "Should include insurance cost section");
  });

  test("Investment products → includes investment cost section", () => {
    const p1 = getProductById(VALID_ID_3)!;
    const p2 = getProductById(VALID_ID_4)!;
    const sm = makeSuitabilityMap([p1, p2]);
    const sections = buildComparisonSections([p1, p2], sm);
    const investmentCost = sections.find((s) => s.title.includes("Investment"));
    assert.ok(investmentCost, "Should include investment cost section");
  });

  test("Insurance-only → no investment cost section", () => {
    const p1 = getProductById(VALID_ID_1)!;
    const p2 = getProductById(VALID_ID_2)!;
    const sm = makeSuitabilityMap([p1, p2]);
    const sections = buildComparisonSections([p1, p2], sm);
    const investmentCost = sections.find((s) => s.title.includes("Investment"));
    assert.equal(investmentCost, undefined, "Insurance-only should not have investment cost section");
  });

  test("Investment-only → no insurance cost section", () => {
    const p1 = getProductById(VALID_ID_3)!;
    const p2 = getProductById(VALID_ID_4)!;
    const sm = makeSuitabilityMap([p1, p2]);
    const sections = buildComparisonSections([p1, p2], sm);
    const insuranceCost = sections.find((s) => s.title.includes("Insurance"));
    assert.equal(insuranceCost, undefined, "Investment-only should not have insurance cost section");
  });

  test("Mixed set → both cost sections present", () => {
    const p1 = getProductById(VALID_ID_1)!;  // insurance
    const p2 = getProductById(VALID_ID_3)!;  // investment
    const sm = makeSuitabilityMap([p1, p2]);
    const sections = buildComparisonSections([p1, p2], sm);
    const ic = sections.find((s) => s.title.includes("Insurance"));
    const inv = sections.find((s) => s.title.includes("Investment"));
    assert.ok(ic, "Mixed should have insurance cost section");
    assert.ok(inv, "Mixed should have investment cost section");
  });

  test("All sections have same number of cells as products", () => {
    const products = [
      getProductById(VALID_ID_1)!,
      getProductById(VALID_ID_2)!,
      getProductById(VALID_ID_3)!,
    ];
    const sm = makeSuitabilityMap(products);
    const sections = buildComparisonSections(products, sm);
    for (const section of sections) {
      for (const row of section.rows) {
        assert.equal(
          row.cells.length,
          products.length,
          `Row "${row.label}" in "${section.title}" has wrong number of cells: ${row.cells.length} (expected ${products.length})`,
        );
      }
    }
  });

  test("Suitability section present with profile", () => {
    const p1 = getProductById(VALID_ID_1)!;
    const sm = makeSuitabilityMap([p1]);
    const sections = buildComparisonSections([p1], sm);
    const suitSection = sections.find((s) => s.title === "Profile Match");
    assert.ok(suitSection, "Should have Profile Match section");
    assert.ok(suitSection.rows[0].cells[0].value.includes("/"), "Score should include '/' separator");
  });

  test("Suitability section with no profile → '—' cells", () => {
    const p1 = getProductById(VALID_ID_1)!;
    const noProfileMap: Record<string, ReturnType<typeof computeSuitability>> = {
      [p1.id]: computeSuitability(p1, null),
    };
    const sections = buildComparisonSections([p1], noProfileMap);
    const suitSection = sections.find((s) => s.title === "Profile Match");
    assert.ok(suitSection);
    // With no profile, cell should not show a score
    const scoreCell = suitSection.rows[0].cells[0];
    assert.ok(!scoreCell.value.includes("/"), "No-profile cell should not show score");
  });

  test("Provenance section always present", () => {
    const p1 = getProductById(VALID_ID_1)!;
    const sm = makeSuitabilityMap([p1]);
    const sections = buildComparisonSections([p1], sm);
    const prov = sections.find((s) => s.title === "Data Source");
    assert.ok(prov, "Should have Data Source section");
  });

  // ── buildCompareSummary ───────────────────────────────────────────────────

  console.log("\nbuildCompareSummary:");

  test("Less than 2 products → empty summary", () => {
    const p1 = getProductById(VALID_ID_1)!;
    const sm = makeSuitabilityMap([p1]);
    const summary = buildCompareSummary([p1], sm);
    assert.equal(summary.length, 0, "1 product should produce empty summary");
  });

  test("2 insurance products → summary items generated", () => {
    const p1 = getProductById(VALID_ID_1)!;
    const p2 = getProductById(VALID_ID_2)!;
    const sm = makeSuitabilityMap([p1, p2]);
    const summary = buildCompareSummary([p1, p2], sm);
    assert.ok(summary.length > 0, "Should generate summary items for 2 products");
  });

  test("Mixed category → includes category caution item", () => {
    const p1 = getProductById(VALID_ID_1)!;  // insurance
    const p2 = getProductById(VALID_ID_3)!;  // investment
    const sm = makeSuitabilityMap([p1, p2]);
    const summary = buildCompareSummary([p1, p2], sm);
    const hasTypeCaution = summary.some(
      (item) => item.label.toLowerCase().includes("different financial purposes"),
    );
    assert.ok(hasTypeCaution, "Mixed category comparison should note different purposes");
  });

  test("Same-risk products → risk observation reflects uniformity", () => {
    // Both health insurance products have riskLevel: low
    const p1 = getProductById(VALID_ID_1)!;
    const p2 = getProductById(VALID_ID_2)!;
    const sm = makeSuitabilityMap([p1, p2]);
    const summary = buildCompareSummary([p1, p2], sm);
    const riskItem = summary[0];
    assert.ok(
      riskItem.label.toLowerCase().includes("same risk level") ||
        riskItem.label.toLowerCase().includes("share the same"),
      "Same-risk comparison should note uniformity",
    );
  });

  // ── Summary ───────────────────────────────────────────────────────────────
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
