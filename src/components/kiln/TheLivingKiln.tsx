"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { useHeatStore } from "@/store/useHeatStore";
import AnimatedText from "@/components/ui/AnimatedText";
import KilnCanvas from "./KilnCanvas";
import KilnControls from "./KilnControls";

/**
 * Main Living Kiln Configurator container.
 * Smoothly blends 3D interaction window with tactile layout controls and live telemetry.
 */
export default function TheLivingKiln() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });
  const { radiatorType, radiatorSurface, radiatorHeight, heatLevel } = useHeatStore();

  return (
    <section
      ref={containerRef}
      id="kiln"
      className="bg-black-pure py-[8vw] px-[5vw] text-warm-white relative overflow-visible"
    >
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-xs tracking-[0.35em] uppercase text-electric-orange font-sans font-bold"
          >
            THE LIVING KILN
          </motion.p>
          <AnimatedText
            text="Shape Your Warmth"
            className="text-[clamp(44px,7vw,110px)] text-warm-white font-black tracking-[-0.05em] leading-none"
          />
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ delay: 0.35 }}
            className="text-editorial-gray text-[clamp(15px,1.1vw,18px)] leading-relaxed mt-4 font-light"
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
            className="lg:col-span-5 flex justify-center lg:justify-start w-full"
          >
            <KilnControls />
          </motion.div>

          {/* 3D Showcase Canvas - Right (lg:col-7) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ delay: 0.5 }}
            className="lg:col-span-7 relative w-full aspect-[4/3] rounded-[36px] overflow-hidden bg-charcoal shadow-2xl border border-electric-orange/5"
          >
            {/* Visual borders to look like a premium testing gauge */}
            <div className="absolute top-5 left-5 w-6 h-6 border-t-2 border-l-2 border-electric-orange/15 z-10" />
            <div className="absolute top-5 right-5 w-6 h-6 border-t-2 border-r-2 border-electric-orange/15 z-10" />
            <div className="absolute bottom-5 left-5 w-6 h-6 border-b-2 border-l-2 border-electric-orange/15 z-10" />
            <div className="absolute bottom-5 right-5 w-6 h-6 border-b-2 border-r-2 border-electric-orange/15 z-10" />

            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10">
              <span className="text-[9px] tracking-[0.3em] uppercase text-electric-orange font-bold">
                Telemetry Grid / 3D Live Feed
              </span>
            </div>

            {/* Live Dashboard Telemetry Readout */}
            <div className="absolute bottom-6 left-8 z-10 font-mono text-[9px] text-editorial-gray/40 uppercase tracking-widest leading-relaxed pointer-events-none select-none">
              <span className="text-electric-orange">System Status: Active</span><br/>
              <span>Heat Level: {heatLevel}°C</span><br/>
              <span>Alloy: {radiatorSurface}</span><br/>
              <span>Structure: {radiatorType}</span><br/>
              <span>Height: {radiatorHeight}</span>
            </div>

            {/* Live Dashboard Grid Specifications Overlay */}
            <div className="absolute bottom-6 right-8 z-10 font-mono text-[9px] text-editorial-gray/30 uppercase tracking-widest leading-relaxed pointer-events-none select-none text-right">
              <span>Freq: 60Hz</span><br/>
              <span>EMISSION: {(heatLevel / 100 * 1.5).toFixed(2)} KW</span><br/>
              <span>Outlines: Wireframe</span>
            </div>

            <KilnCanvas />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
