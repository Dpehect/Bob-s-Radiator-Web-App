"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import AnimatedText from "@/components/ui/AnimatedText";
import KilnCanvas from "./KilnCanvas";
import KilnControls from "./KilnControls";

/**
 * Main Living Kiln Configurator container.
 * Smoothly blends 3D interaction window with tactile layout controls.
 */
export default function TheLivingKiln() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });

  return (
    <section
      ref={containerRef}
      id="kiln"
      className="bg-warm-white py-[clamp(80px,10vw,160px)] px-[clamp(24px,5vw,80px)]"
    >
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-xs tracking-[0.3em] uppercase text-terracotta font-sans font-medium"
          >
            THE LIVING KILN
          </motion.p>
          <AnimatedText
            text="Shape Your Warmth"
            className="text-[clamp(36px,5.5vw,80px)] text-charcoal"
          />
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ delay: 0.3 }}
            className="text-smoke text-[clamp(14px,1vw,17px)] leading-relaxed"
          >
            Design a custom monument of heat. Choose your geometry, define the
            surface coating, and set the temperature limit.
          </motion.p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Controls - Left (lg:col-5) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ delay: 0.4 }}
            className="lg:col-span-5 flex justify-center lg:justify-start"
          >
            <KilnControls />
          </motion.div>

          {/* 3D Showcase Canvas - Right (lg:col-7) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ delay: 0.5 }}
            className="lg:col-span-7 relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-charcoal shadow-2xl border border-charcoal/5"
          >
            {/* Visual borders to look like a premium testing gauge */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cream/20 z-10" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cream/20 z-10" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cream/20 z-10" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cream/20 z-10" />

            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
              <span className="text-[9px] tracking-[0.25em] uppercase text-cream/30 font-semibold">
                Telemetry Grid / 3D Live Feed
              </span>
            </div>

            <KilnCanvas />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
