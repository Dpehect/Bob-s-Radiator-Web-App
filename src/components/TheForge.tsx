"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { TIMELINE } from "@/lib/constants";
import { fadeUp, staggerContainerSlow } from "@/lib/motion";
import AnimatedText from "@/components/ui/AnimatedText";

function TimelineCard({
  item,
  index,
  isLast,
}: {
  item: (typeof TIMELINE)[number];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ delay: index * 0.1 }}
      className="relative flex gap-8 md:gap-12 text-black-pure"
    >
      {/* Timeline line & dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-700 ${
            isInView
              ? "bg-electric-orange border-electric-orange scale-110 shadow-[0_0_8px_var(--color-electric-orange)]"
              : "bg-transparent border-black-pure/15"
          }`}
        />
        {!isLast && (
          <div className="w-[1.5px] flex-1 bg-black-pure/5 mt-2" />
        )}
      </div>

      {/* Content */}
      <div className="pb-16 md:pb-20">
        <span className="font-display text-[clamp(44px,4.5vw,72px)] font-black text-black-pure/5 leading-none block mb-2 tracking-tighter">
          {item.year}
        </span>
        <h3 className="font-display text-[clamp(22px,2vw,30px)] font-black text-black-pure mb-3 tracking-tight">
          {item.title}
        </h3>
        <p className="text-smoke text-[clamp(14px,0.95vw,16px)] leading-relaxed max-w-md font-light">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function TheForge() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax watermark scroll offset
  const yearY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section
      ref={sectionRef}
      id="forge"
      className="relative bg-warm-cream py-[8vw] px-[5vw] overflow-visible"
    >
      {/* ── Organic Wave Cut from Collection ── */}
      <div className="absolute top-0 left-0 w-full h-[6vw] -translate-y-[99%] overflow-hidden pointer-events-none z-10">
        <svg className="w-full h-full block" viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 C360,30 720,70 1080,30 1440,100 Z" fill="var(--color-warm-cream)" />
        </svg>
      </div>

      {/* Background watermark */}
      <motion.div
        style={{ y: yearY }}
        className="absolute top-1/2 right-[5vw] -translate-y-1/2 pointer-events-none select-none"
      >
        <span className="font-display text-[clamp(100px,18vw,320px)] font-black text-black-pure/[0.02] leading-none tracking-tighter">
          1952
        </span>
      </motion.div>

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-24 space-y-4">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-xs tracking-[0.35em] uppercase text-electric-orange font-sans font-bold"
        >
          THE FORGE
        </motion.p>
        <AnimatedText
          text="Seven Decades of Fire"
          className="text-[clamp(44px,7vw,110px)] text-black-pure font-black tracking-[-0.05em] leading-none"
        />
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.35 }}
          className="text-smoke text-[clamp(15px,1.1vw,18px)] leading-relaxed max-w-md mx-auto font-light"
        >
          From Mehmet&apos;s first furnace to digital telemetry geometries. A timeline
          of handcrafted thermal monuments.
        </motion.p>
      </div>

      {/* Timeline List */}
      <motion.div
        variants={staggerContainerSlow}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-2xl mx-auto relative z-10"
      >
        {TIMELINE.map((item, index) => (
          <TimelineCard
            key={item.year}
            item={item}
            index={index}
            isLast={index === TIMELINE.length - 1}
          />
        ))}
      </motion.div>
    </section>
  );
}
