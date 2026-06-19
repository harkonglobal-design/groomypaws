"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, ShieldCheck, HeartPulse, Sparkles, Play } from "lucide-react";
import ShopifyBuyButton from "./components/ShopifyBuyButton";
import ShopifyPrice from "./components/ShopifyPrice";

type Media = {
  type: "video" | "image";
  src: string;
  alt: string;
};

export default function ProductPage() {
  // Gallery media: the product video is the lead/main item, images follow.
  // Filenames contain spaces/parens, so encodeURI() is applied when rendering.
  const media: Media[] = [
    { type: "video", src: "/video/catvideo.mp4", alt: "GroomyPaws brush in action" },
    { type: "image", src: "/image/image 1 (1).png", alt: "GroomyPaws Pet Brush" },
    { type: "image", src: "/image/image 1 (2).jpg", alt: "GroomyPaws brush close-up" },
    { type: "image", src: "/image/image 1 (3).jpg", alt: "GroomyPaws brush in use" },
    { type: "image", src: "/image/image 1 (3).png", alt: "GroomyPaws brush detail" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const active = media[activeIndex];

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <nav className="text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <a href="/shop" className="hover:text-blue-600 transition-colors">Shop</a>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-900 font-medium" aria-current="page">
              Grooming
            </li>
          </ol>
        </nav>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left Column: Media Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main Media */}
            <div className="relative aspect-square w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              {active.type === "video" ? (
                <video
                  key={active.src}
                  src={encodeURI(active.src)}
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={active.src}
                  src={encodeURI(active.src)}
                  alt={active.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-3">
              {media.map((item, index) => (
                <button
                  key={item.src}
                  onClick={() => setActiveIndex(index)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    activeIndex === index ? "border-blue-600" : "border-transparent hover:border-blue-300"
                  }`}
                  aria-label={
                    item.type === "video" ? "View product video" : `View product image ${index}`
                  }
                >
                  {item.type === "video" ? (
                    <>
                      <video
                        src={encodeURI(item.src)}
                        className="absolute inset-0 h-full w-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-white">
                        <Play size={20} fill="currentColor" />
                      </span>
                    </>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={encodeURI(item.src)}
                      alt={item.alt}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col justify-center"
          >
            {/* Badges & Title */}
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-4 tracking-wide uppercase">
                Best Seller
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                The GroomyPaws™ Ultimate Pet Epilator & Massage Brush
              </h1>
              
              {/* Reviews */}
              <div className="flex items-center gap-2 mb-6 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">4.9/5</span>
                <span className="text-sm text-gray-500 underline">(120 Reviews)</span>
              </div>
            </div>

            {/* Price & Description */}
            <div className="mb-8">
              <ShopifyPrice />
              <p className="text-base text-gray-600 leading-relaxed">
                Remove floating hair, deeply massage your pet's skin, and keep your home fur-free. 
                Designed with ergonomic grip and skin-safe silicone bristles for a pain-free, spa-like grooming experience your dog or cat will love.
              </p>
            </div>

            {/* Call to Action — Shopify Buy Button (real checkout) */}
            <div className="mb-8 space-y-4">
              <ShopifyBuyButton />
              <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                <ShieldCheck size={16} className="text-green-500" /> Secure checkout & Free Shipping
              </p>
            </div>

            {/* Value Propositions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-200 pt-8">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                  <HeartPulse size={24} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Pain-Free Massage</h3>
                <p className="text-xs text-gray-500">Gentle on sensitive skin</p>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">One-Click Clean</h3>
                <p className="text-xs text-gray-500">Peel off hair instantly</p>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">30-Day Guarantee</h3>
                <p className="text-xs text-gray-500">Love it or return it</p>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </main>
  );
}