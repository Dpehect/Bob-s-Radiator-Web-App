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
      className="relative bg-black-pure py-[8vw] px-[5vw] overflow-visible text-warm-white"
    >
      {/* ── Organic Wave Cut from TheLivingKiln ── */}
      <div className="absolute top-0 left-0 w-full h-[6vw] -translate-y-[99%] overflow-hidden pointer-events-none z-10">
        <svg className="w-full h-full block" viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 C360,40 720,70 1080,40 1440,100 Z" fill="var(--color-black-pure)" />
        </svg>
      </div>

      {/* Subtle warm glow behind */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-electric-orange/[0.02] blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-xs tracking-[0.35em] uppercase text-electric-orange font-sans font-bold mb-4"
        >
          HERITAGE
        </motion.p>
        <AnimatedText
          text="Claim This Warmth"
          className="text-[clamp(44px,7vw,110px)] text-warm-white font-black tracking-[-0.05em] leading-none"
        />
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.3 }}
          className="text-editorial-gray text-[clamp(15px,1.1vw,18px)] leading-relaxed max-w-lg mx-auto mt-6 mb-16 font-light"
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
          whileHover={{
            scale: 1.02,
            y: -8,
            boxShadow: "20px 20px 0px var(--color-electric-orange)",
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative max-w-xl mx-auto cursor-pointer rounded-3xl"
        >
          <div
            className="relative rounded-3xl overflow-hidden
                        border border-electric-orange/10
                        bg-charcoal p-10 md:p-14
                        shadow-[0_24px_80px_rgba(255,69,0,0.02)]
                        transition-shadow duration-300"
          >
            {/* Corner ornament */}
            <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-electric-orange/20" />
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-electric-orange/20" />

            {/* Header */}
            <div className="mb-8 flex justify-between items-center text-left">
              <div>
                <p className="font-display text-4xl font-black text-warm-white mb-1 tracking-tighter">
                  82°
                </p>
                <p className="text-[9px] tracking-[0.4em] uppercase text-editorial-gray/60 font-bold">
                  Certificate of Warmth
                </p>
              </div>
              
              {/* Electric Orange round stamp outline */}
              <div className="w-14 h-14 rounded-full border border-electric-orange/30 flex items-center justify-center -rotate-12 pointer-events-none select-none">
                <span className="font-sans text-[7px] text-electric-orange uppercase tracking-wider font-extrabold text-center leading-none">
                  Mehmet<br/>1952<br/>PASSED
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-warm-white/10 mb-8" />

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-6 text-left mb-8">
              <div>
                <p className="text-[9px] tracking-[0.2em] uppercase text-editorial-gray/40 mb-1 font-bold">
                  Form
                </p>
                <p className="text-warm-white font-display text-lg font-black tracking-tight">{typeLabel}</p>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.2em] uppercase text-editorial-gray/40 mb-1 font-bold">
                  Surface
                </p>
                <p className="text-warm-white font-display text-lg font-black tracking-tight">
                  {surfaceLabel}
                </p>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.2em] uppercase text-editorial-gray/40 mb-1 font-bold">
                  Height
                </p>
                <p className="text-warm-white font-display text-lg font-black tracking-tight">
                  {heightLabel}
                </p>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.2em] uppercase text-editorial-gray/40 mb-1 font-bold">
                  Heat Memory
                </p>
                <p className="text-electric-orange font-display text-lg font-black tracking-tight">
                  {heatLevel}°C
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-warm-white/10 mb-6" />

            {/* Serial */}
            <div className="flex items-center justify-between">
              <p className="text-[9px] tracking-[0.2em] uppercase text-editorial-gray/30 font-bold">
                Serial
              </p>
              <p className="text-[12px] tracking-[0.15em] text-electric-orange font-mono font-bold">
                {serialNumber}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
