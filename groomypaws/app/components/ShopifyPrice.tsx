"use client";

import { useEffect, useState } from "react";
import {
  fetchShopifyProduct,
  formatMoney,
  type ShopifyProduct,
} from "../lib/shopify";

export default function ShopifyPrice() {
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    let active = true;
    fetchShopifyProduct()
      .then((p) => {
        if (active) setProduct(p);
      })
      .catch(() => {
        if (active) setErrored(true);
      });
    return () => {
      active = false;
    };
  }, []);

  // While loading, show a skeleton so the layout doesn't jump.
  if (!product && !errored) {
    return (
      <div className="flex items-baseline gap-4 mb-4" aria-busy="true">
        <span className="h-10 w-28 rounded bg-gray-200 animate-pulse" />
        <span className="h-6 w-20 rounded bg-gray-100 animate-pulse" />
      </div>
    );
  }

  // If Shopify is unreachable, render nothing rather than a stale/fake price.
  if (errored || !product) return null;

  const hasDiscount =
    product.compareAtPrice != null &&
    product.compareAtPrice.amount > product.price.amount;

  const savePct = hasDiscount
    ? Math.round((1 - product.price.amount / product.compareAtPrice!.amount) * 100)
    : 0;

  return (
    <div className="flex items-baseline gap-4 mb-4">
      <span className="text-4xl font-bold text-gray-900">
        {formatMoney(product.price)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-lg text-gray-400 line-through">
            {formatMoney(product.compareAtPrice!)}
          </span>
          <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
            Save {savePct}%
          </span>
        </>
      )}
    </div>
  );
}
