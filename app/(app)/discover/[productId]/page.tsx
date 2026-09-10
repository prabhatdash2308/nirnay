import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById, PRODUCT_CATALOGUE } from "@/lib/catalogue/products";
import { ProductDetailClient } from "@/components/discover/product-detail-client";

// ─────────────────────────────────────────────────────────────────────────────
// Static params — pre-render all product pages at build time
// ─────────────────────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return PRODUCT_CATALOGUE.map((p) => ({ productId: p.id }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;
  const product = getProductById(productId);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} — ${product.provider}`,
    description: product.tagline,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = getProductById(productId);

  // Invalid product ID → 404
  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
