"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PRODUCTS } from "@/lib/constants";
import { fadeUp, staggerContainer } from "@/lib/motion";
import AnimatedText from "@/components/ui/AnimatedText";

interface ProductCardProps {
  product: (typeof PRODUCTS)[number];
  index: number;
}

function ProductCard({ product, index }: ProductCardProps) {
  // Offset rotations for custom editorial hand-crafted layouts
  const initialRotate = index % 2 === 0 ? 1.0 : -1.0;
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
          scale: 1.02,
          y: -8,
          rotate: 0,
          boxShadow: "20px 20px 0px var(--color-electric-orange)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative rounded-[32px] overflow-hidden bg-charcoal p-8 pb-7 
                   border border-electric-orange/5 hover:border-electric-orange/30
                   shadow-[0_10px_35px_rgba(0,0,0,0.4)]
                   transition-all duration-500"
      >
        {/* Oversized text-stroke index number */}
        <span className="text-stroke-white text-transparent font-display text-[96px] font-black absolute -top-8 -right-2 opacity-10 pointer-events-none select-none">
          0{index + 1}
        </span>

        {/* ── 3D Radiator Outline Showcase ── */}
        <div
          className="w-full aspect-[4/5] rounded-[24px] mb-8 flex items-center justify-center relative overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #030303 0%, #0A0A0A 100%)",
            border: "1px solid rgba(255, 69, 0, 0.05)",
          }}
        >
          {/* Pulsing Ember Glow Overlay */}
          <div
            className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, var(--color-electric-orange) 0%, transparent 70%)`,
            }}
          />

          {/* Visual Radiator Structure */}
          <div className="relative w-[75%] h-[80%] flex flex-col justify-between items-center z-10">
            {/* Top copper tube header */}
            <div className="w-full h-1.5 rounded-full bg-electric-orange/30 group-hover:bg-electric-orange/80 transition-colors shadow-md" />

            {/* Vertical Columns */}
            <div className="flex justify-between items-center w-[92%] h-[80%] px-1">
              {Array.from({ length: product.specs.columns }).map((_, i) => (
                <div
                  key={i}
                  className="w-[3px] h-full rounded-full relative overflow-hidden"
                  style={{
                    background: `linear-gradient(90deg, #141210 0%, var(--color-electric-orange) 50%, #141210 100%)`,
                    opacity: 0.35 + (i % 3) * 0.15,
                  }}
                />
              ))}
            </div>

            {/* Bottom copper tube header */}
            <div className="w-full h-1.5 rounded-full bg-electric-orange/30 group-hover:bg-electric-orange/80 transition-colors shadow-md" />
          </div>
        </div>

        {/* ── Copy details ── */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-[clamp(22px,2vw,30px)] text-warm-white font-black uppercase tracking-tight">
              {product.name}
            </h3>
            <span className="text-[10px] tracking-[0.25em] uppercase text-electric-orange font-bold font-sans">
              {product.specs.height}
            </span>
          </div>
          
          <p className="text-[12px] tracking-widest text-editorial-gray font-sans uppercase font-bold">
            {product.subtitle}
          </p>
          
          <p className="text-[14px] text-editorial-gray/70 leading-relaxed font-sans font-light h-12 overflow-hidden">
            {product.description}
          </p>

          {/* Specs row */}
          <div className="flex gap-5 pt-4 border-t border-editorial-gray/10 mt-5 text-[10px] text-editorial-gray/40 uppercase tracking-widest font-bold">
            <span>
              {product.specs.columns} Columns
            </span>
            <span className="w-1 h-1 rounded-full bg-electric-orange self-center animate-ping" />
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
      className="relative bg-warm-white py-[8vw] px-[5vw] overflow-hidden text-black-pure"
    >
      {/* Header layout */}
      <div className="mb-20 max-w-4xl mx-auto text-center space-y-4">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-xs tracking-[0.35em] uppercase text-electric-orange font-sans font-bold"
        >
          THE COLLECTION
        </motion.p>
        <AnimatedText
          text="Five Forms of Warmth"
          className="text-[clamp(44px,7vw,110px)] text-black-pure font-black tracking-[-0.05em] leading-none"
        />
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.35 }}
          className="text-smoke text-[clamp(15px,1.1vw,18px)] leading-relaxed max-w-xl mx-auto font-light"
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
            className="w-1.5 h-1.5 rounded-full bg-black-pure/10 hover:bg-black-pure/30 transition-colors"
          />
        ))}
      </div>
    </section>
  );
}
