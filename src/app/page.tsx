"use client";

import { useEffect, useRef } from "react";
import LoadingIgnition from "@/components/LoadingIgnition";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TheForge from "@/components/TheForge";
import TheArchive from "@/components/TheArchive";
import TheLivingKiln from "@/components/TheLivingKiln";
import EmbersWall from "@/components/EmbersWall";
import CustomCursor from "@/components/CustomCursor";
import EasterEgg from "@/components/EasterEgg";
import HeatHazeFilter from "@/components/HeatHazeFilter";
import { useHeatStore } from "@/store/useHeatStore";

export default function Home() {
  const isLoaded = useHeatStore((state) => state.isLoaded);
  const increaseHeat = useHeatStore((state) => state.increaseHeat);

  // Scroll friction heating velocity tracker
  const lastScrollY = useRef(0);
  const lastTime = useRef(0);
  const heatAccumulator = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    lastScrollY.current = window.scrollY;
    lastTime.current = Date.now();

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();

      const deltaY = Math.abs(currentScrollY - lastScrollY.current);
      const deltaTime = currentTime - lastTime.current;

      if (deltaTime > 0 && deltaY > 0) {
        // Calculate velocity: pixels per millisecond
        const velocity = deltaY / deltaTime;

        // Friction heating threshold
        if (velocity > 0.35) {
          // Accumulate fractional heat increments
          heatAccumulator.current += velocity * 0.06;
          
          if (heatAccumulator.current >= 1.0) {
            const heatToAdd = Math.floor(heatAccumulator.current);
            increaseHeat(heatToAdd);
            heatAccumulator.current -= heatToAdd;
          }
        }
      }

      lastScrollY.current = currentScrollY;
      lastTime.current = currentTime;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [increaseHeat]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center">
      {/* Global Heat Haze SVG filter */}
      <HeatHazeFilter />

      {/* 1. Micro-Details: Custom Cursor Trail */}
      <CustomCursor />

      {/* 2. Micro-Details: Logo Easter Egg Overlay */}
      <EasterEgg />

      {/* 3. Loading/Ignition Experience */}
      <LoadingIgnition />

      {/* 4. Floating Navbar */}
      <Navbar />

      {/* 5. Main Sections Layout */}
      <main className="w-full flex-grow flex flex-col">
        {/* Hero Section */}
        <HeroSection />

        {/* The Forge (Timeline Story Section) */}
        {isLoaded && <TheForge />}

        {/* The Archive (Horizontal Collection Showcase) */}
        {isLoaded && <TheArchive />}

        {/* The Living Kiln (Configurator Section) */}
        {isLoaded && <TheLivingKiln />}

        {/* Embers (Miras Wall Section) */}
        {isLoaded && <EmbersWall />}
      </main>
    </div>
  );
}
