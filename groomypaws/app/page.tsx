"use client";

import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import Link from "next/link";
import { Star, ShieldCheck, HeartPulse, Sparkles, Play } from "lucide-react";
import ShopifyBuyButton from "./components/ShopifyBuyButton";
import ShopifyPrice from "./components/ShopifyPrice";

type Media = {
  type: "video" | "image";
  src: string;
  alt: string;
};

// Gallery media: the product video is the lead/main item, images follow.
// Filenames contain spaces/parens, so encodeURI() is applied when rendering.
// Hoisted out of the component so the array isn't recreated on every render.
const MEDIA: Media[] = [
  { type: "video", src: "/video/catvideo.mp4", alt: "GroomyPaws brush in action" },
  { type: "image", src: "/image/image 1 (1).png", alt: "GroomyPaws Pet Brush" },
  { type: "image", src: "/image/image 1 (2).jpg", alt: "GroomyPaws brush close-up" },
  { type: "image", src: "/image/image 1 (3).jpg", alt: "GroomyPaws brush in use" },
  { type: "image", src: "/image/image 1 (3).png", alt: "GroomyPaws brush detail" },
];

const VALUE_PROPS = [
  {
    icon: HeartPulse,
    title: "Pain-Free Massage",
    desc: "Gentle on sensitive skin",
  },
  {
    icon: Sparkles,
    title: "One-Click Clean",
    desc: "Peel off hair instantly",
  },
  {
    icon: ShieldCheck,
    title: "30-Day Guarantee",
    desc: "Love it or return it",
  },
];

export default function ProductPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = MEDIA[activeIndex];

  // Honour the OS "reduce motion" setting: disable transforms/transitions.
  const reduceMotion = useReducedMotion();

  // Parent → children stagger so details reveal in a pleasant cascade.
  const container: Variants = {
    hidden: {},
    show: {
      transition: reduceMotion ? {} : { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const item: Variants = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  return (
    <main className="min-h-screen bg-gray-50 py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Breadcrumb Navigation */}
        <nav className="text-sm text-gray-500 mb-6 sm:mb-8" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex flex-wrap">
            <li className="flex items-center">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <Link href="/shop" className="hover:text-blue-600 transition-colors">Shop</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-900 font-medium" aria-current="page">
              Grooming
            </li>
          </ol>
        </nav>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

          {/* Left Column: Media Gallery */}
          <motion.div
            className="flex flex-col gap-3 sm:gap-4"
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Main Media — crossfades between selections */}
            <div className="relative aspect-square w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.src}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  {active.type === "video" ? (
                    <video
                      src={encodeURI(active.src)}
                      className="h-full w-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={encodeURI(active.src)}
                      alt={active.alt}
                      className="h-full w-full object-cover"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {MEDIA.map((mediaItem, index) => (
                <motion.button
                  key={mediaItem.src}
                  onClick={() => setActiveIndex(index)}
                  whileHover={reduceMotion ? undefined : { scale: 1.05 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-colors ${
                    activeIndex === index
                      ? "border-blue-600"
                      : "border-transparent hover:border-blue-300"
                  }`}
                  aria-label={
                    mediaItem.type === "video"
                      ? "View product video"
                      : `View product image ${index}`
                  }
                  aria-pressed={activeIndex === index}
                >
                  {mediaItem.type === "video" ? (
                    <>
                      <video
                        src={encodeURI(mediaItem.src)}
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
                      src={encodeURI(mediaItem.src)}
                      alt={mediaItem.alt}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Product Details */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col justify-center"
          >
            {/* Badges & Title */}
            <motion.div variants={item} className="mb-6">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-4 tracking-wide uppercase">
                Best Seller
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                The GroomyPaws™ Ultimate Pet Epilator &amp; Massage Brush
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
            </motion.div>

            {/* Price & Description */}
            <motion.div variants={item} className="mb-8">
              <ShopifyPrice />
              <p className="text-base text-gray-600 leading-relaxed">
                Remove floating hair, deeply massage your pet&apos;s skin, and keep your home fur-free.
                Designed with ergonomic grip and skin-safe silicone bristles for a pain-free, spa-like grooming experience your dog or cat will love.
              </p>
            </motion.div>

            {/* Call to Action — Shopify Buy Button (real checkout) */}
            <motion.div variants={item} className="mb-8 space-y-4">
              <ShopifyBuyButton />
              <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                <ShieldCheck size={16} className="text-green-500" /> Secure checkout &amp; Free Shipping
              </p>
            </motion.div>

            {/* Value Propositions */}
            <motion.div
              variants={item}
              className="grid grid-cols-3 gap-3 sm:gap-4 border-t border-gray-200 pt-6 sm:pt-8"
            >
              {VALUE_PROPS.map(({ icon: Icon, title, desc }) => (
                <motion.div
                  key={title}
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex flex-col items-center text-center gap-2"
                >
                  <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900">{title}</h3>
                  <p className="text-xs text-gray-500">{desc}</p>
                </motion.div>
              ))}
            </motion.div>

          </motion.div>
        </div>
      </div>
    </main>
  );
}
