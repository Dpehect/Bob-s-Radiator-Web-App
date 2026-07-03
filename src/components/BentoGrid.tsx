"use client";

import React, { useEffect, useRef } from "react";
// Image supports optimized next-gen visual displays
import Image from "next/image";
// motion helps build interactive spring hover states on cards
import { motion } from "framer-motion";
// gsap + ScrollTrigger orchestrates elastic scroll-driven entry animations
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Activity, Sparkles, Smile } from "lucide-react";

export default function BentoGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. GSAP SCROLLTRIGGER ETKİNLEŞTİRME:
    // ScrollTrigger eklentisini kaydediyoruz
    gsap.registerPlugin(ScrollTrigger);

    const cards = containerRef.current?.querySelectorAll(".bento-card");
    if (!cards) return;

    // 2. ELASTİK POP-IN GİRİŞ ANİMASYONLARI (SCROLL-DRIVEN ELASTIC SCALE):
    // Kartlar sıfır boyuttan (scale: 0) orijinal boyutuna (scale: 1) yaylanarak büyür.
    // back.out(1.7) sayesinde kartlar büyürken hafifçe taşar (overshoot) ve sonra yerine oturur.
    gsap.fromTo(
      cards,
      { 
        opacity: 0, 
        scale: 0.6, 
        y: 40 
      }, // Başlangıç durumu (küçük, silik ve biraz aşağıda)
      {
        opacity: 1,
        scale: 1,
        y: 0, // Hedef durum (orijinal boyutu ve pozisyonu)
        duration: 1.2,
        stagger: 0.15, // Kartlar arasında 0.15 saniye kademeli gecikme oluşturarak ritmik bir geçiş sağlar
        ease: "back.out(1.6)", // Elastik yaylanma etkisi veren GSAP eğrisi
        scrollTrigger: {
          trigger: containerRef.current, // Tetikleyici olarak bento konteynerini seçiyoruz
          start: "top 75%", // Bölüm ekranın %75'ine geldiğinde animasyon tetiklenir
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  // Framer Motion yaylanma (spring) fiziği ayarı
  const cardHoverSpring = {
    type: "spring" as const,
    stiffness: 250,
    damping: 18,
  };

  return (
    <section
      ref={containerRef}
      id="the-bento"
      className="py-32 px-6 border-t border-[#3f2218]/10 bg-[#faf5ef] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Title Block */}
        <div className="mb-20">
          <span className="text-xs tracking-[0.25em] font-sans font-bold text-[#ff8052] block mb-4">
            CREATIVE GRID SYSTEM
          </span>
          <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-serif font-black leading-[0.9] text-[#3f2218] tracking-tight">
            THE JELLY <br />
            ARCHITECTURE
          </h2>
        </div>

        {/* 12-Column Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Card 1: 8 Columns - Squishy 3D description */}
          <motion.div
            whileHover={{ scale: 1.02, rotate: -0.5 }}
            transition={cardHoverSpring}
            className="bento-card md:col-span-8 border border-[#3f2218]/10 rounded-[32px] p-8 md:p-12 flex flex-col justify-between bg-[#faf5ef] shadow-pillow relative group overflow-hidden"
            data-cursor="pointer"
          >
            {/* Glowing background highlights within bento boxes */}
            <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full bg-pinkAccent/10 filter blur-3xl group-hover:bg-pinkAccent/15 transition-colors duration-500" />
            
            <div>
              <div className="w-12 h-12 rounded-2xl border border-pinkAccent/30 flex items-center justify-center text-pinkAccent mb-8 bg-pinkAccent/5">
                <Heart size={20} />
              </div>
              <h3 className="text-2xl md:text-3xl font-serif font-black text-[#3f2218] mb-4">
                SQUISHY METABALL ENGINE
              </h3>
              <p className="text-sm font-sans font-light leading-relaxed text-[#3f2218]/80 max-w-xl">
                Behind the scenes, our 3D background calculates fluid vector updates. The bubblegum pink sphere is rendered using custom shader mechanics, dynamically wiggling and squishing on hover with realistic jelly physics.
              </p>
            </div>
            
            <div className="mt-12 flex items-center justify-between border-t border-[#3f2218]/10 pt-6">
              <span className="text-[10px] font-mono text-[#3f2218]/40 tracking-wider">SYSTEM // WEBGL_JELLY</span>
              <span className="text-xs font-sans font-bold text-[#ff8052] tracking-widest">
                ACTIVE
              </span>
            </div>
          </motion.div>

          {/* Card 2: 4 Columns - Metric display */}
          <motion.div
            whileHover={{ scale: 1.03, rotate: 1 }}
            transition={cardHoverSpring}
            className="bento-card md:col-span-4 border border-[#3f2218]/10 rounded-[32px] p-8 flex flex-col justify-between bg-[#faf5ef] shadow-pillow group relative overflow-hidden"
            data-cursor="pointer"
          >
            <div className="absolute -left-20 -bottom-20 w-48 h-48 rounded-full bg-yellowAccent/15 filter blur-3xl" />
            
            <div>
              <div className="w-12 h-12 rounded-2xl border border-yellowAccent/40 flex items-center justify-center text-yellowAccent mb-8 bg-yellowAccent/5">
                <Activity size={20} />
              </div>
              <span className="text-[10px] font-mono text-[#3f2218]/40 tracking-wider block mb-2">
                BOUNCINESS COEFFICIENT
              </span>
              <div className="text-6xl md:text-7xl font-serif font-black tracking-tighter text-[#3f2218] group-hover:text-pinkAccent transition-colors duration-300">
                1.48
              </div>
            </div>
            <p className="text-xs font-sans font-light leading-relaxed text-[#3f2218]/70">
              High-stiffness spring dampeners configured for playful UI layout interactions.
            </p>
          </motion.div>

          {/* Card 3: 4 Columns - Tech Spec highlight */}
          <motion.div
            whileHover={{ scale: 1.03, rotate: -1 }}
            transition={cardHoverSpring}
            className="bento-card md:col-span-4 border border-[#3f2218]/10 rounded-[32px] p-8 flex flex-col justify-between bg-[#faf5ef] shadow-pillow group relative overflow-hidden"
            data-cursor="pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl border border-[#3f2218]/25 flex items-center justify-center text-[#3f2218] mb-8 bg-[#3f2218]/5">
                <Sparkles size={20} />
              </div>
              <h3 className="text-xl font-serif font-black text-[#3f2218] mb-2">
                SPRING ENERGY
              </h3>
              <p className="text-xs font-sans font-light text-[#3f2218]/80 leading-relaxed">
                Clicking or hovering over elements deforms the layouts organically, offering tactile feedback.
              </p>
            </div>
            <div className="mt-8 border-t border-[#3f2218]/10 pt-4 flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#3f2218]/40">SPRING_LATENCY</span>
              <span className="text-xs font-mono text-[#ff8052] font-bold">
                0.01 MS
              </span>
            </div>
          </motion.div>

          {/* Card 4: 8 Columns - Organic Texture Display & SEO */}
          <motion.div
            whileHover={{ scale: 1.02, rotate: 0.5 }}
            transition={cardHoverSpring}
            className="bento-card md:col-span-8 border border-[#3f2218]/10 rounded-[32px] p-8 md:p-12 flex flex-col justify-between bg-[#faf5ef] shadow-pillow relative group overflow-hidden"
            data-cursor="pointer"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Left Column inside card: content text */}
              <div className="md:col-span-6">
                <div className="w-12 h-12 rounded-2xl border border-[#ff8052]/30 flex items-center justify-center text-[#ff8052] mb-8 bg-[#ff8052]/5">
                  <Smile size={20} />
                </div>
                <h3 className="text-2xl font-serif font-black text-[#3f2218] tracking-tight mb-4">
                  ORGANIC VEINS
                </h3>
                <p className="text-xs font-sans font-light leading-relaxed text-[#3f2218]/80">
                  Observe how technology merges with natural quartz crystals. Glowing pink veins run through warm peach marble patterns, blending code with natural structures.
                </p>
              </div>

              {/* Right Column inside card: high-res graphic + SEO metadata block */}
              <div className="md:col-span-6 flex flex-col">
                <div className="relative w-full h-[180px] rounded-2xl overflow-hidden border border-[#3f2218]/10">
                  <Image
                    src="/images/pink-vein.jpg"
                    alt="Natural warm peach cream marble granite stone texture with glowing magenta pink quartz crystal mineral veins"
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover transition-transform duration-700 ease-brutalist group-hover:scale-105"
                  />
                  {/* Soft gradient cover on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#faf5ef]/40 to-transparent pointer-events-none" />
                </div>
                
                {/* 2-Sentence SEO Block */}
                <div className="mt-3">
                  <p className="text-[10px] font-sans font-light tracking-wide leading-relaxed text-[#3f2218]/50">
                    High-quality natural marble backgrounds featuring organic quartz crystals with glowing pink veins. Refine creative web layout aesthetics using warm, joyful stone textures and ambient light filters.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-[#3f2218]/10 pt-6 flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#3f2218]/40 tracking-wider">TEXTURE // PINK_QUARTZ</span>
              <span className="text-xs font-sans text-pinkAccent font-bold">
                ACTIVE
              </span>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
