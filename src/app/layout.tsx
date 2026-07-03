import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";

// Load Google Fonts for typographic hierarchy
const playfairSerif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BOB'S RADIATOR // Raw Digital Brutalist Experience",
  description: "A high-end, award-winning digital brutalist showcase combining cold metallurgy, raw performance, and high-contrast web architecture.",
  keywords: ["brutalist", "digital art", "3D web", "react three fiber", "next.js 15", "web design"],
  authors: [{ name: "Lead UI/UX Architect" }],
  openGraph: {
    title: "BOB'S RADIATOR // Digital Brutalism",
    description: "A high-end, award-winning digital brutalist showcase combining cold metallurgy and raw performance.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairSerif.variable} ${plusJakartaSans.variable} scroll-smooth`}
    >
      <body className="bg-black text-white antialiased min-h-screen relative selection:bg-accent selection:text-black">
        {/* Custom cursor ring (only active on fine pointer devices) */}
        <CustomCursor />
        
        {/* Lenis Smooth Scroll momentum wrapper */}
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
