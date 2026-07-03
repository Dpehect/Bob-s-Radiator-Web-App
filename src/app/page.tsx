"use client";

import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Collection from "@/components/Collection";
import TheForge from "@/components/TheForge";
import TheLivingKiln from "@/components/kiln/TheLivingKiln";
import Heritage from "@/components/Heritage";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import LoadingScreen from "@/components/LoadingScreen";

/**
 * Main application Page composing all core editorial sections.
 */
export default function Home() {
  return (
    <>
      <LoadingScreen />
      <CustomCursor />
      
      <Navigation />

      <main className="flex-1 w-full bg-black-pure">
        <Hero />
        <About />
        <Collection />
        <TheForge />
        <TheLivingKiln />
        <Heritage />
      </main>

      <Footer />
    </>
  );
}
