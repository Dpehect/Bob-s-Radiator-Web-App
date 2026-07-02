"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import AnimatedText from "@/components/ui/AnimatedText";
import { fadeUp } from "@/lib/motion";

interface GalleryCard {
  label: string;
  rotation: number;
  translateY?: number;
  gradient: string;
}

/* ─── Gallery card data ─── */
const galleryCards: GalleryCard[] = [
  {
    label: "The Workshop, 1952",
    rotation: 3,
    gradient: "from-charcoal to-charcoal-light",
  },
  {
    label: "Master Ironwork",
    rotation: -2,
    translateY: 16,
    gradient: "from-deep-red to-terracotta",
  },
  {
    label: "Living Heritage",
    rotation: 5,
    gradient: "from-charcoal-light to-brass/30",
  },
];

const cardSpring = { type: "spring" as const, stiffness: 200, damping: 20 };

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section
      id="story"
      ref={sectionRef}
      className="bg-warm-white py-[clamp(80px,10vw,160px)] px-[clamp(24px,5vw,80px)]"
    >
      {/* ── Label ── */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="uppercase tracking-[0.3em] text-terracotta font-sans text-xs font-medium text-center"
      >
        OUR STORY
      </motion.p>

      {/* ── Heading ── */}
      <AnimatedText
        text="Forged by Hand Warmed by Heart"
        as="h2"
        className="text-[clamp(36px,6vw,96px)] text-center text-charcoal max-w-4xl mx-auto"
      />

      {/* ── Body paragraph ── */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ delay: 0.3 }}
        className="text-smoke text-[clamp(14px,1.1vw,18px)] leading-relaxed max-w-2xl mx-auto text-center mt-8"
      >
        In 1952, in a narrow Karaköy workshop where the Bosphorus winds met the
        furnace heat, master ironworker Mehmet Boran cast his first radiator. He
        set the water temperature to exactly 82°C — the precise point where
        warmth stops being mechanical and starts feeling like someone who cares
        is in the room. Seven decades later, every radiator we shape still
        carries that philosophy: heat should have memory, weight, and soul.
      </motion.p>

      {/* ── Gallery ── */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mt-20">
        {galleryCards.map((card) => (
          <motion.div
            key={card.label}
            className={`
              w-[clamp(200px,22vw,320px)] aspect-[3/4] rounded-2xl overflow-hidden
              relative group bg-gradient-to-br ${card.gradient}
            `}
            initial={{
              rotate: card.rotation,
              y: card.translateY ?? 0,
            }}
            whileHover={{
              rotate: 0,
              scale: 1.05,
              y: 0,
              boxShadow: "0 25px 60px rgba(28, 24, 20, 0.25)",
            }}
            transition={cardSpring}
          >
            {/* Bottom-left label */}
            <span className="absolute bottom-4 left-4 text-cream text-xs tracking-wider uppercase">
              {card.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
