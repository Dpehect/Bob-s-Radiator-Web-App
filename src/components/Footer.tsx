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
      className="bg-black-pure border-t border-warm-white/5 py-16 md:py-24 px-[5vw]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          {/* Brand */}
          <motion.div variants={fadeUp} className="space-y-4">
            <h2 className="font-display text-4xl md:text-5xl font-black text-warm-white tracking-tighter">
              82°
            </h2>
            <p className="text-editorial-gray/60 text-xs max-w-xs leading-relaxed font-light">
              {BRAND.tagline}. Premium artisanal radiators handcrafted with
              seven decades of fire and memory.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div variants={fadeUp} className="flex gap-16 md:gap-20">
            <div className="space-y-4">
              <p className="text-[9px] tracking-[0.3em] uppercase text-electric-orange font-bold">
                Navigate
              </p>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-xs text-editorial-gray hover:text-warm-white transition-colors duration-300 font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="space-y-4">
              <p className="text-[9px] tracking-[0.3em] uppercase text-warm-white/30 font-bold">
                Connect
              </p>
              <a
                href="#"
                className="block text-xs text-editorial-gray hover:text-warm-white transition-colors duration-300 font-medium"
              >
                Instagram
              </a>
              <a
                href="#"
                className="block text-xs text-editorial-gray hover:text-warm-white transition-colors duration-300 font-medium"
              >
                Pinterest
              </a>
              <a
                href="#"
                className="block text-xs text-editorial-gray hover:text-warm-white transition-colors duration-300 font-medium"
              >
                Behance
              </a>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div variants={fadeUp} className="w-full h-px bg-warm-white/5 mb-8" />

        {/* Bottom row */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-[9px] tracking-[0.2em] uppercase text-editorial-gray/40 font-bold">
            {BRAND.founded} — {BRAND.location}
          </p>
          <p className="text-[10px] text-editorial-gray/30 font-light">
            © {new Date().getFullYear()} {BRAND.fullName}. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
