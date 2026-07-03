"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import AnimatedText from "@/components/ui/AnimatedText";
import { fadeUp } from "@/lib/motion";

interface GalleryCard {
  label: string;
  rotation: number;
  translateY?: number;
  gradient: string;
  sub: string;
  src: string;
}

/* ─── Gallery card data ─── */
const galleryCards: GalleryCard[] = [
  {
    label: "The Workshop",
    sub: "Karaköy 1952",
    rotation: 3.5,
    gradient: "from-charcoal via-charcoal-light to-charcoal",
    src: "/bob_workshop.jpg",
  },
  {
    label: "Master Cast",
    sub: "Mehmet Boran",
    rotation: -2,
    translateY: 15,
    gradient: "from-deep-red to-terracotta",
    src: "/radiator_brass.jpg",
  },
  {
    label: "Living Heritage",
    sub: "70 Years Legacy",
    rotation: 5,
    gradient: "from-charcoal-light to-brass/35",
    src: "/artisan_bench.jpg",
  },
];

const cardSpring = { type: "spring" as const, stiffness: 200, damping: 22 };

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section
      id="story"
      ref={sectionRef}
      className="bg-warm-white py-[8vw] px-[5vw] relative overflow-visible text-black-pure"
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
          <span className="font-display text-[64px] font-black text-electric-orange float-left mr-3 line-height-none mt-1">I</span>
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
          <span className="font-display text-[64px] font-black text-black-pure float-left mr-3 line-height-none mt-1">S</span>
          even decades later, every radiator we shape still
          carries that philosophy: heat should have memory, weight, and soul.
          Each metal vertical column is sand-cast, hand-filed, and individually
          tested to align with our timeless metallurgical heritage.
        </motion.p>
      </div>

      {/* ── Gallery Grid ── */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8 mt-20 max-w-5xl mx-auto">
        {galleryCards.map((card, i) => (
          <motion.div
            key={card.label}
            className={`
              w-[clamp(240px,24vw,340px)] aspect-[3/4] rounded-[28px] overflow-hidden
              relative group bg-gradient-to-br ${card.gradient}
              border border-cream/5 p-6 flex flex-col justify-between
              cursor-pointer shadow-[0_10px_35px_rgba(28,24,20,0.06)]
            `}
            initial={{
              rotate: card.rotation,
              y: card.translateY ?? 0,
            }}
            whileHover={{
              rotate: 0,
              scale: 1.05,
              y: 0,
              boxShadow: "0 30px 80px rgba(28, 24, 20, 0.22)",
            }}
            transition={cardSpring}
          >
            {/* Background Image Cover */}
            <Image
              src={card.src}
              alt={card.label}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="absolute inset-0 w-full h-full object-cover z-0 
                         transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                         group-hover:scale-110"
            />

            {/* Dark tint overlay for reading contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black-pure/90 via-black-pure/20 to-black-pure/40 z-5" />

            {/* Corner Bracket Highlights */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-cream/15 group-hover:border-cream/35 transition-colors z-10" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-cream/15 group-hover:border-cream/35 transition-colors z-10" />

            {/* Top row */}
            <div className="flex justify-between items-start z-10">
              <span className="text-[10px] tracking-[0.2em] text-cream/40 uppercase font-sans font-bold">
                0{i + 1}
              </span>
              <span className="text-[9px] tracking-wider text-electric-orange font-sans uppercase font-bold">
                Active Archive
              </span>
            </div>

            {/* Warm ember hover glow inside card */}
            <div className="absolute inset-0 bg-radial from-electric-orange/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-5" />

            {/* Bottom labels */}
            <div className="space-y-1 z-10 text-warm-white">
              <h3 className="font-display text-[22px] font-bold tracking-tight">
                {card.label}
              </h3>
              <p className="text-cream/50 font-sans text-xs tracking-widest uppercase font-bold">
                {card.sub}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
