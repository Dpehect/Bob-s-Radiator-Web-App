"use client";

import { motion } from "framer-motion";
import { smoothSpring, fadeUp } from "@/lib/motion";

/* ─── Particle config ─── */
const particles = [
  { bg: "bg-terracotta/30", left: "10%", size: "w-1.5 h-1.5", dur: "15s", delay: "0s" },
  { bg: "bg-brass/20", left: "25%", size: "w-1.5 h-1.5", dur: "20s", delay: "3s" },
  { bg: "bg-ember/15", left: "50%", size: "w-1.5 h-1.5", dur: "25s", delay: "7s" },
  { bg: "bg-terracotta/30", left: "65%", size: "w-1.5 h-1.5", dur: "18s", delay: "2s" },
  { bg: "bg-brass/20", left: "80%", size: "w-1.5 h-1.5", dur: "22s", delay: "5s" },
  { bg: "bg-ember/15", left: "92%", size: "w-1.5 h-1.5", dur: "16s", delay: "9s" },
];

export default function Hero() {
  return (
    <section className="min-h-screen bg-charcoal text-cream flex flex-col items-center justify-center relative overflow-hidden">
      {/* ─── Inline keyframes ─── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes hero-float {
              0% { transform: translateY(100vh); opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { transform: translateY(-10vh); opacity: 0; }
            }
            @keyframes hero-scrollDot {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(52px); }
            }
          `,
        }}
      />

      {/* ─── Floating particles ─── */}
      {particles.map((p, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${p.size} ${p.bg}`}
          style={{
            left: p.left,
            bottom: 0,
            animation: `hero-float ${p.dur} ${p.delay} ease-in-out infinite`,
          }}
        />
      ))}

      {/* ─── Top-left label ─── */}
      <span className="absolute top-8 left-[clamp(24px,5vw,80px)] text-[11px] tracking-[0.3em] uppercase text-cream/30 font-sans">
        EST. 1952 — KARAKÖY
      </span>

      {/* ─── Giant 82° ─── */}
      <motion.h1
        className="font-display font-black text-[clamp(120px,20vw,320px)] leading-none text-center select-none"
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ...smoothSpring }}
      >
        82°
      </motion.h1>

      {/* ─── Subtitle ─── */}
      <motion.p
        className="font-display italic text-[clamp(16px,2.5vw,36px)] text-cream/70 mt-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        The Heat That Remembers
      </motion.p>

      {/* ─── Bottom two-column descriptions ─── */}
      <div className="absolute bottom-0 left-0 w-full pb-12 px-[clamp(24px,5vw,80px)]">
        <div className="flex flex-col items-center text-center md:flex-row md:justify-between md:text-left md:items-end gap-12">
          {/* Left column */}
          <motion.p
            className="max-w-sm text-sm text-cream/50"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.8 }}
          >
            Since 1952, we have shaped heat into memory. Every radiator carries
            the warmth of hands that understood fire.
          </motion.p>

          {/* Right column */}
          <motion.p
            className="max-w-sm text-sm text-cream/50 md:text-right"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.0 }}
          >
            From a small Karaköy workshop to homes across the world. 82 degrees
            — the temperature where comfort becomes legacy.
          </motion.p>
        </div>
      </div>

      {/* ─── Scroll indicator ─── */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="relative w-px h-16 bg-cream/20 overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-terracotta"
            style={{ animation: "hero-scrollDot 2.4s ease-in-out infinite" }}
          />
        </div>
      </div>
    </section>
  );
}
