"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useHeatStore } from "@/store/useHeatStore";
import { RADIATOR_SURFACES, RADIATOR_TYPES, RADIATOR_HEIGHTS } from "@/lib/constants";
import { fadeUp, scaleIn } from "@/lib/motion";
import AnimatedText from "@/components/ui/AnimatedText";

export default function Heritage() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const { radiatorType, radiatorSurface, radiatorHeight, heatLevel } =
    useHeatStore();

  const typeLabel =
    RADIATOR_TYPES.find((t) => t.id === radiatorType)?.label ?? "Classic";
  const surfaceLabel =
    RADIATOR_SURFACES.find((s) => s.id === radiatorSurface)?.label ?? "Raw Brass";
  const heightLabel =
    RADIATOR_HEIGHTS.find((h) => h.id === radiatorHeight)?.spec ?? "600mm";

  const serialNumber = `82-${radiatorType.charAt(0).toUpperCase()}${radiatorSurface
    .charAt(0)
    .toUpperCase()}${radiatorHeight.charAt(0).toUpperCase()}-${String(
    Math.floor(heatLevel * 10 + 1952)
  )}`;

  return (
    <section
      ref={ref}
      id="heritage"
      className="relative bg-charcoal py-[8vw] px-[5vw] overflow-visible"
    >
      {/* ── Organic Wave Cut from TheLivingKiln ── */}
      <div className="absolute top-0 left-0 w-full h-[6vw] -translate-y-[99%] overflow-hidden pointer-events-none z-10">
        <svg className="w-full h-full block" viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 C360,40 720,70 1080,40 1440,100 Z" fill="var(--color-charcoal)" />
        </svg>
      </div>
      {/* Subtle warm glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-terracotta/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-xs tracking-[0.3em] uppercase text-terracotta font-sans font-medium mb-4"
        >
          HERITAGE
        </motion.p>
        <AnimatedText
          text="Claim This Warmth"
          className="text-[clamp(36px,6vw,96px)] text-cream"
        />
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.3 }}
          className="text-cream/40 text-[clamp(14px,1vw,17px)] leading-relaxed max-w-lg mx-auto mt-6 mb-16"
        >
          Your configuration has been recorded. This is not just a radiator — it
          is a certificate of warmth, a promise that this heat was shaped for
          you.
        </motion.p>

        {/* Certificate card */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.4 }}
          className="relative max-w-xl mx-auto"
        >
          <div
            className="relative rounded-3xl overflow-hidden
                        border border-cream/10
                        bg-gradient-to-br from-charcoal-light to-charcoal
                        p-10 md:p-14
                        shadow-[0_24px_80px_rgba(196,92,38,0.08)]"
          >
            {/* Corner ornament */}
            <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-brass/30" />
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-brass/30" />

            {/* Header */}
            <div className="mb-8">
              <p className="font-display text-3xl md:text-4xl font-bold text-cream mb-1">
                82°
              </p>
              <p className="text-[10px] tracking-[0.4em] uppercase text-brass/60">
                Certificate of Warmth
              </p>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-cream/10 mb-8" />

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-6 text-left mb-8">
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-cream/30 mb-1">
                  Form
                </p>
                <p className="text-cream font-display text-lg">{typeLabel}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-cream/30 mb-1">
                  Surface
                </p>
                <p className="text-cream font-display text-lg">
                  {surfaceLabel}
                </p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-cream/30 mb-1">
                  Height
                </p>
                <p className="text-cream font-display text-lg">
                  {heightLabel}
                </p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-cream/30 mb-1">
                  Heat Memory
                </p>
                <p className="text-cream font-display text-lg">
                  {heatLevel}°C
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-cream/10 mb-6" />

            {/* Serial */}
            <div className="flex items-center justify-between">
              <p className="text-[10px] tracking-[0.2em] uppercase text-cream/20">
                Serial
              </p>
              <p className="text-[13px] tracking-[0.15em] text-brass/70 font-mono">
                {serialNumber}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
