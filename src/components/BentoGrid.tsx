"use client";

import React, { useEffect, useRef } from "react";
// Image helps optimize images on the fly
import Image from "next/image";
// motion helps us add spring-based hovering effects to individual cards
import { motion } from "framer-motion";
// gsap is the animation engine, ScrollTrigger allows scroll-driven animations
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Layers, Activity, Eye, Zap } from "lucide-react";

export default function BentoGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. GSAP & SCROLLTRIGGER ENTEGRASYONU:
    // ScrollTrigger eklentisini kaydediyoruz (eğer global olarak kayıtlı değilse garanti altına almak için)
    gsap.registerPlugin(ScrollTrigger);

    const cards = containerRef.current?.querySelectorAll(".bento-card");
    if (!cards) return;

    // 2. KAYDIRMA TABANLI ANİMASYON (SCROLL-DRIVEN STAGGER):
    // Kullanıcı sayfayı aşağı kaydırıp bu bölüme geldiğinde, kartlar sırayla aşağıdan yukarı doğru süzülür.
    gsap.fromTo(
      cards,
      { 
        opacity: 0, 
        y: 80 
      }, // Başlangıç değerleri (görünmez ve 80 piksel aşağıda)
      {
        opacity: 1,
        y: 0, // Hedef değerler (tam görünür ve orijinal pozisyonunda)
        duration: 1.0,
        stagger: 0.18, // Her bir kartın animasyonu arasında 0.18 saniye gecikme bırakarak akıcı bir sıra yaratır
        ease: "power4.out", // Yumuşak bir yavaşlama eğrisi (Awwwards standartlarında)
        scrollTrigger: {
          trigger: containerRef.current, // Tetikleyici olarak bu bölümün en üst konteynerini seçiyoruz
          start: "top 80%", // Sayfanın %80'i bu bölüme ulaştığında animasyon başlar
          toggleActions: "play none none none", // Sadece ilk girişte bir kez oynatır
        },
      }
    );
  }, []);

  // Framer Motion yaylanma (spring) fiziği ayarı
  const cardHoverSpring = {
    type: "spring" as const,
    stiffness: 300,
    damping: 22,
  };

  return (
    <section
      ref={containerRef}
      id="the-bento"
      className="py-32 px-6 border-t border-white/10 bg-[#050510] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Title Block */}
        <div className="mb-20">
          <span className="text-xs tracking-[0.25em] font-sans font-light text-cyanAccent block mb-4">
            ARCHITECTURE MATRIX
          </span>
          <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-serif font-black leading-[0.9] text-white tracking-[-0.03em]">
            THE GRID <br />
            EXPERIENCE
          </h2>
        </div>

        {/* 12-Column Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Card 1: 8 Columns - Fluid Technology */}
          <motion.div
            whileHover={{ y: -8 }}
            transition={cardHoverSpring}
            className="bento-card md:col-span-8 border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col justify-between bg-white/5 relative group overflow-hidden"
            data-cursor="pointer"
          >
            {/* Soft decorative background glows inside cards */}
            <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full bg-cyanAccent/5 filter blur-3xl group-hover:bg-cyanAccent/10 transition-colors duration-500" />
            
            <div>
              <div className="w-12 h-12 rounded-2xl border border-cyanAccent/30 flex items-center justify-center text-cyanAccent mb-8 bg-cyanAccent/5">
                <Layers size={20} />
              </div>
              <h3 className="text-2xl md:text-3xl font-serif text-white tracking-tight mb-4">
                ORGANIC LIQUID DYNAMICS
              </h3>
              <p className="text-sm font-sans font-light leading-relaxed text-white/70 max-w-xl">
                Our dynamic 3D simulation utilizes highly realistic vertex distortion. As you move the mouse, the metallic shape calculates custom vector curves, reacting like fluid magnetic core nodes in real time.
              </p>
            </div>
            
            <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-6">
              <span className="text-[10px] font-mono text-white/40 tracking-wider">CORE // 3D_STAGE</span>
              <span className="text-xs font-sans font-semibold text-cyanAccent tracking-widest">
                ONLINE
              </span>
            </div>
          </motion.div>

          {/* Card 2: 4 Columns - Metric block */}
          <motion.div
            whileHover={{ y: -8 }}
            transition={cardHoverSpring}
            className="bento-card md:col-span-4 border border-white/10 rounded-3xl p-8 flex flex-col justify-between bg-white/5 group relative overflow-hidden"
            data-cursor="pointer"
          >
            <div className="absolute -left-20 -bottom-20 w-48 h-48 rounded-full bg-coralAccent/5 filter blur-3xl" />
            
            <div>
              <div className="w-12 h-12 rounded-2xl border border-coralAccent/30 flex items-center justify-center text-coralAccent mb-8 bg-coralAccent/5">
                <Activity size={20} />
              </div>
              <span className="text-[10px] font-mono text-white/40 tracking-wider block mb-2">
                REFRACTION INDEX
              </span>
              <div className="text-6xl md:text-7xl font-serif font-black tracking-tighter text-white group-hover:text-cyanAccent transition-colors duration-300">
                0.96
              </div>
            </div>
            <p className="text-xs font-sans font-light tracking-wider leading-relaxed text-white/70">
              Low light roughness coefficients optimized for glowing WebGL neon ambient lighting.
            </p>
          </motion.div>

          {/* Card 3: 4 Columns - Visual Texture */}
          <motion.div
            whileHover={{ y: -8 }}
            transition={cardHoverSpring}
            className="bento-card md:col-span-4 border border-white/10 rounded-3xl p-8 flex flex-col justify-between bg-white/5 group relative overflow-hidden"
            data-cursor="pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl border border-white/20 flex items-center justify-center text-white mb-8 bg-white/5">
                <Zap size={20} />
              </div>
              <h3 className="text-xl font-serif text-white mb-2">
                SPRING RESPONSE
              </h3>
              <p className="text-xs font-sans font-light text-white/70 leading-relaxed">
                Framer Motion physics engine calculates elastic hover motions instantly using customized stiffness.
              </p>
            </div>
            <div className="mt-8 border-t border-white/10 pt-4 flex items-center justify-between">
              <span className="text-[10px] font-mono text-white/40">SPRING_LATENCY</span>
              <span className="text-xs font-mono text-cyanAccent font-semibold">
                0.01 MS
              </span>
            </div>
          </motion.div>

          {/* Card 4: 8 Columns - Organic Natural Texture & SEO */}
          <motion.div
            whileHover={{ y: -8 }}
            transition={cardHoverSpring}
            className="bento-card md:col-span-8 border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col justify-between bg-white/5 relative group overflow-hidden"
            data-cursor="pointer"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Left Column in Card: Content */}
              <div className="md:col-span-6">
                <div className="w-12 h-12 rounded-2xl border border-cyanAccent/30 flex items-center justify-center text-cyanAccent mb-8 bg-cyanAccent/5">
                  <Eye size={20} />
                </div>
                <h3 className="text-2xl font-serif text-white tracking-tight mb-4">
                  NATURAL SYNERGY
                </h3>
                <p className="text-xs font-sans font-light leading-relaxed text-white/70">
                  We blend synthetic code with natural, high-resolution organic textures. See how glowing cyan crystal veins mimic technology flowing inside raw stone.
                </p>
              </div>

              {/* Right Column in Card: Natural Texture Image with SEO Block */}
              <div className="md:col-span-6 flex flex-col">
                <div className="relative w-full h-[180px] rounded-2xl overflow-hidden border border-white/10">
                  <Image
                    src="/images/stone-vein.jpg"
                    alt="Natural rock stone marble granite texture with glowing turquoise crystal mineral veins"
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover transition-transform duration-700 ease-brutalist group-hover:scale-105"
                  />
                  {/* Soft gradient overlay on card image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050510]/50 to-transparent pointer-events-none" />
                </div>
                
                {/* 2-Sentence SEO Block for the Image */}
                <div className="mt-3">
                  <p className="text-[10px] font-sans font-light tracking-[0.08em] leading-relaxed text-white/40">
                    High-resolution organic textures featuring natural stone granite patterns with turquoise crystal veins. Elevate creative web designs using natural backgrounds and neon lighting effects.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6 flex items-center justify-between">
              <span className="text-[10px] font-mono text-white/40 tracking-wider">TEXTURE // STONE_CRYSTAL</span>
              <span className="text-xs font-sans text-coralAccent font-semibold">
                ACTIVE SHADER
              </span>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
