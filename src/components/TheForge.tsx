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
      className="relative flex gap-8 md:gap-12"
    >
      {/* Timeline line & dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className={`w-3 h-3 rounded-full border-2 transition-colors duration-700 ${
            isInView
              ? "bg-terracotta border-terracotta"
              : "bg-transparent border-charcoal/20"
          }`}
        />
        {!isLast && (
          <div className="w-px flex-1 bg-charcoal/10 mt-2" />
        )}
      </div>

      {/* Content */}
      <div className="pb-16 md:pb-20">
        <span className="font-display text-[clamp(40px,4vw,64px)] font-black text-charcoal/10 leading-none block mb-2">
          {item.year}
        </span>
        <h3 className="font-display text-[clamp(20px,1.8vw,28px)] font-bold text-charcoal mb-3">
          {item.title}
        </h3>
        <p className="text-smoke text-[clamp(13px,0.95vw,16px)] leading-relaxed max-w-md">
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

  // Subtle parallax on the year watermark
  const yearY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      ref={sectionRef}
      id="forge"
      className="relative bg-cream py-[clamp(80px,10vw,160px)] px-[clamp(24px,5vw,80px)]"
    >
      {/* Background watermark */}
      <motion.div
        style={{ y: yearY }}
        className="absolute top-1/2 right-[5vw] -translate-y-1/2 pointer-events-none select-none"
      >
        <span className="font-display text-[clamp(100px,18vw,300px)] font-black text-charcoal/[0.03] leading-none">
          1952
        </span>
      </motion.div>

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-xs tracking-[0.3em] uppercase text-terracotta font-sans font-medium mb-4"
        >
          THE FORGE
        </motion.p>
        <AnimatedText
          text="Seven Decades of Fire"
          className="text-[clamp(36px,5.5vw,80px)] text-charcoal"
        />
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.3 }}
          className="text-smoke text-[clamp(14px,1vw,17px)] leading-relaxed max-w-lg mx-auto mt-6"
        >
          From a single workshop to a legacy that spans generations. Each
          milestone shaped by the same fire that lit the first furnace.
        </motion.p>
      </div>

      {/* Timeline */}
      <motion.div
        variants={staggerContainerSlow}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-2xl mx-auto"
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
