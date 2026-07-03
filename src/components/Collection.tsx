"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PRODUCTS } from "@/lib/constants";
import { fadeUp, staggerContainer, smoothSpring } from "@/lib/motion";
import AnimatedText from "@/components/ui/AnimatedText";

interface ProductCardProps {
  product: (typeof PRODUCTS)[number];
  index: number;
}

function ProductCard({ product, index }: ProductCardProps) {
  // Stagger rotation of cards to create an organic, hand-crafted, misaligned feel
  const initialRotate = index % 2 === 0 ? 1.5 : -1.5;
  const translateYOffset = index % 2 === 0 ? 0 : 15;

  return (
    <motion.div
      variants={fadeUp}
      className="group relative flex-shrink-0 w-[clamp(300px,26vw,440px)] snap-start cursor-pointer"
      style={{ y: translateYOffset }}
    >
      <motion.div
        initial={{ rotate: initialRotate }}
        whileHover={{
          scale: 1.05,
          y: -15,
          rotate: 0,
          boxShadow: "0 30px 80px rgba(28, 24, 20, 0.18)",
          transition: smoothSpring,
        }}
        className="relative rounded-[32px] overflow-hidden bg-charcoal p-8 pb-7 
                   border border-cream/5
                   shadow-[0_10px_35px_rgba(28,24,20,0.06)]
                   transition-shadow duration-500"
      >
        {/* Transparent Watermark Serial behind */}
        <span className="text-stroke-thin text-transparent font-display text-[72px] font-black absolute -top-4 -left-2 opacity-5 pointer-events-none select-none">
          82°
        </span>

        {/* ── Sticker Badge ── */}
        <motion.div
          variants={{
            rest: { rotate: index * 45 - 10, scale: 1 },
            hover: { rotate: index * 45 + 15, scale: 1.1, transition: smoothSpring },
          }}
          initial="rest"
          whileHover="hover"
          className="absolute top-5 right-5 z-20 w-14 h-14 rounded-full 
                     bg-terracotta border border-cream/10 
                     flex items-center justify-center text-center shadow-lg
                     pointer-events-none"
        >
          <span className="font-display text-[9px] font-bold tracking-widest text-cream uppercase rotate-12 leading-none">
            Mehmet<br/>1952
          </span>
        </motion.div>

        {/* ── 3D Radiator Render Showcase ── */}
        <div
          className="w-full aspect-[4/5] rounded-[24px] mb-8 flex items-center justify-center relative overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #1C1814 0%, #2A2420 100%)",
            border: "1px solid rgba(245, 227, 205, 0.05)",
          }}
        >
          {/* Pulsing Ember Glow Overlay */}
          <div
            className="absolute inset-0 opacity-15 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${product.color} 0%, transparent 70%)`,
            }}
          />

          {/* Visual Radiator Structure */}
          <div className="relative w-[75%] h-[80%] flex flex-col justify-between items-center z-10">
            {/* Top copper tube header */}
            <div
              className="w-full h-4 rounded-full bg-gradient-to-r from-brass/80 via-brass-light/90 to-brass/80 shadow-md"
              style={{ filter: "brightness(0.95)" }}
            />

            {/* Vertical Columns */}
            <div className="flex justify-between items-center w-[92%] h-[80%] px-1">
              {Array.from({ length: product.specs.columns }).map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-full rounded-full relative overflow-hidden shadow-inner"
                  style={{
                    background: `linear-gradient(90deg, #141210 0%, ${product.color} 50%, #141210 100%)`,
                  }}
                >
                  {/* Highlight Specular Glare */}
                  <div className="absolute top-0 left-[20%] w-[1.5px] h-full bg-cream/15 opacity-60" />
                </div>
              ))}
            </div>

            {/* Bottom copper tube header */}
            <div
              className="w-full h-4 rounded-full bg-gradient-to-r from-brass/80 via-brass-light/90 to-brass/80 shadow-md"
              style={{ filter: "brightness(0.95)" }}
            />

            {/* Brass Valve details on left */}
            <div className="absolute -left-3 bottom-1 w-2.5 h-6 bg-brass rounded-sm opacity-80" />
            <div className="absolute -left-4 bottom-5 w-4 h-4 bg-brass-light rounded-full border border-charcoal opacity-90 shadow-md" />
          </div>
        </div>

        {/* ── Copy content details ── */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-[clamp(22px,2vw,30px)] text-cream font-extrabold uppercase tracking-tight">
              {product.name}
            </h3>
            <span className="text-[10px] tracking-[0.25em] uppercase text-cream/40 font-semibold font-sans">
              {product.specs.height}
            </span>
          </div>
          
          <p className="text-[13px] tracking-widest text-brass font-sans uppercase font-bold">
            {product.subtitle}
          </p>
          
          <p className="text-[14px] text-cream/55 leading-relaxed font-sans font-normal h-12 overflow-hidden">
            {product.description}
          </p>

          {/* Specs row */}
          <div className="flex gap-5 pt-4 border-t border-cream/10 mt-5 text-[11px] text-cream/40 uppercase tracking-widest font-semibold">
            <span>
              {product.specs.columns} Columns
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta/40 self-center" />
            <span>
              {product.specs.output}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Collection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      ref={ref}
      id="collection"
      className="relative bg-warm-white py-[8vw] px-[5vw] overflow-hidden"
    >
      {/* Header layout */}
      <div className="mb-20 max-w-4xl mx-auto text-center space-y-4">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-xs tracking-[0.35em] uppercase text-terracotta font-sans font-bold"
        >
          THE COLLECTION
        </motion.p>
        <AnimatedText
          text="Five Forms of Warmth"
          className="text-[clamp(44px,7vw,110px)] text-charcoal font-black"
        />
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.35 }}
          className="text-smoke text-[clamp(15px,1.1vw,18px)] leading-relaxed max-w-xl mx-auto"
        >
          Each radiator is a structural sculpture with its own story, cast from
          seven decades of furnace heritage.
        </motion.p>
      </div>

      {/* Horizontal snapping scroller cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="flex gap-8 pb-10 pt-2 overflow-x-auto 
                   scrollbar-hide snap-x snap-mandatory
                   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
                   px-[2vw]"
      >
        {PRODUCTS.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </motion.div>

      {/* Scrolling Indicator dots for visual feedback */}
      <div className="flex justify-center gap-2 mt-8">
        {PRODUCTS.map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-charcoal/10 hover:bg-charcoal/30 transition-colors"
          />
        ))}
      </div>
    </section>
  );
}
