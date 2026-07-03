"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import AnimatedText from "@/components/ui/AnimatedText";
import { fadeUp } from "@/lib/motion";

interface GalleryCard {
  label: string;
  sub: string;
  src: string;
  gridSpan: string; // Tailwind Grid Span configurations for Bento Grid layout
}

/* ─── Gallery card data ─── */
const galleryCards: GalleryCard[] = [
  {
    label: "The Karaköy Workshop",
    sub: "Est. 1952 — Karaköy, Istanbul",
    src: "/bob_workshop.jpg",
    gridSpan: "md:col-span-2 md:row-span-1 h-[300px] md:h-auto",
  },
  {
    label: "Master Cast",
    sub: "Mehmet Boran casting raw iron patterns",
    src: "/radiator_brass.jpg",
    gridSpan: "md:col-span-1 md:row-span-2 h-[400px] md:h-auto",
  },
  {
    label: "Metallurgical Heritage",
    sub: "Decades of manual heat craftsmanship",
    src: "/artisan_bench.jpg",
    gridSpan: "md:col-span-2 md:row-span-1 h-[300px] md:h-auto",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section
      id="story"
      ref={sectionRef}
      className="bg-warm-white py-section px-[5vw] relative overflow-visible text-black-pure"
    >
      {/* ── Organic Wave Cut from Hero ── */}
      <div className="absolute top-0 left-0 w-full h-[6vw] -translate-y-[99%] overflow-hidden pointer-events-none z-10">
        <svg className="w-full h-full block" viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 C360,20 720,80 1080,40 1440,100 Z" fill="var(--color-warm-white)" />
        </svg>
      </div>

      {/* Subtle outline grid background */}
      <div className="absolute right-0 top-0 w-80 h-80 border-r border-t border-charcoal/5 pointer-events-none select-none" />

      {/* ── Label ── */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="uppercase tracking-[0.35em] text-electric-orange font-sans text-xs font-bold text-center mb-4"
      >
        OUR STORY
      </motion.p>

      {/* ── Heading ── */}
      <AnimatedText
        text="Forged by Hand Warmed by Heart"
        as="h2"
        className="text-[clamp(44px,7vw,110px)] text-center text-black-pure max-w-4xl mx-auto font-black leading-none tracking-[-0.05em]"
      />

      {/* ── Asymmetric Two Column Layout with Drop Caps ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 max-w-4xl mx-auto text-smoke text-[clamp(15px,1.1vw,18px)] leading-relaxed font-light">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.3 }}
        >
          <span className="font-display text-[64px] font-black text-electric-orange float-left mr-3 mt-1 leading-none">I</span>
          n 1952, in a narrow Karaköy workshop where the Bosphorus winds met the
          furnace heat, master ironworker Mehmet Boran cast his first radiator. He
          set the water temperature to exactly 82°C — the precise point where
          warmth stops being mechanical and starts feeling like someone who cares
          is in the room.
        </motion.p>
        
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.4 }}
        >
          <span className="font-display text-[64px] font-black text-black-pure float-left mr-3 mt-1 leading-none">S</span>
          even decades later, every radiator we shape still
          carries that philosophy: heat should have memory, weight, and soul.
          Each metal vertical column is sand-cast, hand-filed, and individually
          tested to align with our timeless metallurgical heritage.
        </motion.p>
      </div>

      {/* ── Bento-Box Layout Grid with Dense Autoresolution ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:grid-rows-2 grid-flow-row-dense mt-24 max-w-5xl mx-auto overflow-x-visible">
        {galleryCards.map((card, i) => (
          <motion.div
            key={card.label}
            className={`
              ${card.gridSpan}
              relative rounded-[32px] overflow-visible group bg-charcoal
              border border-black-pure/5 flex flex-col justify-between p-8
              cursor-pointer transition-all duration-300 ease-out
            `}
            initial={{ opacity: 0, y: 55, skewY: 2.5 }}
            whileInView={{ opacity: 1, y: 0, skewY: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            whileHover={{
              scale: 1.02,
              boxShadow: "20px 20px 0px var(--color-electric-orange)",
              transition: { duration: 0.2, ease: "easeOut" },
            }}
          >
            {/* Bleeding Edge Image overflow wrapper */}
            <div className="absolute inset-0 rounded-[32px] overflow-hidden z-0">
              <Image
                src={card.src}
                alt={card.label}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="absolute inset-0 w-full h-full object-cover z-0 
                           transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                           group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black-pure/95 via-black-pure/20 to-black-pure/45 z-5" />
            </div>

            {/* Corner Bracket Highlights */}
            <div className="absolute top-5 left-5 w-4 h-4 border-t border-l border-cream/15 group-hover:border-cream/35 transition-colors z-10" />
            <div className="absolute bottom-5 right-5 w-4 h-4 border-b border-r border-cream/15 group-hover:border-cream/35 transition-colors z-10" />

            {/* Top row */}
            <div className="flex justify-between items-start z-10">
              <span className="text-[10px] tracking-[0.2em] text-cream/40 uppercase font-sans font-bold">
                0{i + 1}
              </span>
              <span className="text-[9px] tracking-wider text-electric-orange font-sans uppercase font-bold">
                Bento Spread / 0{i + 1}
              </span>
            </div>

            {/* Bottom labels */}
            <div className="space-y-1.5 z-10 text-warm-white mt-16 md:mt-24">
              <h3 className="font-display text-[24px] font-black tracking-tight leading-none uppercase">
                {card.label}
              </h3>
              <p className="text-cream/55 font-sans text-xs tracking-widest uppercase font-bold">
                {card.sub}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
