"use client";

import React from "react";
// Image helps us optimize high-res assets instantly
import Image from "next/image";
// motion handles bouncy, spring-based animations easily
import { motion } from "framer-motion";

export default function HeroSection() {
  // Spring settings for our playful toy buttons
  const buttonSpring = {
    type: "spring" as const,
    stiffness: 350,
    damping: 15,
    mass: 0.5,
  };

  return (
    <section
      id="experience"
      className="relative min-h-[90vh] flex flex-col justify-center px-6 py-24 overflow-x-visible z-10"
    >
      {/* Soft warm glowing bubbles in the background */}
      <div className="ambient-glow-pink top-1/4 left-10" />
      <div className="ambient-glow-yellow bottom-10 right-10" />

      {/* 12-Column Asymmetrical Layout */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-y-16 lg:gap-x-12 items-center relative z-10">
        
        {/* Left: Text & Interactive CTA (Spans 7 columns on desktop) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          
          {/* Friendly pillow tagline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
            className="inline-block border border-[#3f2218]/10 bg-[#faf5ef] shadow-pillow px-5 py-2 rounded-full text-xs font-sans tracking-[0.1em] font-bold text-[#ff8052] mb-8 max-w-max"
          >
            🎈 PLAYFUL INTERACTIVE PORTAL
          </motion.div>

          {/* Large friendly Serif Title with glowing text gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 350, damping: 15, mass: 0.5 }}
            className="text-[clamp(3.5rem,8.5vw,7.5rem)] lg:text-[clamp(5.5rem,10vw,8.5rem)] leading-[0.9] font-serif font-black text-[#3f2218] select-none tracking-tight"
          >
            SQUISH <br />
            THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pinkAccent via-orangeAccent to-yellowAccent drop-shadow-[0_4px_12px_rgba(255,125,160,0.15)]">
              JELLY.
            </span>
          </motion.h1>

          {/* Subtext description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-md text-sm lg:text-base font-sans font-light tracking-wide leading-relaxed text-[#3f2218]/80 mt-8 mb-10"
          >
            WELCOME TO BOB&apos;S RADIATOR. A JOYFUL, PLAYFUL PLAYGROUND OF SOFT JELLY SHAPES, BOUNCY SPRING PHYSICS, AND BRIGHT SUNNY LIGHTING ENGINE CORES.
          </motion.p>

          {/* Squishy spring-physics buttons (Toy-like button response) */}
          <div className="flex flex-wrap gap-4">
            <motion.a
              href="#the-bento"
              whileHover={{ 
                scaleX: 1.12, 
                scaleY: 0.88,
                backgroundColor: "#ff8052",
                boxShadow: "0 15px 30px rgba(255, 128, 82, 0.3)"
              }}
              whileTap={{ scale: 0.9, scaleY: 1.15 }}
              transition={buttonSpring}
              className="bg-[#ff7da0] text-white font-bold px-8 py-4 rounded-full text-xs font-sans tracking-widest shadow-pillow transition-colors duration-200"
              data-cursor="pointer"
            >
              BOUNCE IN
            </motion.a>

            <motion.a
              href="#specifications"
              whileHover={{ 
                scaleX: 1.12, 
                scaleY: 0.88,
                backgroundColor: "rgba(63, 34, 24, 0.06)" 
              }}
              whileTap={{ scale: 0.9, scaleY: 1.15 }}
              transition={buttonSpring}
              className="bg-transparent text-[#3f2218] border-2 border-[#3f2218]/15 px-8 py-4 rounded-full text-xs font-sans tracking-widest transition-colors duration-200"
              data-cursor="pointer"
            >
              FUN METRICS
            </motion.a>
          </div>
        </div>

        {/* Right: Soft Jelly Bubble Image (Spans 5 columns on desktop) */}
        <div className="lg:col-span-5 relative flex flex-col justify-center">
          
          {/* Animated floating backdrop border */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 350, damping: 15, mass: 0.5 }}
            className="absolute inset-0 border-2 border-dashed border-[#3f2218]/10 rounded-[48px] translate-x-4 translate-y-4 pointer-events-none"
          />

          {/* 
            Pillow Image Wrapper:
            - rounded-[40px] gives a friendly, pillow-like border curvature.
            - Framer motion scale physics on hover.
          */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 350, damping: 15, mass: 0.5 }}
            whileHover={{ scale: 1.04, rotate: 2 }}
            className="relative w-full h-[320px] lg:h-[480px] rounded-[40px] overflow-hidden border border-[#3f2218]/10 bg-[#faf5ef] shadow-pillow group"
            data-cursor="pointer"
          >
            <Image
              src="/images/jelly-bubbles.jpg"
              alt="Playful bubblegum pink and sunny yellow glass jelly bubbles merging together organically"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-brutalist group-hover:scale-105"
            />
            
            {/* Smooth glowing overlay gradient on top of image */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#faf5ef]/40 via-[#faf5ef]/0 to-transparent pointer-events-none" />
          </motion.div>

          {/* 
            2-Sentence SEO Meta Block:
            Bubbly friendly layout describing search terms for playful web design portfolios.
          */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 border-l-3 border-pinkAccent pl-4 py-1"
          >
            <p className="text-[11px] font-sans font-light tracking-wide leading-relaxed text-[#3f2218]/65">
              Explore dynamic, Awwwards-style playful web experiences combining bubblegum pink and warm yellow glass 3D graphics. Discover bouncy animations, squishy button physics, and organic fluid layouts designed with React Three Fiber.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
