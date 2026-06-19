// Single source of truth for the Shopify storefront connection.
// The Storefront Access Token is public by design (safe to ship client-side).
export const SHOPIFY_DOMAIN = "gq0qs1-3t.myshopify.com";
export const STOREFRONT_ACCESS_TOKEN = "dcdcbf493a70ab80c17aea2d11b6ca94";
export const PRODUCT_ID = "15048353775981";

const API_VERSION = "2024-10";

export type Money = { amount: number; currencyCode: string };

export type ShopifyProduct = {
  title: string;
  price: Money;
  compareAtPrice: Money | null;
  availableForSale: boolean;
};

const PRODUCT_QUERY = `query Product($id: ID!) {
  product(id: $id) {
    title
    variants(first: 1) {
      nodes {
        availableForSale
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
      }
    }
  }
}`;

function toMoney(node: { amount: string; currencyCode: string } | null): Money | null {
  if (!node) return null;
  return { amount: parseFloat(node.amount), currencyCode: node.currencyCode };
}

/** Fetches live product pricing from the Shopify Storefront API. */
export async function fetchShopifyProduct(): Promise<ShopifyProduct> {
  const res = await fetch(
    `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: PRODUCT_QUERY,
        variables: { id: `gid://shopify/Product/${PRODUCT_ID}` },
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Shopify request failed: ${res.status}`);
  }

  const json = await res.json();
  const product = json?.data?.product;
  const variant = product?.variants?.nodes?.[0];
  if (!product || !variant) {
    throw new Error("Shopify product or variant not found");
  }

  return {
    title: product.title,
    price: toMoney(variant.price)!,
    compareAtPrice: toMoney(variant.compareAtPrice),
    availableForSale: Boolean(variant.availableForSale),
  };
}

/** Formats a Money value using the currency reported by Shopify. */
export function formatMoney({ amount, currencyCode }: Money): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}
