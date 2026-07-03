"use client";

import React, { useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import BentoGrid from "@/components/BentoGrid";
import ThreeDStage from "@/components/ThreeDStage";
import Footer from "@/components/Footer";

export default function Home() {
  const specsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll reveal observer for Specifications
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = specsRef.current?.querySelectorAll(".animate-on-scroll");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* 3D background stage - fixed overlay behind everything */}
      <ThreeDStage />

      {/* Foreground scrollable content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navigation Bar */}
        <Navigation />

        <main className="flex-1">
          {/* Hero Section */}
          <HeroSection />

          {/* Bento Grid Features Section */}
          <BentoGrid />

          {/* Specifications Section (Typographic Asymmetrical Layout) */}
          <section
            ref={specsRef}
            id="specifications"
            className="py-32 px-6 border-t-2 border-white bg-black relative"
          >
            <div className="max-w-7xl mx-auto">
              
              {/* Header */}
              <div className="mb-20">
                <span className="text-xs tracking-[0.25em] font-sans font-extralight text-accent block mb-4">
                  METRIC MATRIX
                </span>
                <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-serif font-black leading-[0.9] text-white tracking-[-0.03em]">
                  TECHNICAL <br />
                  SPECIFICATIONS
                </h2>
              </div>

              {/* Asymmetrical Spec Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Description block */}
                <div className="lg:col-span-4 flex flex-col justify-between">
                  <p className="text-sm font-sans font-extralight leading-relaxed text-white/70 max-w-sm">
                    EACH HOUSING IS MACHINED FROM A SINGLE BLOCK OF AEROSPACE-GRADE ALUMINUM AND HAND-FINISHED TO EXACTING TOLERANCES. THERE ARE NO PLASTIC CLIPS. NO WEAK POINTS.
                  </p>
                  
                  <div className="hidden lg:block border-2 border-white p-6 mt-12 bg-black max-w-max hover:border-accent transition-colors duration-300" data-cursor="snap">
                    <span className="text-[10px] font-mono text-accent block mb-2">[WARNING]</span>
                    <span className="text-xs font-sans font-extralight text-white">
                      DO NOT OPERATE BEYOND THERMAL LIMITS.
                    </span>
                  </div>
                </div>

                {/* Right Spec Table - 12-column subgrid layout */}
                <div className="lg:col-span-8 flex flex-col gap-6 w-full">
                  {[
                    { label: "MATERIAL", value: "AEROSPACE ALUMINUM 6061-T6" },
                    { label: "WEIGHT", value: "4.85 KG (EXCLUDING COOLANT)" },
                    { label: "COOLING TYPE", value: "FUSION LIQUID LOOP DIRECT" },
                    { label: "COMPATIBILITY", value: "INTEL LGA1700 / AMD AM5" },
                    { label: "FIN COUNT", value: "48 MICRO-FINS PER CHANNEL" },
                    { label: "FIN THICKNESS", value: "0.2 MM ULTRA-SLIM PROFILE" },
                    { label: "MAX DISSIPATION", value: "450 WATTS THERMAL CAPACITY" },
                  ].map((spec, idx) => (
                    <div
                      key={spec.label}
                      className="animate-on-scroll flex items-center justify-between py-6 border-b border-white/20 group hover:border-accent transition-colors duration-300"
                      style={{ transitionDelay: `${idx * 0.05}s` }}
                    >
                      <span className="text-xs font-mono text-white/50 group-hover:text-accent transition-colors duration-300">
                        // 0{idx + 1} {spec.label}
                      </span>
                      <span 
                        className="text-sm md:text-base font-sans font-light tracking-wide text-white group-hover:translate-x-[-8px] transition-transform duration-300"
                        data-cursor="snap"
                      >
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
