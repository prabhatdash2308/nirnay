import { describe, it, expect, vi } from "vitest";
import {
  resolveCompareProducts,
  buildCompareUrl,
  addToCompareSet,
  removeFromCompareSet,
} from "./utils";

// Mock the catalogue to isolate tests
vi.mock("@/lib/catalogue/products", () => ({
  getProductById: vi.fn((id: string) => {
    if (id.startsWith("product-")) {
      return { id, name: id.replace("product-", "Product ") };
    }
    return undefined; // Invalid product
  }),
}));

describe("Compare Utilities (Phase 6 Regression Tests)", () => {
  describe("addToCompareSet", () => {
    it("1. Existing: A, Add: B -> Expected: A,B", () => {
      const existing = ["product-a"];
      const result = addToCompareSet(existing, "product-b");
      expect(result).toEqual(["product-a", "product-b"]);
    });

    it("2. Existing: A,B, Add: C -> Expected: A,B,C", () => {
      const existing = ["product-a", "product-b"];
      const result = addToCompareSet(existing, "product-c");
      expect(result).toEqual(["product-a", "product-b", "product-c"]);
    });

    it("3. Existing: A,B,C, Add: D -> Expected: A,B,C (Max enforced)", () => {
      const existing = ["product-a", "product-b", "product-c"];
      const result = addToCompareSet(existing, "product-d");
      expect(result).toEqual(["product-a", "product-b", "product-c"]);
    });

    it("4. Existing: A, Add: A -> Expected: A", () => {
      const existing = ["product-a"];
      const result = addToCompareSet(existing, "product-a");
      expect(result).toEqual(["product-a"]);
    });

    it("5. Existing: A,B, Add: A -> Expected: A,B", () => {
      const existing = ["product-a", "product-b"];
      const result = addToCompareSet(existing, "product-a");
      expect(result).toEqual(["product-a", "product-b"]);
    });

    it("7. Empty, Add: A -> Expected: A", () => {
      const existing: string[] = [];
      const result = addToCompareSet(existing, "product-a");
      expect(result).toEqual(["product-a"]);
    });
  });

  describe("resolveCompareProducts", () => {
    it("6. Existing: invalid, Add: A -> Expected: A", () => {
      // simulate the URL parsing
      const urlParams = ["invalid-id", "product-a"];
      const resolved = resolveCompareProducts(urlParams);
      expect(resolved.map((p) => p.id)).toEqual(["product-a"]);
    });
  });

  describe("buildCompareUrl", () => {
    it("8. URL serialization preserves all selected products", () => {
      const ids = ["product-a", "product-b", "product-c"];
      const url = buildCompareUrl(ids);
      expect(url).toBe("/compare?add=product-a&add=product-b&add=product-c");
    });
  });

  describe("removeFromCompareSet", () => {
    it("9. Removing B from: A,B,C -> results in: A,C", () => {
      const existing = ["product-a", "product-b", "product-c"];
      const result = removeFromCompareSet(existing, "product-b");
      expect(result).toEqual(["product-a", "product-c"]);
    });
  });

  describe("clearing", () => {
    it("10. Clearing results in empty URL", () => {
      // In hooks, clearAll just navigates to "/compare".
      // Let's verify buildCompareUrl with empty array behaves correctly if used
      expect(buildCompareUrl([])).toBe("/compare");
    });
  });
});
