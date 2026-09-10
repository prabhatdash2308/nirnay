/**
 * NIRNAY — Decide Logic Tests
 *
 * Tests for:
 * - generateDecisionGuidance
 *
 * Run: npx tsx lib/decide/decide.test.mts
 */

import assert from "node:assert/strict";

async function run() {
  const { generateDecisionGuidance } = await import("./logic.ts");
  const { getProductById } = await import("../catalogue/products.ts");

  console.log("\n[NIRNAY Decide — Test Suite]\n");

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

  const VALID_ID_1 = "hdfc-ergo-optima-secure";
  const VALID_ID_2 = "star-health-comprehensive";
  const VALID_ID_3 = "mirae-large-cap-fund";

  const p1 = getProductById(VALID_ID_1)!;
  const p2 = getProductById(VALID_ID_2)!;
  const p3 = getProductById(VALID_ID_3)!;

  const profile = {
    monthly_income: 80000,
    monthly_expenses: 40000,
    monthly_investment_budget: 10000,
    annual_insurance_budget: 20000,
    financial_experience: "intermediate" as const,
    risk_profile: "moderate" as const,
    primary_goals: ["protect_family", "build_wealth"],
  };

  // ── generateDecisionGuidance ──────────────────────────────────────────────

  console.log("generateDecisionGuidance:");

  test("Empty product set", () => {
    const guidance = generateDecisionGuidance([], profile);
    assert.equal(guidance.hasProfile, true);
    assert.equal(guidance.strongestMatch, null);
    assert.equal(guidance.otherProducts.length, 0);
    assert.equal(guidance.hasTie, false);
  });

  test("No profile provided", () => {
    const guidance = generateDecisionGuidance([p1, p2], null);
    assert.equal(guidance.hasProfile, false);
    assert.ok(guidance.strongestMatch);
    assert.equal(guidance.otherProducts.length, 1);
    assert.ok(
      guidance.generalCautions[0].includes("Complete your financial profile"),
      "Should advise completing profile"
    );
  });

  test("Single product", () => {
    const guidance = generateDecisionGuidance([p1], profile);
    assert.equal(guidance.hasProfile, true);
    assert.ok(guidance.strongestMatch);
    assert.equal(guidance.strongestMatch!.product.id, p1.id);
    assert.equal(guidance.otherProducts.length, 0);
    assert.equal(guidance.hasTie, false);
  });

  test("Multiple products ranked by score", () => {
    const guidance = generateDecisionGuidance([p3, p1], profile); // p3 is investment, p1 is health insurance. With this profile, they might have different scores.
    assert.ok(guidance.strongestMatch);
    assert.equal(guidance.otherProducts.length, 1);
    const topScore = guidance.strongestMatch!.suitability.score;
    const secondScore = guidance.otherProducts[0].suitability.score;
    assert.ok(topScore >= secondScore, "Should be sorted descending");
  });

  test("Tie handling", () => {
    // Evaluating the same product twice guarantees a tie
    const guidance = generateDecisionGuidance([p1, p1], profile);
    assert.equal(guidance.hasTie, true);
    assert.ok(
      guidance.generalCautions[0].includes("identical match scores"),
      "Should include tie caution"
    );
  });

  test("Separates reasons and cautions", () => {
    const guidance = generateDecisionGuidance([p1], profile);
    const match = guidance.strongestMatch!;
    assert.ok(Array.isArray(match.whyMatches));
    assert.ok(Array.isArray(match.cautions));
    // The engine adds a caution for insurance: "Verify exclusions..."
    assert.ok(match.cautions.length > 0, "Should have at least one caution");
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
