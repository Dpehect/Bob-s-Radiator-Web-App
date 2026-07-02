import type { Metadata } from "next";
import { outfit, playfair } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "82° — The Heat That Remembers",
  description:
    "Since 1952, we have shaped heat into memory. Premium artisanal radiators handcrafted in Karaköy, Istanbul. Every piece carries the warmth of 70 years of craft.",
  keywords: [
    "artisanal radiators",
    "premium radiators",
    "handcrafted heating",
    "82 degrees",
    "Karaköy Istanbul",
    "luxury home heating",
  ],
  openGraph: {
    title: "82° — The Heat That Remembers",
    description:
      "Premium artisanal radiators handcrafted in Karaköy since 1952.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfair.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
