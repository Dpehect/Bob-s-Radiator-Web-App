import type { Metadata } from "next";
import { outfit, playfair } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "82° — The Heat That Remembers",
  description:
    "Premium handcrafted artisanal radiators. A modern, minimalist editorial layout inspired by classic metal casting heritage.",
  keywords: [
    "minimalist radiator",
    "editorial heating",
    "82 degrees",
    "awwwards layout design",
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
      className={`${outfit.variable} ${playfair.variable} antialiased scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-black-pure text-white-pure selection:bg-electric-orange selection:text-black-pure">
        {children}
      </body>
    </html>
  );
}
