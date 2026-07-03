"use client";

import React, { useEffect, useRef } from "react";
// framer-motion is utilized for hover micro-interactions
import { motion } from "framer-motion";
// gsap & scrolltrigger are used to animate elements as they enter the screen
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
    // 1. GSAP SCROLLTRIGGER ENTEGRASYONU:
    // Sayfa aşağı kaydırıldığında teknik özellikler tablosunun satırlarını sırayla açığa çıkarırız.
    gsap.registerPlugin(ScrollTrigger);

    const specRows = specsRef.current?.querySelectorAll(".spec-row");
    if (!specRows) return;

    // Satırları tek tek aşağıdan yukarı doğru süzerek görünür yaparız (Scroll-driven entry)
    gsap.fromTo(
      specRows,
      { opacity: 0, x: -30 }, // Başlangıç: Görünmez ve 30px solda
      {
        opacity: 1,
        x: 0, // Hedef: Tam görünür ve yerinde
        duration: 0.8,
        stagger: 0.1, // Satırlar arasında 0.1 saniye stagger (kademeli gecikme) oluşturur
        ease: "power3.out",
        scrollTrigger: {
          trigger: specsRef.current,
          start: "top 75%", // Bölüm ekranın %75'ine geldiğinde tetiklenir
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  // Spring animations for rows
  const rowHoverSpring = {
    type: "spring" as const,
    stiffness: 400,
    damping: 20,
  };

  return (
    <>
      {/* 3D WebGL Canvas Backdrop (WebGL 3D Canlı Arka Plan) */}
      <ThreeDStage />

      {/* Foreground Interactive Page Layout (Ön Plan İçerik Akışı) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navigation Bar (Gezinti Menüsü) */}
        <Navigation />

        <main className="flex-1">
          {/* Hero Section (Karşılama Ekranı) */}
          <HeroSection />

          {/* Bento Grid (Özellikler Ağı) */}
          <BentoGrid />

          {/* Technical Specifications Section (Teknik Detay Tablosu) */}
          <section
            ref={specsRef}
            id="specifications"
            className="py-32 px-6 border-t border-white/10 bg-[#050510] relative"
          >
            {/* Ambient Background Glow (Ortam Işığı) */}
            <div className="ambient-glow-cyan top-10 left-10" />

            <div className="max-w-7xl mx-auto relative z-10">
              
              {/* Heading */}
              <div className="mb-20">
                <span className="text-xs tracking-[0.25em] font-sans font-light text-coralAccent block mb-4">
                  SPECIFICATION LEDGER
                </span>
                <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-serif font-black leading-[0.9] text-white tracking-[-0.03em]">
                  SYSTEM <br />
                  PARAMETERS
                </h2>
              </div>

              {/* Asymmetrical Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                
                {/* Left Description and Warning Block */}
                <div className="lg:col-span-4 flex flex-col justify-between">
                  <p className="text-sm font-sans font-light leading-relaxed text-white/70 max-w-sm">
                    EVERY FUSION HOUSING IS CNC-MACHINED FROM SINGLE BLOCKS OF AEROSPACE ALUMINUM AND HAND-POLISHED FOR HIGHEST SPECTRUM REFLECTION.
                  </p>
                  
                  {/* Glowing alert box using spring motion */}
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="border border-coralAccent/30 bg-coralAccent/5 p-6 mt-12 rounded-2xl max-w-max"
                  >
                    <span className="text-[10px] font-mono text-coralAccent block mb-2">[LIMIT WARNING]</span>
                    <span className="text-xs font-sans font-light text-white">
                      DO NOT OPERATE BEYOND THERMAL LIMITS.
                    </span>
                  </motion.div>
                </div>

                {/* Right Specification Table (Spring-interactive rows) */}
                <div className="lg:col-span-8 flex flex-col gap-4 w-full">
                  {[
                    { label: "METALLURGY", value: "CNC ANODIZED ALUMINUM 6061-T6" },
                    { label: "FUSION CORE", value: "FLUID VECTOR DISPLACEMENT ENGINE" },
                    { label: "WebGL RENDERING", value: "THREE.JS / REACT THREE FIBER v9" },
                    { label: "INTERACTIONS", value: "FRAMER MOTION SPRING PHYSICS" },
                    { label: "SCROLL ENGINE", value: "GSAP SCROLLTRIGGER STAGGER" },
                    { label: "COOLING INDEX", value: "480 WATTS MAX THERMAL LOAD" },
                  ].map((spec, idx) => (
                    <motion.div
                      key={spec.label}
                      className="spec-row flex items-center justify-between py-6 border-b border-white/10 group hover:border-cyanAccent transition-colors duration-300"
                      whileHover={{ x: 8 }}
                      transition={rowHoverSpring}
                    >
                      <span className="text-xs font-mono text-white/40 group-hover:text-cyanAccent transition-colors duration-300">
                        // 0{idx + 1} {spec.label}
                      </span>
                      <span 
                        className="text-sm md:text-base font-sans font-light tracking-wide text-white"
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

        {/* Footer (Sayfa Alt Bilgisi) */}
        <Footer />
      </div>
    </>
  );
}
