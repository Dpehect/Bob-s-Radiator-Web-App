"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Basic IntersectionObserver for scroll-reveal animations
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

    const elements = containerRef.current?.querySelectorAll(".animate-on-scroll");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      id="experience"
      className="relative min-h-[90vh] flex flex-col justify-center px-6 py-20 overflow-x-visible"
    >
      {/* 12-Column Asymmetrical Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-8 items-center overflow-x-visible">
        
        {/* Left Text Block - Spans 7 columns on desktop */}
        <div className="md:col-span-7 flex flex-col justify-center z-20">
          
          {/* Tagline */}
          <div 
            className="animate-on-scroll inline-block border-2 border-white px-4 py-1.5 text-xs font-sans tracking-[0.2em] font-extralight mb-8 text-accent max-w-max"
            style={{ transitionDelay: "0.1s" }}
          >
            RAW INDUSTRIALISM // 2026 EDITION
          </div>

          {/* H1 Brutalist Title using fluid typography clamp */}
          <h1 
            className="animate-on-scroll text-[clamp(3.5rem,8.5vw,7.5rem)] md:text-[clamp(6rem,11vw,9.5rem)] leading-[0.85] font-serif font-black text-white select-none tracking-[-0.05em]"
            style={{ transitionDelay: "0.2s" }}
          >
            FORM <br />
            MEETS <br />
            <span className="text-accent">FUSION.</span>
          </h1>

          {/* Subtext */}
          <p 
            className="animate-on-scroll max-w-md text-sm md:text-base font-sans font-extralight tracking-[0.12em] leading-relaxed text-white/80 mt-8 mb-10"
            style={{ transitionDelay: "0.3s" }}
          >
            BOB&apos;S RADIATOR IS NOT A DEVICE. IT IS A DIGITAL SCULPTURE OF COLD METALLURGY AND RAW PERFORMANCE, DESIGNED TO REDEFINE THE THERMAL BOUNDARIES OF DIGITAL ART.
          </p>

          {/* CTA Buttons */}
          <div 
            className="animate-on-scroll flex flex-wrap gap-4"
            style={{ transitionDelay: "0.4s" }}
          >
            <a
              href="#the-bento"
              className="bg-accent text-white border-2 border-accent hover:bg-white hover:text-black hover:border-white transition-all duration-300 ease-brutalist px-8 py-4 text-xs font-sans tracking-[0.2em] font-semibold"
              data-cursor="snap"
            >
              EXPLORE ARCHITECTURE
            </a>
            
            <a
              href="#specifications"
              className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-black transition-all duration-300 ease-brutalist px-8 py-4 text-xs font-sans tracking-[0.2em]"
              data-cursor="snap"
            >
              SPECIFICATIONS
            </a>
          </div>
        </div>

        {/* Right Bleeding Image Block - Spans 5 columns on desktop */}
        <div className="md:col-span-5 relative overflow-x-visible h-[400px] md:h-[600px] flex items-center">
          
          {/* Asymmetrical Border frame that wraps around the image but shifts */}
          <div 
            className="animate-on-scroll absolute inset-0 border-2 border-white/20 translate-x-4 translate-y-4 pointer-events-none"
            style={{ transitionDelay: "0.35s" }}
          />

          {/* The image container bleeds out of the standard flow with negative margin */}
          <div 
            className="animate-on-scroll relative w-full h-[85%] border-4 border-white bg-black overflow-hidden hover:border-accent transition-all duration-500 md:-mr-24"
            style={{ transitionDelay: "0.5s" }}
            data-cursor="pointer"
          >
            <Image
              src="/images/hero-metal.jpg"
              alt="Raw chrome industrial radiator structure texture"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover scale-105 hover:scale-100 transition-transform duration-700 ease-brutalist grayscale contrast-125 brightness-90"
            />
          </div>
        </div>
      </div>

      {/* Decorative vertical coordinates to enhance Brutalist vibe */}
      <div className="absolute right-6 bottom-10 hidden lg:flex flex-col items-end gap-1 font-mono text-[10px] text-white/30 tracking-widest select-none">
        <span>LAT: 45.4642° N</span>
        <span>LON: 9.1900° E</span>
        <span>SYS: ACTIVE</span>
      </div>
    </section>
  );
}
