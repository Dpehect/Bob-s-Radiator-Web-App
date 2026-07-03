"use client";

import React, { useEffect, useRef } from "react";
// motion helps build playful hover springs on list rows
import { motion } from "framer-motion";
// gsap & ScrollTrigger are used to animate the rows sequentially on scroll
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import BentoGrid from "@/components/BentoGrid";
import ThreeDStage from "@/components/ThreeDStage";
import Footer from "@/components/Footer";

export default function Home() {
  const specsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. GSAP SCROLLTRIGGER ETKİNLEŞTİRME:
    // Kaydırma esnasında teknik özellik satırlarını sırayla sola doğru kaydırarak görünür yaparız.
    gsap.registerPlugin(ScrollTrigger);

    const specRows = specsRef.current?.querySelectorAll(".spec-row");
    if (!specRows) return;

    // Satırları hafif sağdan kaydırarak sıralı stagger ile açığa çıkarırız.
    gsap.fromTo(
      specRows,
      { opacity: 0, x: 50 }, // Başlangıç: Görünmez ve 50px sağda
      {
        opacity: 1,
        x: 0, // Hedef: Tam görünür ve yerinde
        duration: 0.9,
        stagger: 0.12, // Satırlar arasında 0.12 saniyelik tatlı bir bekleme süresi oluşturur
        ease: "back.out(1.5)", // Pop-in hissi veren elastik yavaşlama eğrisi
        scrollTrigger: {
          trigger: specsRef.current,
          start: "top 75%", // Konteyner ekranın %75'ine ulaştığında tetiklenir
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  // Framer motion yaylanma (spring) fiziği ayarı
  const rowSpring = {
    type: "spring" as const,
    stiffness: 350,
    damping: 16,
  };

  return (
    <>
      {/* 3D WebGL Bouncing Jelly backdrop */}
      <ThreeDStage />

      {/* Foreground Scrollable Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Floating Capsule Navigation Bar */}
        <Navigation />

        <main className="flex-1 mt-6">
          {/* Hero Intro Section */}
          <HeroSection />

          {/* Bento Features Grid */}
          <BentoGrid />

          {/* Technical Specifications Section (Spring-interactive rows) */}
          <section
            ref={specsRef}
            id="specifications"
            className="py-32 px-6 border-t border-[#3f2218]/10 bg-[#faf5ef] relative"
          >
            {/* Soft pink ambient lamp glow */}
            <div className="ambient-glow-pink top-10 left-10" />

            <div className="max-w-7xl mx-auto relative z-10">
              
              {/* Header */}
              <div className="mb-20">
                <span className="text-xs tracking-[0.25em] font-sans font-bold text-[#ff7da0] block mb-4">
                  SPECIFICATION LEDGER
                </span>
                <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-serif font-black leading-[0.9] text-[#3f2218] tracking-tight">
                  SYSTEM <br />
                  METRICS
                </h2>
              </div>

              {/* Asymmetrical Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                
                {/* Left side description block */}
                <div className="lg:col-span-4 flex flex-col justify-between">
                  <p className="text-sm font-sans font-light leading-relaxed text-[#3f2218]/80 max-w-sm">
                    EACH METRIC IS HAND-CALCULATED IN REAL TIME BY OUR ELASTIC SHADER PIPELINES. SQUISH OR INTERACT WITH COMPONENT ROWS TO TRIGGER SPRING VIBRATION.
                  </p>
                  
                  {/* Glowing alert capsule using spring motion */}
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    className="border border-[#ff8052]/30 bg-[#ff8052]/5 p-6 mt-12 rounded-[24px] max-w-max shadow-pillow"
                  >
                    <span className="text-[10px] font-mono text-[#ff8052] block mb-2">[WARNING]</span>
                    <span className="text-xs font-sans font-bold text-[#3f2218]">
                      PHYSICS SIMULATIONS ARE TACTILE.
                    </span>
                  </motion.div>
                </div>

                {/* Right side interactive spec rows */}
                <div className="lg:col-span-8 flex flex-col gap-4 w-full">
                  {[
                    { label: "METALLURGY", value: "GLOSSY PASTEL CLAY CORE" },
                    { label: "SHADERS", value: "GLOWING JELLY DISTORTION ENGINE" },
                    { label: "WebGL COMPLIANCE", value: "THREE.JS / REACT THREE FIBER" },
                    { label: "MICRO-MOTIONS", value: "SPRING INTERACTIVE PHYSICS" },
                    { label: "SCROLL ENGINE", value: "LENIS SMOOTH LIQUID MEMENTO" },
                    { label: "ACCENT PALETTE", value: "BUBBLEGUM PINK / SUNNY YELLOW" },
                  ].map((spec, idx) => (
                    <motion.div
                      key={spec.label}
                      className="spec-row flex items-center justify-between py-6 border-b border-[#3f2218]/10 group hover:border-pinkAccent transition-colors duration-300"
                      whileHover={{ x: 12, scaleY: 0.98 }}
                      transition={rowSpring}
                    >
                      <span className="text-xs font-mono text-[#3f2218]/50 group-hover:text-pinkAccent transition-colors duration-300">
                        // 0{idx + 1} {spec.label}
                      </span>
                      <span 
                        className="text-sm md:text-base font-sans font-bold tracking-wide text-[#3f2218]"
                        data-cursor="pointer"
                      >
                        {spec.value}
                      </span>
                    </motion.div>
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
