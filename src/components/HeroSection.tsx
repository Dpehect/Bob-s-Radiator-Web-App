"use client";

import React from "react";
// Image provides next-gen image optimization (loading, size, formats)
import Image from "next/image";
// motion helps us build spring-based physical interactions easily in React
import { motion } from "framer-motion";

export default function HeroSection() {
  // Spring settings for bounce effects
  // stiffness: force behind the spring (high = tight and fast)
  // damping: friction to slow down wobble (low = wobbles longer)
  const springTransition = {
    type: "spring" as const,
    stiffness: 120,
    damping: 14,
    mass: 0.6,
  };

  return (
    <section
      id="experience"
      className="relative min-h-[90vh] flex flex-col justify-center px-6 py-24 overflow-x-visible z-10"
    >
      {/* Ambient glowing radial lights in the background */}
      <div className="ambient-glow-cyan top-1/4 left-10" />
      <div className="ambient-glow-coral bottom-10 right-10" />

      {/* 12-Column Asymmetrical Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-y-16 lg:gap-x-12 items-center relative z-10">
        
        {/* Left Side: Headline & Text (Spans 7 columns on desktop) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          
          {/* Decorative Tagline */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, ...springTransition }}
            className="inline-block border border-cyanAccent/30 bg-cyanAccent/5 px-4 py-1.5 rounded-full text-xs font-sans tracking-[0.2em] font-medium text-cyanAccent mb-8 max-w-max"
          >
            HUMAN INTERFACE // FUSION CORE
          </motion.div>

          {/* Fluid Typographic H1 with Neon glow titles */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, ...springTransition }}
            className="text-[clamp(3.5rem,8.5vw,7.5rem)] lg:text-[clamp(6rem,11vw,9rem)] leading-[0.85] font-serif font-black text-white select-none tracking-[-0.04em]"
          >
            TOUCH <br />
            THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyanAccent to-coralAccent drop-shadow-[0_0_20px_rgba(0,245,255,0.3)]">
              FUTURE.
            </span>
          </motion.h1>

          {/* Subtext description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-md text-sm lg:text-base font-sans font-light tracking-[0.1em] leading-relaxed text-white/70 mt-8 mb-10"
          >
            EXPERIENCE A LIVING SYMBIOSIS OF COLD TECHNOLOGY AND ORGANIC TOUCH. FORGED IN LIQUID METALLURGY, CONSTRUCTED WITH HIGH-PERFORMANCE WEBGL ENGINE CORE.
          </motion.p>

          {/* Spring-based Call To Actions (CTAs) */}
          <div className="flex flex-wrap gap-4">
            <motion.a
              href="#the-bento"
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(0, 245, 255, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              transition={springTransition}
              className="bg-cyanAccent text-[#050510] font-semibold px-8 py-4 rounded-full text-xs font-sans tracking-[0.2em] shadow-lg shadow-cyanAccent/10"
              data-cursor="pointer"
            >
              LAUNCH PORTAL
            </motion.a>

            <motion.a
              href="#specifications"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
              whileTap={{ scale: 0.95 }}
              transition={springTransition}
              className="bg-transparent text-white border border-white/20 px-8 py-4 rounded-full text-xs font-sans tracking-[0.2em] hover:border-white transition-colors duration-300"
              data-cursor="pointer"
            >
              SYSTEM METRICS
            </motion.a>
          </div>
        </div>

        {/* Right Side: Organic Bleeding Image (Spans 5 columns on desktop) */}
        <div className="lg:col-span-5 relative flex flex-col justify-center">
          
          {/* Animated floating backdrop border */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, ...springTransition }}
            className="absolute inset-0 border border-cyanAccent/20 rounded-3xl translate-x-4 translate-y-4 pointer-events-none"
          />

          {/* 
            Glow Image Container:
            - Gradients provide organic depth.
            - Framer Motion "whileHover" triggers elastic spring scaling.
          */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, ...springTransition }}
            whileHover={{ scale: 1.03 }}
            className="relative w-full h-[320px] lg:h-[480px] rounded-3xl overflow-hidden border border-white/15 bg-[#050510] group"
            data-cursor="pointer"
          >
            {/* The primary human-centric high-res neon graphic */}
            <Image
              src="/images/human-neon.jpg"
              alt="Organic human hand interacting with glowing cyan and coral metallic core interface"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-brutalist group-hover:scale-105"
            />
            
            {/* Smooth glowing overlay gradient on top of image */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-[#050510]/10 to-transparent opacity-60 pointer-events-none" />
          </motion.div>

          {/* 
            2-Sentence SEO Meta-Information Block:
            Directly below the image to fulfill user requests, explaining this section using target keywords.
          */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 border-l-2 border-cyanAccent pl-4 py-1"
          >
            <p className="text-[11px] font-sans font-light tracking-[0.1em] leading-relaxed text-white/50">
              Interactive 3D web design portfolio showcasing organic human interactions with responsive glowing neural nodes. Discover Awwwards-winning creative development and advanced web animations built with Three.js and GSAP.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
