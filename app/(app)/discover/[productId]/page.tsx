import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProductById, PRODUCT_CATALOGUE } from "@/lib/catalogue/products";
import { ProductDetailClient } from "@/components/discover/product-detail-client";
import { Loader2 } from "lucide-react";

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

  return (
    <Suspense fallback={<div className="flex items-center justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}>
      <ProductDetailClient product={product} />
    </Suspense>
  );
}
