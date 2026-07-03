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
  weight: ["200", "300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BOB'S RADIATOR // Awwwards-style Dynamic Digital Experience",
  description: "Experience the living harmony of cold technology and organic touch. Featuring advanced R3F liquid distortions, GSAP scroll triggers, and Framer Motion spring physics.",
  keywords: ["Awwwards website", "Creative developer", "3D web design", "GSAP ScrollTrigger", "Framer Motion", "React Three Fiber"],
  openGraph: {
    title: "BOB'S RADIATOR // Creative Digital Experience",
    description: "A dynamic portfolio combining advanced WebGL shaders, scroll-driven layouts, and elastic physics.",
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
      <body className="bg-[#050510] text-white antialiased min-h-screen relative selection:bg-cyanAccent selection:text-black">
        {/* Register GSAP plugins on client-side mount */}
        <GsapInitializer />

        {/* Custom elastic cursor ring (only active on fine pointer devices like mouse) */}
        <CustomCursor />
        
        {/* Lenis Smooth Scroll momentum wrapper */}
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
