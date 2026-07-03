import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import GsapInitializer from "@/components/GsapInitializer";

// Load Google Fonts for Awwwards typographic hierarchy
const playfairSerif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BOB'S RADIATOR // Playful Warm Digital Art Experience",
  description: "A joyful creative portfolio featuring wiggling 3D jelly spheres, squishy spring-physics buttons, velocity-based custom bubble cursors, and sunny pastel sunset gradients.",
  keywords: ["Awwwards website", "Playful web design", "Creative developer", "GSAP ScrollTrigger", "Framer Motion", "React Three Fiber"],
  openGraph: {
    title: "BOB'S RADIATOR // Bouncy Digital Playground",
    description: "Experience the living harmony of warm sunset tones, soft pillow layouts, and interactive WebGL jelly components.",
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
      <body className="bg-[#faf5ef] text-[#3f2218] antialiased min-h-screen relative selection:bg-pinkAccent selection:text-white">
        {/* Register GSAP plugins on client mount */}
        <GsapInitializer />

        {/* Custom stretchy bubble cursor ring */}
        <CustomCursor />
        
        {/* Lenis Smooth Scroll momentum wrapper */}
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
