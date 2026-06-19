"use client";

import { useEffect, useRef } from "react";
import { SHOPIFY_DOMAIN, STOREFRONT_ACCESS_TOKEN, PRODUCT_ID } from "../lib/shopify";

const SCRIPT_URL =
  "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";

// `%24%7B%7Bamount%7D%7D` decodes to `${{amount}}` — kept from the original embed.
const MONEY_FORMAT = "%24%7B%7Bamount%7D%7D";

// Minimal typing for the global the SDK attaches to window.
declare global {
  interface Window {
    ShopifyBuy?: {
      UI?: {
        onReady: (client: unknown) => Promise<{
          createComponent: (type: string, config: Record<string, unknown>) => void;
        }>;
      };
      buildClient: (config: { domain: string; storefrontAccessToken: string }) => unknown;
    };
  }
}

export default function ShopifyBuyButton() {
  const nodeRef = useRef<HTMLDivElement>(null);
  // Guards against React StrictMode double-mounting the component in dev.
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !nodeRef.current) return;
    initialized.current = true;

    function init() {
      const ShopifyBuy = window.ShopifyBuy;
      if (!ShopifyBuy?.UI || !nodeRef.current) return;

      const client = ShopifyBuy.buildClient({
        domain: SHOPIFY_DOMAIN,
        storefrontAccessToken: STOREFRONT_ACCESS_TOKEN,
      });

      ShopifyBuy.UI.onReady(client).then((ui) => {
        ui.createComponent("product", {
          id: PRODUCT_ID,
          node: nodeRef.current,
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
        });
      });
    }

    if (window.ShopifyBuy?.UI) {
      init();
    } else if (window.ShopifyBuy) {
      // Library present but UI not loaded yet — load the full script.
      loadScript(init);
    } else {
      loadScript(init);
    }
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
