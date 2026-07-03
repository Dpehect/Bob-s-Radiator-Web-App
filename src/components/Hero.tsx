"use client";

import { motion } from "framer-motion";
import { fadeUp, smoothSpring } from "@/lib/motion";

export default function Hero() {
  return (
    <section className="min-h-screen w-full bg-black-pure relative flex flex-col justify-between items-center pt-32 pb-16 overflow-x-visible overflow-y-hidden">
      {/* ─── Fine Editorial Gridlines ─── */}
      <div className="absolute inset-0 flex justify-between px-[5vw] pointer-events-none select-none z-0">
        <div className="w-[1px] h-full bg-editorial-gray/[0.03]" />
        <div className="w-[1px] h-full bg-editorial-gray/[0.03] hidden md:block" />
        <div className="w-[1px] h-full bg-editorial-gray/[0.03] hidden md:block" />
        <div className="w-[1px] h-full bg-editorial-gray/[0.03]" />
      </div>

      {/* ─── Top Brand Taglines ─── */}
      <div className="w-full px-[5vw] flex justify-between items-baseline z-10 text-[10px] tracking-[0.35em] text-editorial-gray/40 uppercase font-semibold">
        <span>EST. 1952 / FOUNDRY</span>
        <span className="text-electric-orange">LATENCY: 82°C</span>
      </div>

      {/* ─── Massive Typographic Background breaking bounds ─── */}
      <div className="w-full relative flex flex-col items-center justify-center my-auto py-10 z-10">
        {/* Transparent Text-Stroke Outline */}
        <h1 className="text-center font-display text-[clamp(60px,11vw,180px)] font-black text-transparent text-stroke-white select-none pointer-events-none tracking-[-0.05em] leading-none uppercase">
          Eighty-Two
        </h1>
        
        {/* ─── Central Floating Wireframe Radiator ─── */}
        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ ...smoothSpring, delay: 0.15 }}
          whileHover={{ scale: 1.05, rotateY: 10 }}
          className="w-48 md:w-64 aspect-[3/4] relative my-6 flex items-center justify-center cursor-pointer select-none group"
          style={{ perspective: 600 }}
        >
          {/* Wireframe outlines */}
          <div className="absolute inset-0 rounded-3xl border border-electric-orange/20 group-hover:border-electric-orange/60 transition-colors duration-500 z-5" />
          
          {/* Internal Radiator tubes drawn with fine lines */}
          <div className="w-[70%] h-[75%] flex flex-col justify-between items-center relative z-10 opacity-30 group-hover:opacity-100 transition-opacity duration-500">
            <div className="w-full h-[3px] bg-electric-orange/40 group-hover:bg-electric-orange shadow-[0_0_8px_var(--color-electric-orange)]" />
            <div className="flex justify-between w-[90%] h-[80%] my-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[2px] h-full bg-electric-orange/30 group-hover:bg-electric-orange/80 shadow-[0_0_4px_var(--color-electric-orange)]"
                />
              ))}
            </div>
            <div className="w-full h-[3px] bg-electric-orange/40 group-hover:bg-electric-orange shadow-[0_0_8px_var(--color-electric-orange)]" />
          </div>

          {/* Glow Behind */}
          <div className="absolute inset-0 rounded-3xl bg-radial from-electric-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
        </motion.div>

        <h1 className="text-center font-display text-[clamp(60px,11vw,180px)] font-black text-warm-white tracking-[-0.05em] leading-none uppercase">
          Degrees
        </h1>
      </div>

      {/* ─── Bottom Column layouts (editorial styles) ─── */}
      <div className="w-full px-[5vw] grid grid-cols-1 md:grid-cols-12 gap-8 items-end z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="md:col-span-4 space-y-2 text-left"
        >
          <span className="text-[9px] tracking-[0.25em] text-electric-orange uppercase font-bold">
            / Metallurgic Craft
          </span>
          <p className="text-[13px] text-editorial-gray leading-relaxed max-w-xs font-light">
            Every iron module is hand-cast and heated to exactly 82°C. The precise threshold where physical objects retain memory.
          </p>
        </motion.div>

        <div className="md:col-span-4 flex justify-center pb-2">
          {/* Animated Scroll indicator line */}
          <div className="w-[1px] h-12 bg-editorial-gray/20 relative overflow-hidden">
            <motion.div
              animate={{ y: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full h-1/2 bg-electric-orange"
            />
          </div>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="md:col-span-4 space-y-2 text-right hidden md:block"
        >
          <span className="text-[9px] tracking-[0.25em] text-warm-white/40 uppercase font-bold">
            / Editorial Spread 01
          </span>
          <p className="text-[13px] text-editorial-gray leading-relaxed ml-auto max-w-xs font-light">
            A celebration of heating geometries and minimalist design. An active canvas shaped for modern spaces.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
