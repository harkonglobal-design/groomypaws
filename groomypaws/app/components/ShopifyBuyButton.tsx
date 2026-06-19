"use client";

import { useEffect, useRef } from "react";
import { SHOPIFY_DOMAIN, STOREFRONT_ACCESS_TOKEN, PRODUCT_ID } from "../lib/shopify";

const SCRIPT_URL =
  "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";

// `%24%7B%7Bamount%7D%7D` decodes to `${{amount}}` — kept from the original embed.
const MONEY_FORMAT = "%24%7B%7Bamount%7D%7D";

// Minimal typing for the global the SDK attaches to window.
type ShopifyComponent = { destroy?: () => void };

type ShopifyUI = {
  createComponent: (
    type: string,
    config: Record<string, unknown>
  ) => Promise<ShopifyComponent> | ShopifyComponent;
  // The SDK tracks every component it creates (product, cart, toggle, modal)
  // here so we can tear them all down on unmount.
  components?: Record<string, ShopifyComponent[] | undefined>;
};

declare global {
  interface Window {
    ShopifyBuy?: {
      UI?: {
        onReady: (client: unknown) => Promise<ShopifyUI>;
      };
      buildClient: (config: { domain: string; storefrontAccessToken: string }) => unknown;
    };
  }
}

export default function ShopifyBuyButton() {
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    // Cancellation flag: onReady()/createComponent() are async and can resolve
    // *after* this effect has been cleaned up (StrictMode, fast navigation).
    // Without this, those late resolutions create orphaned body-level widgets.
    let cancelled = false;
    let ui: ShopifyUI | null = null;
    let productComponent: ShopifyComponent | null = null;

    // The SDK appends the cart, toggle and modal as iframes directly to <body>,
    // outside React's tree, so they survive unmount unless we remove them. This
    // is what leaves a stray floating cart toggle showing "0" on screen.
    function sweepOrphanFrames() {
      document
        .querySelectorAll<HTMLElement>(".shopify-buy-frame")
        .forEach((el) => {
          // Leave the product button (rendered inside our own node) alone.
          if (!node || !node.contains(el)) el.remove();
        });
    }

    function teardown() {
      try {
        productComponent?.destroy?.();
      } catch {
        /* component may already be gone */
      }
      // Destroy every component the SDK created (cart, toggle, modal, …).
      const groups = ui?.components;
      if (groups) {
        for (const group of Object.values(groups)) {
          group?.forEach((c) => {
            try {
              c?.destroy?.();
            } catch {
              /* ignore */
            }
          });
        }
      }
      sweepOrphanFrames();
    }

    function init() {
      const ShopifyBuy = window.ShopifyBuy;
      if (cancelled || !ShopifyBuy?.UI || !node) return;

      // Clear any widgets left over from a previous mount/HMR cycle before we
      // create fresh ones, so toggles can never stack up.
      sweepOrphanFrames();

      const client = ShopifyBuy.buildClient({
        domain: SHOPIFY_DOMAIN,
        storefrontAccessToken: STOREFRONT_ACCESS_TOKEN,
      });

      ShopifyBuy.UI.onReady(client).then((readyUi) => {
        if (cancelled) return;
        ui = readyUi;
        Promise.resolve(
          readyUi.createComponent("product", {
            id: PRODUCT_ID,
            node,
            moneyFormat: MONEY_FORMAT,
          options: {
            product: {
              // Let the button fill our container instead of the embed's grid sizing.
              styles: {
                product: {
                  "max-width": "100%",
                  "margin-bottom": "0px",
                },
                button: {
                  "font-family": "Oxygen, sans-serif",
                  "font-weight": "bold",
                  "font-size": "16px",
                  "padding-top": "16px",
                  "padding-bottom": "16px",
                  ":hover": { "background-color": "#004fe6" },
                  "background-color": "#0058ff",
                  ":focus": { "background-color": "#004fe6" },
                  "border-radius": "14px",
                },
                quantityInput: {
                  "font-size": "16px",
                  "padding-top": "16px",
                  "padding-bottom": "16px",
                },
              },
              contents: {
                img: false,
                title: false,
                price: false,
              },
              text: { button: "Add to cart" },
              googleFonts: ["Oxygen"],
            },
            modalProduct: {
              contents: {
                img: false,
                imgWithCarousel: true,
                button: false,
                buttonWithQuantity: true,
              },
              styles: {
                product: {
                  "@media (min-width: 601px)": {
                    "max-width": "100%",
                    "margin-left": "0px",
                    "margin-bottom": "0px",
                  },
                },
                button: {
                  "font-family": "Oxygen, sans-serif",
                  "font-weight": "bold",
                  "font-size": "16px",
                  "padding-top": "16px",
                  "padding-bottom": "16px",
                  ":hover": { "background-color": "#004fe6" },
                  "background-color": "#0058ff",
                  ":focus": { "background-color": "#004fe6" },
                  "border-radius": "14px",
                  "padding-left": "91px",
                  "padding-right": "91px",
                },
                quantityInput: {
                  "font-size": "16px",
                  "padding-top": "16px",
                  "padding-bottom": "16px",
                },
              },
              googleFonts: ["Oxygen"],
              text: { button: "Add to cart" },
            },
            cart: {
              styles: {
                button: {
                  "font-family": "Oxygen, sans-serif",
                  "font-weight": "bold",
                  "font-size": "16px",
                  "padding-top": "16px",
                  "padding-bottom": "16px",
                  ":hover": { "background-color": "#004fe6" },
                  "background-color": "#0058ff",
                  ":focus": { "background-color": "#004fe6" },
                  "border-radius": "14px",
                },
              },
              text: { total: "Subtotal", button: "Checkout" },
              googleFonts: ["Oxygen"],
            },
            toggle: {
              styles: {
                toggle: {
                  "font-family": "Oxygen, sans-serif",
                  "font-weight": "bold",
                  "background-color": "#0058ff",
                  ":hover": { "background-color": "#004fe6" },
                  ":focus": { "background-color": "#004fe6" },
                },
                count: { "font-size": "16px" },
              },
              googleFonts: ["Oxygen"],
            },
          },
          })
        ).then((comp) => {
          productComponent = comp;
          // Unmounted while createComponent was in flight → clean up immediately.
          if (cancelled) teardown();
        });
      });
    }

    if (window.ShopifyBuy?.UI) {
      init();
    } else {
      // Library missing or its UI module hasn't loaded yet — load the script.
      loadScript(init);
    }

    // On unmount, cancel any in-flight init and destroy the SDK's widgets so a
    // stray floating cart toggle can't linger or stack up on remount.
    return () => {
      cancelled = true;
      teardown();
    };
  }, []);

  return <div ref={nodeRef} className="shopify-buy-button" />;
}

function loadScript(onLoad: () => void) {
  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${SCRIPT_URL}"]`
  );
  if (existing) {
    existing.addEventListener("load", onLoad);
    return;
  }
  const script = document.createElement("script");
  script.async = true;
  script.src = SCRIPT_URL;
  script.onload = onLoad;
  (document.head || document.body).appendChild(script);
}
