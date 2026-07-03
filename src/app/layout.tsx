import type { Metadata } from "next";
import { outfit, playfair } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "82° — The Heat That Remembers",
  description:
    "Premium artisanal radiators handcrafted in Karaköy, Istanbul. A modern high-end editorial showcase of heating design.",
  keywords: [
    "editorial radiator",
    "minimalist radiator",
    "82 degrees",
    "modern home design",
    "luxury radiator",
  ],
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
      <body className="min-h-screen flex flex-col bg-black-pure text-warm-white">
        {children}
      </body>
    </html>
  );
}
