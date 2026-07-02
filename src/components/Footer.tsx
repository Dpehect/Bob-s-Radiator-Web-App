"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BRAND, NAV_LINKS } from "@/lib/constants";
import { fadeUp, staggerContainer } from "@/lib/motion";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.footer
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="bg-charcoal border-t border-cream/5 py-16 md:py-24 px-[clamp(24px,5vw,80px)]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          {/* Brand */}
          <motion.div variants={fadeUp} className="space-y-3">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-cream">
              82°
            </h2>
            <p className="text-cream/30 text-sm max-w-xs leading-relaxed">
              {BRAND.tagline}. Premium artisanal radiators handcrafted with
              seven decades of fire and memory.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div variants={fadeUp} className="flex gap-12 md:gap-16">
            <div className="space-y-3">
              <p className="text-[10px] tracking-[0.3em] uppercase text-cream/20 font-medium">
                Navigate
              </p>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-cream/50 hover:text-terracotta transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-[10px] tracking-[0.3em] uppercase text-cream/20 font-medium">
                Connect
              </p>
              <a
                href="#"
                className="block text-sm text-cream/50 hover:text-terracotta transition-colors duration-300"
              >
                Instagram
              </a>
              <a
                href="#"
                className="block text-sm text-cream/50 hover:text-terracotta transition-colors duration-300"
              >
                Pinterest
              </a>
              <a
                href="#"
                className="block text-sm text-cream/50 hover:text-terracotta transition-colors duration-300"
              >
                Behance
              </a>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div variants={fadeUp} className="w-full h-px bg-cream/5 mb-8" />

        {/* Bottom row */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-[11px] tracking-[0.2em] uppercase text-cream/20">
            {BRAND.founded} — {BRAND.location}
          </p>
          <p className="text-[11px] text-cream/15">
            © {new Date().getFullYear()} {BRAND.fullName}. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
