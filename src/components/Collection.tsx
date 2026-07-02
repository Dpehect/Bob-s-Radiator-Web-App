"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { PRODUCTS } from "@/lib/constants";
import { fadeUp, staggerContainer, smoothSpring } from "@/lib/motion";
import AnimatedText from "@/components/ui/AnimatedText";

function ProductCard({
  product,
}: {
  product: (typeof PRODUCTS)[number];
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="group relative flex-shrink-0 w-[clamp(280px,30vw,400px)] cursor-pointer"
    >
      <motion.div
        whileHover={{
          scale: 1.04,
          y: -12,
          transition: smoothSpring,
        }}
        className="relative rounded-3xl overflow-hidden bg-charcoal p-8 pb-6 
                   shadow-[0_4px_24px_rgba(28,24,20,0.08)]
                   group-hover:shadow-[0_24px_64px_rgba(28,24,20,0.18)]
                   transition-shadow duration-500"
      >
        {/* Radiator visual placeholder */}
        <div
          className="w-full aspect-[4/5] rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${product.color} 0%, ${product.color}dd 50%, ${product.color}99 100%)`,
          }}
        >
          {/* Column lines to suggest radiator form */}
          <div className="flex gap-[clamp(4px,0.6vw,10px)] items-center h-[70%] opacity-30">
            {Array.from({ length: product.specs.columns }).map((_, i) => (
              <div
                key={i}
                className="w-[clamp(3px,0.4vw,6px)] h-full rounded-full bg-cream/40
                           group-hover:bg-cream/60 transition-colors duration-500"
                style={{ animationDelay: `${i * 0.05}s` }}
              />
            ))}
          </div>
          {/* Glow on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: `radial-gradient(circle at 50% 60%, ${product.color}40 0%, transparent 60%)`,
            }}
          />
        </div>

        {/* Text content */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-[clamp(20px,1.8vw,28px)] text-cream font-bold">
              {product.name}
            </h3>
            <span className="text-[11px] tracking-[0.2em] uppercase text-cream/30 font-sans">
              {product.specs.height}
            </span>
          </div>
          <p className="text-[13px] italic text-brass font-display">
            {product.subtitle}
          </p>
          <p className="text-[clamp(12px,0.85vw,14px)] text-cream/50 leading-relaxed font-sans">
            {product.description}
          </p>

          {/* Specs row */}
          <div className="flex gap-4 pt-3 border-t border-cream/10 mt-4">
            <span className="text-[11px] text-cream/30 tracking-wider uppercase">
              {product.specs.columns} Columns
            </span>
            <span className="text-[11px] text-cream/30 tracking-wider uppercase">
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
      className="relative bg-warm-white py-[clamp(80px,10vw,160px)] overflow-hidden"
    >
      {/* Header */}
      <div className="px-[clamp(24px,5vw,80px)] mb-16">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-xs tracking-[0.3em] uppercase text-terracotta font-sans font-medium text-center mb-4"
        >
          THE COLLECTION
        </motion.p>
        <AnimatedText
          text="Five Forms of Warmth"
          className="text-[clamp(36px,5.5vw,80px)] text-center text-charcoal max-w-4xl mx-auto"
        />
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.3 }}
          className="text-smoke text-[clamp(14px,1vw,17px)] leading-relaxed max-w-lg mx-auto text-center mt-6"
        >
          Each radiator is a character with its own story, shaped by seven
          decades of craft and the hands that understood fire.
        </motion.p>
      </div>

      {/* Scrolling cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="flex gap-6 px-[clamp(24px,5vw,80px)] pb-4 overflow-x-auto 
                   scrollbar-hide snap-x snap-mandatory
                   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>

      {/* Scroll hint on mobile */}
      <div className="md:hidden flex justify-center mt-6">
        <div className="flex gap-1.5">
          {PRODUCTS.map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-charcoal/15"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
