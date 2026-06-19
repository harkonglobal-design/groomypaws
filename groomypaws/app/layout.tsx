import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GroomyPaws™ Ultimate Pet Epilator & Massage Brush",
  description:
    "Remove floating hair, deeply massage your pet's skin, and keep your home fur-free with the GroomyPaws™ skin-safe silicone grooming brush for dogs and cats.",
  keywords: [
    "pet grooming brush",
    "dog brush",
    "cat brush",
    "pet epilator",
    "deshedding tool",
  ],
  openGraph: {
    title: "GroomyPaws™ Ultimate Pet Epilator & Massage Brush",
    description:
      "Pain-free, spa-like grooming your dog or cat will love. Secure checkout & free shipping.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0058ff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
